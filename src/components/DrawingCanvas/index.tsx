import { useEffect, useRef, useState } from 'react'
import './index.scss'
import type { DrawingType } from '@/types/annotations'

type Point = {
    x: number
    y: number
    ox?: number
    oy?: number
    pressure?: number  // 添加压力值，用于钢笔粗细变化
}

// 统一的绘图对象类型
type DrawingObject = {
    type: 'path' | 'shape'
    tool: DrawingType
    color: string
    lineWidth: number
    // path 类型使用
    points?: Point[]
    // shape 类型使用
    startPoint?: Point
    endPoint?: Point
}

type DrawingCanvasProps = {
    isActive: boolean
    targetRef: React.RefObject<HTMLElement | null>
    color?: string
    lineWidth?: number
    tool?: DrawingType
}

export default function DrawingCanvas({
    isActive,
    targetRef,
    color = '#000000',
    lineWidth = 2,
    tool = 'pencil'
}: DrawingCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [objects, setObjects] = useState<DrawingObject[]>([])
    const [currentPath, setCurrentPath] = useState<Point[]>([])
    const [shapeStart, setShapeStart] = useState<Point | null>(null)
    const [shapePreview, setShapePreview] = useState<Point | null>(null)

    /* ---------------- 判断工具类型 ---------------- */
    const isPathTool = (t: DrawingType): boolean => {
        return ['pencil', 'pen', 'marker', 'brush'].includes(t || '')
    }

    const isShapeTool = (t: DrawingType): boolean => {
        return ['rectangle', 'rectangle-fill', 'circle', 'circle-fill', 'triangle', 'triangle-fill', 'line', 'arrow'].includes(t || '')
    }

    const isEraserTool = (t: DrawingType): boolean => {
        return t === 'eraser'
    }

    /* ---------------- 获取鼠标样式 ---------------- */
    const getCursorStyle = (): string => {
        switch (tool) {
            case 'pencil':
                return 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath fill=\'%23000\' d=\'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z\'/%3E%3C/svg%3E") 0 24, auto'
            case 'pen':
                return 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath fill=\'%23000\' d=\'M14.06 9l.94.94L5.92 19H5v-.92L14.06 9zm3.6-6c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z\'/%3E%3C/svg%3E") 0 24, auto'
            case 'marker':
                return 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath fill=\'%23ffeb3b\' stroke=\'%23000\' stroke-width=\'1\' d=\'M18.5 1.15L17 0l-6 6-2 2 1.5 1.5L13 12l4-4 1.5-1.5-4-4zm-5 8.5L11 8l2-2 1.5 1.5-2 2zM2 22h20v2H2v-2z\'/%3E%3C/svg%3E") 0 24, auto'
            case 'brush':
                return 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath fill=\'%23000\' d=\'M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3zm13.71-9.37l-1.34-1.34c-.39-.39-1.02-.39-1.41 0L9 12.25 11.75 15l8.96-8.96c.39-.39.39-1.02 0-1.41z\'/%3E%3C/svg%3E") 0 24, auto'
            case 'eraser':
                return 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath fill=\'%23ff6b6b\' stroke=\'%23000\' stroke-width=\'1\' d=\'M16.24 3.56l4.95 4.94c.78.79.78 2.05 0 2.84L12 20.53a4.008 4.008 0 0 1-5.66 0L2.81 17c-.78-.79-.78-2.05 0-2.84l10.6-10.6c.79-.78 2.05-.78 2.83 0zM4.22 15.58l3.54 3.53c.78.79 2.04.79 2.83 0l3.53-3.53-6.36-6.36-3.54 3.53c-.78.79-.78 2.05 0 2.83z\'/%3E%3C/svg%3E") 4 20, auto'
            case 'rectangle':
            case 'rectangle-fill':
                return 'crosshair'
            case 'circle':
            case 'circle-fill':
                return 'crosshair'
            case 'triangle':
            case 'triangle-fill':
                return 'crosshair'
            case 'line':
                return 'crosshair'
            case 'arrow':
                return 'crosshair'
            default:
                return 'default'
        }
    }

    /* ---------------- canvas 初始化和尺寸更新 ---------------- */
    useEffect(() => {
        if (!canvasRef.current || !targetRef.current || !isActive) return

        const canvas = canvasRef.current
        const target = targetRef.current

        const updateCanvasSize = () => {
            const rect = target.getBoundingClientRect()
            const dpr = window.devicePixelRatio || 1

            canvas.width = rect.width * dpr
            canvas.height = rect.height * dpr
            canvas.style.width = `${rect.width}px`
            canvas.style.height = `${rect.height}px`
            canvas.style.left = `${rect.left}px`
            canvas.style.top = `${rect.top}px`

            const ctx = canvas.getContext('2d')
            if (!ctx) return

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            ctx.imageSmoothingEnabled = true
            ctx.imageSmoothingQuality = 'high'

            setContext(ctx)
            // 重绘时使用当前的 objects
            redrawAll(ctx, objects)
        }

        // 初始化
        updateCanvasSize()

        // 监听窗口大小变化
        const handleResize = () => {
            updateCanvasSize()
        }

        // 监听滚动
        const handleScroll = () => {
            if (!target) return
            const rect = target.getBoundingClientRect()
            canvas.style.left = `${rect.left}px`
            canvas.style.top = `${rect.top}px`
        }

        // 使用 ResizeObserver 监听目标元素大小变化
        const resizeObserver = new ResizeObserver(() => {
            updateCanvasSize()
        })
        resizeObserver.observe(target)

        window.addEventListener('resize', handleResize)
        window.addEventListener('scroll', handleScroll, true)

        return () => {
            resizeObserver.disconnect()
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('scroll', handleScroll, true)
        }
    }, [isActive, objects]) // 添加 objects 到依赖数组

    /* ---------------- 重绘所有对象 ---------------- */
    const redrawAll = (ctx: CanvasRenderingContext2D, objList: DrawingObject[]) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        objList.forEach(obj => drawObject(ctx, obj))
    }

    useEffect(() => {
        if (context) redrawAll(context, objects)
    }, [objects, context])

    /* ---------------- 获取鼠标坐标 ---------------- */
    const getPoint = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
        const rect = canvasRef.current!.getBoundingClientRect()
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }
    }

    /* ---------------- 开始绘制 ---------------- */
    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (e.button !== 0 || !context) return

        const point = getPoint(e)

        // 橡皮擦模式：点击删除整条线/图形
        if (isEraserTool(tool)) {
            deleteObjectAt(point)
            return
        }

        setIsDrawing(true)

        if (isPathTool(tool)) {
            setCurrentPath([point])
        } else if (isShapeTool(tool)) {
            setShapeStart(point)
            setShapePreview(point)
        }
    }

    /* ---------------- 绘制中 ---------------- */
    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !context) return

        const point = getPoint(e)

        if (isPathTool(tool)) {
            // 路径绘制
            let enhancedPoint: Point = point

            if (tool === 'brush') {
                // 毛笔：添加随机偏移
                enhancedPoint = {
                    ...point,
                    ox: (Math.random() - 0.5) * 2,
                    oy: (Math.random() - 0.5) * 2
                }
            } else if (tool === 'pen') {
                // 钢笔：计算速度作为压力值
                if (currentPath.length > 0) {
                    const lastPoint = currentPath[currentPath.length - 1]
                    const dx = point.x - lastPoint.x
                    const dy = point.y - lastPoint.y
                    const distance = Math.sqrt(dx * dx + dy * dy)
                    // 距离越大（速度越快），压力值越小（线条越细）
                    const pressure = Math.max(0.3, Math.min(1.5, 5 / (distance + 1)))
                    enhancedPoint = { ...point, pressure }
                } else {
                    enhancedPoint = { ...point, pressure: 1 }
                }
            }

            const newPath = [...currentPath, enhancedPoint]
            setCurrentPath(newPath)

            // 实时预览当前路径
            redrawAll(context, [
                ...objects,
                { type: 'path', tool, color, lineWidth, points: newPath }
            ])
        } else if (isShapeTool(tool) && shapeStart) {
            // 图形预览
            setShapePreview(point)
            redrawAll(context, [
                ...objects,
                { type: 'shape', tool, color, lineWidth, startPoint: shapeStart, endPoint: point }
            ])
        }
    }

    /* ---------------- 结束绘制 ---------------- */
    const stopDrawing = () => {
        if (!isDrawing) return
        setIsDrawing(false)

        if (isPathTool(tool) && currentPath.length > 1) {
            // 保存路径
            setObjects(prev => [
                ...prev,
                { type: 'path', tool, color, lineWidth, points: currentPath }
            ])
        } else if (isShapeTool(tool) && shapeStart && shapePreview) {
            // 保存图形
            setObjects(prev => [
                ...prev,
                { type: 'shape', tool, color, lineWidth, startPoint: shapeStart, endPoint: shapePreview }
            ])
        }

        setCurrentPath([])
        setShapeStart(null)
        setShapePreview(null)
    }

    /* ---------------- 橡皮擦：点击删除整个对象 ---------------- */
    const deleteObjectAt = (point: Point) => {
        setObjects(prev => prev.filter(obj => {
            if (obj.type === 'path' && obj.points) {
                // 检查点击是否在路径附近
                return !obj.points.some(p => {
                    const dx = p.x - point.x
                    const dy = p.y - point.y
                    return Math.sqrt(dx * dx + dy * dy) < 15 // 15px 容差范围
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
        }))
    }

    /* ---------------- 右键取消绘画 ---------------- */
    const handleContextMenu = (e: React.MouseEvent<HTMLCanvasElement>) => {
        e.preventDefault()
        setIsDrawing(false)
        setCurrentPath([])
        setShapeStart(null)
        setShapePreview(null)
        window.dispatchEvent(new CustomEvent('cancelDrawing'))
    }

    if (!isActive) return null

    return (
        <canvas
            ref={canvasRef}
            className="drawing-canvas"
            style={{ cursor: getCursorStyle() }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onContextMenu={handleContextMenu}
        />
    )
}

/* ======================================================
   绘制系统
====================================================== */

function drawObject(ctx: CanvasRenderingContext2D, obj: DrawingObject) {
    if (obj.type === 'path' && obj.points) {
        drawPath(ctx, obj)
    } else if (obj.type === 'shape' && obj.startPoint && obj.endPoint) {
        drawShape(ctx, obj)
    }
}

function drawPath(ctx: CanvasRenderingContext2D, obj: DrawingObject) {
    const { tool, points } = obj
    if (!points || points.length < 2) return

    switch (tool) {
        case 'pencil':
            drawPencil(ctx, obj)
            break
        case 'pen':
            drawPen(ctx, obj)
            break
        case 'marker':
            drawMarker(ctx, obj)
            break
        case 'brush':
            drawBrush(ctx, obj)
            break
    }
}

function drawShape(ctx: CanvasRenderingContext2D, obj: DrawingObject) {
    const { tool, startPoint, endPoint } = obj
    if (!startPoint || !endPoint) return

    switch (tool) {
        case 'rectangle':
        case 'rectangle-fill':
            drawRectangle(ctx, obj)
            break
        case 'circle':
        case 'circle-fill':
            drawCircle(ctx, obj)
            break
        case 'triangle':
        case 'triangle-fill':
            drawTriangle(ctx, obj)
            break
        case 'line':
            drawLine(ctx, obj)
            break
        case 'arrow':
            drawArrow(ctx, obj)
            break
    }
}

/* ---------------- 画笔工具 ---------------- */
function drawPencil(ctx: CanvasRenderingContext2D, obj: DrawingObject) {
    ctx.save()
    ctx.strokeStyle = obj.color
    ctx.lineWidth = obj.lineWidth
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(obj.points![0].x, obj.points![0].y)
    obj.points!.forEach(p => ctx.lineTo(p.x, p.y))
    ctx.stroke()
    ctx.restore()
}

function drawPen(ctx: CanvasRenderingContext2D, obj: DrawingObject) {
    ctx.save()
    ctx.strokeStyle = obj.color
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    if (obj.points!.length < 2) {
        ctx.restore()
        return
    }

    // 钢笔效果：根据保存的压力值绘制不同粗细
    for (let i = 0; i < obj.points!.length - 1; i++) {
        const p0 = obj.points![i]
        const p1 = obj.points![i + 1]

        // 使用保存的压力值，如果没有则默认为 1
        const pressure0 = p0.pressure ?? 1
        const pressure1 = p1.pressure ?? 1
        const avgPressure = (pressure0 + pressure1) / 2

        ctx.lineWidth = obj.lineWidth * avgPressure

        ctx.beginPath()
        ctx.moveTo(p0.x, p0.y)
        ctx.lineTo(p1.x, p1.y)
        ctx.stroke()
    }

    ctx.restore()
}

function drawMarker(ctx: CanvasRenderingContext2D, obj: DrawingObject) {
    ctx.save()
    ctx.strokeStyle = obj.color
    ctx.lineWidth = obj.lineWidth * 1.6
    ctx.globalAlpha = 0.35
    ctx.globalCompositeOperation = 'multiply'
    ctx.lineCap = 'butt'
    ctx.beginPath()
    ctx.moveTo(obj.points![0].x, obj.points![0].y)
    obj.points!.forEach(p => ctx.lineTo(p.x, p.y))
    ctx.stroke()
    ctx.restore()
}

function drawBrush(ctx: CanvasRenderingContext2D, obj: DrawingObject) {
    ctx.save()
    ctx.strokeStyle = obj.color
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    for (let i = 0; i < 3; i++) {
        ctx.globalAlpha = 0.15
        ctx.lineWidth = obj.lineWidth + i * 2
        ctx.beginPath()
        const first = obj.points![0]
        ctx.moveTo(first.x + (first.ox ?? 0), first.y + (first.oy ?? 0))
        obj.points!.forEach(p => ctx.lineTo(p.x + (p.ox ?? 0), p.y + (p.oy ?? 0)))
        ctx.stroke()
    }
    ctx.restore()
}

/* ---------------- 图形工具 ---------------- */
function drawRectangle(ctx: CanvasRenderingContext2D, obj: DrawingObject) {
    const { startPoint, endPoint, color, lineWidth, tool } = obj
    const width = endPoint!.x - startPoint!.x
    const height = endPoint!.y - startPoint!.y

    ctx.save()
    if (tool === 'rectangle-fill') {
        ctx.fillStyle = color
        ctx.fillRect(startPoint!.x, startPoint!.y, width, height)
    } else {
        ctx.strokeStyle = color
        ctx.lineWidth = lineWidth
        ctx.strokeRect(startPoint!.x, startPoint!.y, width, height)
    }
    ctx.restore()
}

function drawCircle(ctx: CanvasRenderingContext2D, obj: DrawingObject) {
    const { startPoint, endPoint, color, lineWidth, tool } = obj
    const centerX = (startPoint!.x + endPoint!.x) / 2
    const centerY = (startPoint!.y + endPoint!.y) / 2
    const radiusX = Math.abs(endPoint!.x - startPoint!.x) / 2
    const radiusY = Math.abs(endPoint!.y - startPoint!.y) / 2

    ctx.save()
    ctx.beginPath()
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2)

    if (tool === 'circle-fill') {
        ctx.fillStyle = color
        ctx.fill()
    } else {
        ctx.strokeStyle = color
        ctx.lineWidth = lineWidth
        ctx.stroke()
    }
    ctx.restore()
}

function drawTriangle(ctx: CanvasRenderingContext2D, obj: DrawingObject) {
    const { startPoint, endPoint, color, lineWidth, tool } = obj
    const topX = (startPoint!.x + endPoint!.x) / 2
    const topY = startPoint!.y

    ctx.save()
    ctx.beginPath()
    ctx.moveTo(topX, topY)
    ctx.lineTo(endPoint!.x, endPoint!.y)
    ctx.lineTo(startPoint!.x, endPoint!.y)
    ctx.closePath()

    if (tool === 'triangle-fill') {
        ctx.fillStyle = color
        ctx.fill()
    } else {
        ctx.strokeStyle = color
        ctx.lineWidth = lineWidth
        ctx.stroke()
    }
    ctx.restore()
}

function drawLine(ctx: CanvasRenderingContext2D, obj: DrawingObject) {
    const { startPoint, endPoint, color, lineWidth } = obj
    ctx.save()
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(startPoint!.x, startPoint!.y)
    ctx.lineTo(endPoint!.x, endPoint!.y)
    ctx.stroke()
    ctx.restore()
}

function drawArrow(ctx: CanvasRenderingContext2D, obj: DrawingObject) {
    const { startPoint, endPoint, color, lineWidth } = obj
    const dx = endPoint!.x - startPoint!.x
    const dy = endPoint!.y - startPoint!.y
    const angle = Math.atan2(dy, dx)
    const arrowLength = 15

    ctx.save()
    ctx.strokeStyle = color
    ctx.fillStyle = color
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'

    // 绘制线条
    ctx.beginPath()
    ctx.moveTo(startPoint!.x, startPoint!.y)
    ctx.lineTo(endPoint!.x, endPoint!.y)
    ctx.stroke()

    // 绘制箭头
    ctx.beginPath()
    ctx.moveTo(endPoint!.x, endPoint!.y)
    ctx.lineTo(
        endPoint!.x - arrowLength * Math.cos(angle - Math.PI / 6),
        endPoint!.y - arrowLength * Math.sin(angle - Math.PI / 6)
    )
    ctx.lineTo(
        endPoint!.x - arrowLength * Math.cos(angle + Math.PI / 6),
        endPoint!.y - arrowLength * Math.sin(angle + Math.PI / 6)
    )
    ctx.closePath()
    ctx.fill()

    ctx.restore()
}