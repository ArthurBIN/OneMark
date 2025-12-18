import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

type DrawingContextType = {
    isDrawingMode: boolean
    setIsDrawingMode: (value: boolean) => void
    drawingTool: 'pencil' | 'pen' | 'marker' | 'brush' | null
    setDrawingTool: (tool: 'pencil' | 'pen' | 'marker' | 'brush' | null) => void
}

const DrawingContext = createContext<DrawingContextType | undefined>(undefined)

export function DrawingProvider({ children }: { children: ReactNode }) {
    const [isDrawingMode, setIsDrawingMode] = useState(false)
    const [drawingTool, setDrawingTool] = useState<'pencil' | 'pen' | 'marker' | 'brush' | null>(null)

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