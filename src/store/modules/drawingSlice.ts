// src/store/drawing/drawingSlice.ts
import { createSlice } from '@reduxjs/toolkit'
import type { DrawingType } from '@/types/annotations'

interface DrawingStateType {
    color: string
    lineWidth: number
    tool: DrawingType
}

const initialState: DrawingStateType = {
    color: '',
    lineWidth: 0,
    tool: null,
}

const drawingSlice = createSlice({
    name: 'drawing',
    initialState,
    reducers: {
        setTool(state, action) {
            state.tool = action.payload
        },
        setColor(state, action) {
            state.color = action.payload
        },
        setLineWidth(state, action) {
            state.lineWidth = action.payload
        },
    }
})

export const {
    setTool,
    setColor,
    setLineWidth,
} = drawingSlice.actions

export default drawingSlice.reducer
