'use client'

import { CursorPresence } from '@/app/(dashboard)/_components/cursors-presence'
import { SelectionBox } from '@/app/(dashboard)/_components/selection-box'
import { Info } from '@/app/board/[boardId]/_components/info'
import { LayerPreview } from '@/app/board/[boardId]/_components/layer-preview'
import { Participants } from '@/app/board/[boardId]/_components/participants'
import { SelectionTool } from '@/app/board/[boardId]/_components/selection-tool'
import { Toolbar } from '@/app/board/[boardId]/_components/toolbar'
import {
  connectionIdToColor,
  pointerEventToCanvasPoint,
  resizeBounds,
} from '@/lib/utils'
import {
  Camera,
  CanvasMode,
  CanvasState,
  Color,
  LayerType,
  Point,
  Side,
  XYWH,
} from '@/types/canvas'
import { LiveObject } from '@liveblocks/node'
import {
  useCanRedo,
  useCanUndo,
  useHistory,
  useMutation,
  useOthersMapped,
  useStorage,
} from '@liveblocks/react/suspense'
import { nanoid } from 'nanoid'
import React, { useCallback, useMemo, useState } from 'react'

const MAX_LAYERS = 100

interface CanvasProps {
  boardId: string
}

export const Canvas = ({ boardId }: CanvasProps) => {
  const layerIds = useStorage((root) => root.layerIds)

  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  })

  const [camera, setCamera] = useState<Camera>({
    x: 0,
    y: 0,
  })
  const [lastUsedColor, setLastUsedColor] = useState<Color>({
    r: 255,
    g: 255,
    b: 255,
  })

  const history = useHistory()
  const canUndo = useCanUndo()
  const canRedo = useCanRedo()

  const insertLayer = useMutation(
    (
      { storage, setMyPresence },
      layerType:
        | LayerType.Ellipse
        | LayerType.Note
        | LayerType.Rectangle
        | LayerType.Text,
      position: Point,
    ) => {
      const liveLayers = storage.get('layers')
      if (liveLayers.size >= MAX_LAYERS) {
        return
      }

      const liveLayerIds = storage.get('layerIds')
      const layerId = nanoid()

      const layer = new LiveObject({
        type: layerType,
        x: position.x,
        y: position.y,
        height: 100,
        width: 100,
        fill: lastUsedColor,
      })

      liveLayerIds.push(layerId)
      liveLayers.set(layerId, layer)

      setMyPresence(
        {
          selection: [layerId],
        },
        {
          addToHistory: true,
        },
      )
      setCanvasState({
        mode: CanvasMode.None,
      })
    },
    [lastUsedColor],
  )

  const unSelectedLayer = useMutation(({ self, setMyPresence }) => {
    if (self.presence.selection.length > 0) {
      setMyPresence(
        {
          selection: [],
        },
        {
          addToHistory: true,
        },
      )
    }
  }, [])

  const resizeSelectedLayer = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Resizing) {
        return
      }

      const bounds = resizeBounds(
        canvasState.initialBounds,
        canvasState.corner,
        point,
      )

      const liveLayers = storage.get('layers')
      const layer = liveLayers.get(self.presence.selection[0])

      if (layer) {
        layer.update(bounds)
      }
    },
    [canvasState],
  )

  const translateSelectedLayer = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Translating) {
        return
      }

      const offset = {
        x: point.x - canvasState.current.x,
        y: point.y - canvasState.current.y,
      }

      const liveLayers = storage.get('layers')

      for (const layerId of self.presence.selection) {
        const layer = liveLayers.get(layerId)

        if (layer) {
          layer.update({
            x: layer.get('x') + offset.x,
            y: layer.get('y') + offset.y,
          })
        }
      }

      setCanvasState({ mode: CanvasMode.Translating, current: point })
    },
    [canvasState],
  )

  const onResizeHandlePointerDown = useCallback(
    (corner: Side, initialBounds: XYWH) => {
      history.pause()
      setCanvasState({
        mode: CanvasMode.Resizing,
        initialBounds,
        corner,
      })
    },
    [history],
  )

  const onWheel = useCallback((e: React.WheelEvent) => {
    setCamera((prevCamera) => {
      return {
        x: prevCamera.x - e.deltaX,
        y: prevCamera.y - e.deltaY,
      }
    })
  }, [])

  const onPointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      e.preventDefault()

      const current = pointerEventToCanvasPoint(e, camera)

      if (canvasState.mode === CanvasMode.Resizing) {
        resizeSelectedLayer(current)
      } else if (canvasState.mode === CanvasMode.Translating) {
        translateSelectedLayer(current)
      }

      setMyPresence({
        cursor: current,
      })
    },
    [canvasState, resizeSelectedLayer, camera, translateSelectedLayer],
  )

  const onPointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({
      cursor: null,
    })
  }, [])

  const onPointerUp = useMutation(
    ({}, e) => {
      const point = pointerEventToCanvasPoint(e, camera)

      if (
        canvasState.mode === CanvasMode.None ||
        canvasState.mode === CanvasMode.Pressing
      ) {
        unSelectedLayer()
        setCanvasState({
          mode: CanvasMode.None,
        })
      } else if (canvasState.mode === CanvasMode.Inserting) {
        insertLayer(canvasState.layerType, point)
      } else {
        setCanvasState({
          mode: CanvasMode.None,
        })
      }

      history.resume()
    },
    [canvasState, camera, history, insertLayer, unSelectedLayer],
  )

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, camera)

      if (canvasState.mode === CanvasMode.Inserting) {
        return
      }

      setCanvasState({ origin: point, mode: CanvasMode.Pressing })
    },
    [camera, canvasState.mode],
  )

  const onLayerPointerDown = useMutation(
    ({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
      if (
        canvasState.mode === CanvasMode.Pencil ||
        canvasState.mode === CanvasMode.Inserting
      ) {
        return
      }

      history.pause()
      e.stopPropagation()

      const point = pointerEventToCanvasPoint(e, camera)

      if (!self.presence.selection.includes(layerId)) {
        setMyPresence(
          {
            selection: [layerId],
          },
          {
            addToHistory: true,
          },
        )
      }

      setCanvasState({
        mode: CanvasMode.Translating,
        current: point,
      })
    },
    [setCanvasState, camera, history, canvasState.mode],
  )

  const selections = useOthersMapped((other) => other.presence.selection)

  const layerIdsToColorSelection = useMemo(() => {
    const layerIdsToColor: Record<string, string> = {}

    for (const user of selections) {
      const [connectionId, selection] = user

      for (const layerId of selection) {
        layerIdsToColor[layerId] = connectionIdToColor(connectionId)
      }
    }

    return layerIdsToColor
  }, [selections])

  return (
    <main className="w-full h-full relative bg-neutral-100 touch-none">
      <Info boardId={boardId} />
      <Participants />
      <Toolbar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        canRedo={canRedo}
        canUndo={canUndo}
        undo={history.undo}
        redo={history.redo}
      />
      <SelectionTool
        camera={camera}
        setLastUsedColor={setLastUsedColor}
      />
      <svg
        className="h-[100vh] w-[100vw]"
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerUp={onPointerUp}
        onPointerDown={onPointerDown}
      >
        <g style={{ transform: `translate(${camera.x}px, ${camera.y}px)` }}>
          {layerIds.map((layerId) => (
            <LayerPreview
              key={layerId}
              id={layerId}
              onLayerPointerDown={onLayerPointerDown}
              selectionColor={layerIdsToColorSelection[layerId]}
            />
          ))}
          <SelectionBox onResizeHandlePointerDown={onResizeHandlePointerDown} />
          <CursorPresence />
        </g>
      </svg>
    </main>
  )
}
