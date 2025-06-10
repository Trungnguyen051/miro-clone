import { Camera } from '@/types/canvas'
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
