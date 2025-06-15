'use client'

import { colorToCss } from '@/lib/utils'
import { Color } from '@/types/canvas'

interface ColorPickerProps {
  onChange: (color: Color) => void
}

export const ColorPicker = ({ onChange }: ColorPickerProps) => {
  return (
    <div className="flex flex-wrap gap-2 items-center max-w-[164px] pr-2 mr-2 border-r border-neutral-200">
      <ColorButton
        onClick={onChange}
        color={{ r: 255, g: 249, b: 177 }}
      />
      <ColorButton
        onClick={onChange}
        color={{ r: 68, g: 202, b: 99 }}
      />
      <ColorButton
        onClick={onChange}
        color={{ r: 147, g: 51, b: 234 }}
      />
      <ColorButton
        onClick={onChange}
        color={{ r: 236, g: 72, b: 153 }}
      />
      <ColorButton
        onClick={onChange}
        color={{ r: 59, g: 130, b: 246 }}
      />
      <ColorButton
        onClick={onChange}
        color={{ r: 251, g: 146, b: 60 }}
      />
      <ColorButton
        onClick={onChange}
        color={{ r: 255, g: 255, b: 255 }}
      />
      <ColorButton
        onClick={onChange}
        color={{ r: 0, g: 0, b: 0 }}
      />
    </div>
  )
}

interface ColorButtonProps {
  onClick: (color: Color) => void
  color: Color
}

const ColorButton = ({ onClick, color }: ColorButtonProps) => {
  return (
    <button
      className="w-8 h-8 items-center flex justify-center hover:opacity-75 transition"
      onClick={() => onClick(color)}
    >
      <div
        className="h-8 w-8 rounded-md border border-neutral-300"
        style={{ background: colorToCss(color) }}
      />
    </button>
  )
}
