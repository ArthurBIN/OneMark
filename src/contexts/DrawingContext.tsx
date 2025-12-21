import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

type DrawingTool =
    | 'pencil' | 'pen' | 'marker' | 'brush'
    | 'rectangle' | 'rectangle-fill'
    | 'circle' | 'circle-fill'
    | 'triangle' | 'triangle-fill'
    | 'line' | 'arrow'
    | 'eraser'
    | null

type DrawingContextType = {
    isDrawingMode: boolean
    setIsDrawingMode: (value: boolean) => void
    drawingTool: DrawingTool
    setDrawingTool: (tool: DrawingTool) => void
}

const DrawingContext = createContext<DrawingContextType | undefined>(undefined)

export function DrawingProvider({ children }: { children: ReactNode }) {
    const [isDrawingMode, setIsDrawingMode] = useState(false)
    const [drawingTool, setDrawingTool] = useState<DrawingTool>(null)

    return (
        <DrawingContext.Provider
            value={{
                isDrawingMode,
                setIsDrawingMode,
                drawingTool,
                setDrawingTool,
            }}
        >
            {children}
        </DrawingContext.Provider>
    )
}

export function useDrawing() {
    const context = useContext(DrawingContext)
    if (!context) {
        throw new Error('useDrawing must be used within DrawingProvider')
    }
    return context
}