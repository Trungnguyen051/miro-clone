'use client'
import { Rectangle } from '@/app/(dashboard)/_components/rectangle'
import { Ellipse } from '@/app/board/[boardId]/_components/ellipse'
import { Note } from '@/app/board/[boardId]/_components/note'
import { Text } from '@/app/board/[boardId]/_components/text'
import { LayerType } from '@/types/canvas'
import { useStorage } from '@liveblocks/react/suspense'
import React, { memo } from 'react'

export interface LayerPreviewProps {
  id: string
  onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void
  selectionColor?: string
}

export const LayerPreview = memo(
  ({ id, onLayerPointerDown, selectionColor }: LayerPreviewProps) => {
    const layer = useStorage((root) => root.layers.get(id))

    if (!layer) {
      return null
    }

    switch (layer.type) {
      case LayerType.Rectangle:
        return (
          <Rectangle
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        )

      case LayerType.Ellipse:
        return (
          <Ellipse
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        )

      case LayerType.Note:
        return (
          <Note
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        )

      case LayerType.Text:
        return (
          <Text
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        )

      default:
        console.warn('Unknown layer type')
        return null
    }
  },
)

LayerPreview.displayName = 'LayerPreview'
