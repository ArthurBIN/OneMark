import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { DrawingType } from '@/types/annotations'

type DrawingContextType = {
    isDrawingMode: boolean
    setIsDrawingMode: (value: boolean) => void
    drawingTool: DrawingType
    setDrawingTool: (tool: DrawingType) => void
}

const DrawingContext = createContext<DrawingContextType | undefined>(undefined)

export function DrawingProvider({ children }: { children: ReactNode }) {
    const [isDrawingMode, setIsDrawingMode] = useState(false)
    const [drawingTool, setDrawingTool] = useState<DrawingType>(null)

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