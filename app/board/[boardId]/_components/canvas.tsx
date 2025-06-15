'use client'

import { CursorPresence } from '@/app/(dashboard)/_components/cursors-presence'
import { Info } from '@/app/board/[boardId]/_components/info'
import { LayerPreview } from '@/app/board/[boardId]/_components/layer-preview'
import { Participants } from '@/app/board/[boardId]/_components/participants'
import { Toolbar } from '@/app/board/[boardId]/_components/toolbar'
import { pointerEventToCanvasPoint } from '@/lib/utils'
import {
  Camera,
  CanvasMode,
  CanvasState,
  Color,
  LayerType,
  Point,
} from '@/types/canvas'
import { LiveObject } from '@liveblocks/node'
import {
  useCanRedo,
  useCanUndo,
  useHistory,
  useMutation,
  useStorage,
} from '@liveblocks/react/suspense'
import { nanoid } from 'nanoid'
import React, { useCallback, useState } from 'react'

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
    r: 0,
    g: 0,
    b: 0,
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

      setMyPresence({
        cursor: current,
      })
    },
    [],
  )

  const onPointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({
      cursor: null,
    })
  }, [])

  const onPointerUp = useMutation(
    ({}, e) => {
      const point = pointerEventToCanvasPoint(e, camera)

      if (canvasState.mode === CanvasMode.Inserting) {
        insertLayer(canvasState.layerType, point)
      } else {
        setCanvasState({
          mode: CanvasMode.None,
        })
      }

      history.resume()
    },
    [canvasState, camera, history, insertLayer],
  )

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
      <svg
        className="h-[100vh] w-[100vw]"
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerUp={onPointerUp}
      >
        <g style={{ transform: `translate(${camera.x}px, ${camera.y}px)` }}>
          {layerIds.map((layerId) => (
            <LayerPreview
              key={layerId}
              id={layerId}
              onLayerPointerDown={() => {}}
              selectionColor={'#f0f0f0'}
            />
          ))}
          <CursorPresence />
        </g>
      </svg>
    </main>
  )
}
