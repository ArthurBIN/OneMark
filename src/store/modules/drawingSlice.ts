import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { DrawingType, Point, DrawingObject } from '@/types/drawing'

interface DrawingState {
    // 绘图对象列表
    objects: DrawingObject[]
    // 当前工具
    tool: DrawingType
    // 当前颜色
    color: string
    // 当前线宽
    lineWidth: number
    // 是否正在绘制
    isDrawing: boolean
}

const initialState: DrawingState = {
    objects: [],
    tool: null,
    color: '#000000',
    lineWidth: 2,
    isDrawing: false,
}

const drawingSlice = createSlice({
    name: 'drawing',
    initialState,
    reducers: {
        // 添加绘图对象
        addObject: (state, action: PayloadAction<DrawingObject>) => {
            state.objects.push(action.payload)
        },

        // 删除指定索引的对象
        removeObject: (state, action: PayloadAction<number>) => {
            state.objects.splice(action.payload, 1)
        },

        // 根据点击位置删除对象（橡皮擦功能）
        removeObjectAtPoint: (state, action: PayloadAction<Point>) => {
            const point = action.payload
            state.objects = state.objects.filter(obj => {
                if (obj.type === 'path' && obj.points) {
                    // 检查点击是否在路径附近
                    return !obj.points.some(p => {
                        const dx = p.x - point.x
                        const dy = p.y - point.y
                        return Math.sqrt(dx * dx + dy * dy) < 15
                    })
                } else if (obj.type === 'shape' && obj.startPoint && obj.endPoint) {
                    // 检查点击是否在图形范围内
                    const minX = Math.min(obj.startPoint.x, obj.endPoint.x)
                    const maxX = Math.max(obj.startPoint.x, obj.endPoint.x)
                    const minY = Math.min(obj.startPoint.y, obj.endPoint.y)
                    const maxY = Math.max(obj.startPoint.y, obj.endPoint.y)
                    return !(point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY)
                }
                return true
            })
        },

        // 清除所有对象
        clearObjects: (state) => {
            state.objects = []
        },

        // 设置工具
        setTool: (state, action: PayloadAction<DrawingType>) => {
            state.tool = action.payload
        },

        // 设置颜色
        setColor: (state, action: PayloadAction<string>) => {
            state.color = action.payload
        },

        // 设置线宽
        setLineWidth: (state, action: PayloadAction<number>) => {
            state.lineWidth = action.payload
        },

        // 设置是否正在绘制
        setIsDrawing: (state, action: PayloadAction<boolean>) => {
            state.isDrawing = action.payload
        },

        // 撤销（删除最后一个对象）
        undo: (state) => {
            if (state.objects.length > 0) {
                state.objects.pop()
            }
        },

        // 批量替换所有对象（用于导入数据）
        setObjects: (state, action: PayloadAction<DrawingObject[]>) => {
            state.objects = action.payload
        },
    },
})

export const {
    addObject,
    removeObject,
    removeObjectAtPoint,
    clearObjects,
    setTool,
    setColor,
    setLineWidth,
    setIsDrawing,
    undo,
    setObjects,
} = drawingSlice.actions

export default drawingSlice.reducer