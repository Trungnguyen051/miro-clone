import { Camera, Color, Layer, Point, Side, XYWH } from '@/types/canvas'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const COLORS = [
  '#F87171', // Red
  '#FBBF24', // Yellow
  '#34D399', // Green
  '#60A5FA', // Blue
  '#A78BFA', // Purple
  '#F472B6', // Pink
  '#FCD34D', // Amber
  '#F59E0B', // Orange
  '#10B981', // Emerald
  '#3B82F6', // Sky
  '#8B5CF6', // Violet
  '#EC4899', // Rose
  '#D97706', // Gold
  '#0EA5E9', // Cyan
  '#F43F5E', // Crimson
  '#6EE7B7', // Light Green
  '#A5B4FC', // Light Blue
  '#FDE68A', // Light Yellow
  '#F9A8D4', // Light Pink
  '#C084FC', // Light Purple
  '#F87171', // Light Red
  '#FBBF24', // Light Yellow
  '#34D399', // Light Green
  '#60A5FA', // Light Blue
  '#A78BFA', // Light Purple
  '#F472B6', // Light Pink
  '#FCD34D', // Light Amber
  '#F59E0B', // Light Orange
  '#10B981', // Light Emerald
  '#3B82F6', // Light Sky
  '#8B5CF6', // Light Violet
  '#EC4899', // Light Rose
  '#D97706', // Light Gold
  '#0EA5E9', // Light Cyan
  '#F43F5E', // Light Crimson
]

export function connectionIdToColor(connectionId: number): string {
  return COLORS[connectionId % COLORS.length]
}

export function pointerEventToCanvasPoint(
  e: React.PointerEvent,
  camera: Camera,
) {
  return {
    x: Math.round(e.clientX) - camera.x,
    y: Math.round(e.clientY) - camera.y,
  }
}

export function colorToCss(color: Color) {
  return `#${color.r.toString(16).padStart(2, '0')}${color.g.toString(16).padStart(2, '0')}${color.b.toString(16).padStart(2, '0')}`
}

export function resizeBounds(bounds: XYWH, corner: Side, point: Point): XYWH {
  const result = {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
  }

  if ((corner & Side.Left) === Side.Left) {
    result.x = Math.min(point.x, bounds.x + bounds.width)
    result.width = Math.abs(bounds.x + bounds.width - point.x)
  }

  if ((corner & Side.Right) === Side.Right) {
    result.x = Math.min(point.x, bounds.x)
    result.width = Math.abs(point.x - bounds.x)
  }

  if ((corner & Side.Top) === Side.Top) {
    result.y = Math.min(point.y, bounds.y + bounds.height)
    result.height = Math.abs(bounds.y + bounds.height - point.y)
  }

  if ((corner & Side.Bottom) === Side.Bottom) {
    result.y = Math.min(point.y, bounds.y)
    result.height = Math.abs(point.y - bounds.y)
  }

  return result
}

export function findIntersectingLayersWithRectangle(
  layerIds: readonly string[],
  layers: ReadonlyMap<string, Layer>,
  a: Point,
  b: Point,
) {
  const rect = {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    width: Math.abs(a.x - b.x),
    height: Math.abs(a.y - b.y),
  }

  const ids = []

  for (const layerId of layerIds) {
    const layer = layers.get(layerId)

    if (layer == null) {
      continue
    }

    const { x, y, width, height } = layer

    if (
      rect.x + rect.width > x &&
      rect.x < x + width &&
      rect.y + rect.height > y &&
      rect.y < y + height
    ) {
      ids.push(layerId)
    }
  }

  return ids
}
