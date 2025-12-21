import { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '@/store'
import { addObject, removeObjectAtPoint } from '@/store/modules/drawingSlice'
import './index.scss'
import type { DrawingType, Point, DrawingObject } from '@/types/drawing'

type DrawingCanvasProps = {
    isActive: boolean
    targetRef: React.RefObject<HTMLElement | null>
}

export default function DrawingCanvas({
    isActive,
    targetRef,
}: DrawingCanvasProps) {
    const dispatch = useDispatch<AppDispatch>()

    // 从 Redux 获取状态
    const { objects, tool, color, lineWidth } = useSelector((state: RootState) => state.drawing)

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
    const [isDrawing, setIsDrawing] = useState(false)
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
            case 'circle':
            case 'circle-fill':
            case 'triangle':
            case 'triangle-fill':
            case 'line':
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
            redrawAll(ctx, objects)
        }

        updateCanvasSize()

        const handleResize = () => updateCanvasSize()
        const handleScroll = () => {
            if (!target) return
            const rect = target.getBoundingClientRect()
            canvas.style.left = `${rect.left}px`
            canvas.style.top = `${rect.top}px`
        }

        const resizeObserver = new ResizeObserver(() => updateCanvasSize())
        resizeObserver.observe(target)

        window.addEventListener('resize', handleResize)
        window.addEventListener('scroll', handleScroll, true)

        return () => {
            resizeObserver.disconnect()
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('scroll', handleScroll, true)
        }
    }, [isActive, objects])

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
            dispatch(removeObjectAtPoint(point))
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
            let enhancedPoint: Point = point

            if (tool === 'brush') {
                enhancedPoint = {
                    ...point,
                    ox: (Math.random() - 0.5) * 2,
                    oy: (Math.random() - 0.5) * 2
                }
            } else if (tool === 'pen') {
                if (currentPath.length > 0) {
                    const lastPoint = currentPath[currentPath.length - 1]
                    const dx = point.x - lastPoint.x
                    const dy = point.y - lastPoint.y
                    const distance = Math.sqrt(dx * dx + dy * dy)
                    const pressure = Math.max(0.3, Math.min(1.5, 5 / (distance + 1)))
                    enhancedPoint = { ...point, pressure }
                } else {
                    enhancedPoint = { ...point, pressure: 1 }
                }
            }

            const newPath = [...currentPath, enhancedPoint]
            setCurrentPath(newPath)

            // 实时预览
            redrawAll(context, [
                ...objects,
                { type: 'path', tool, color, lineWidth, points: newPath }
            ])
        } else if (isShapeTool(tool) && shapeStart) {
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
            // 保存到 Redux
            dispatch(addObject({
                type: 'path',
                tool,
                color,
                lineWidth,
                points: currentPath
            }))
        } else if (isShapeTool(tool) && shapeStart && shapePreview) {
            // 保存到 Redux
            dispatch(addObject({
                type: 'shape',
                tool,
                color,
                lineWidth,
                startPoint: shapeStart,
                endPoint: shapePreview
            }))
        }

        setCurrentPath([])
        setShapeStart(null)
        setShapePreview(null)
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
   绘制系统（与之前相同）
====================================================== */

function drawObject(ctx: CanvasRenderingContext2D, obj: any) {
    if (obj.type === 'path' && obj.points) {
        drawPath(ctx, obj)
    } else if (obj.type === 'shape' && obj.startPoint && obj.endPoint) {
        drawShape(ctx, obj)
    }
}

function drawPath(ctx: CanvasRenderingContext2D, obj: any) {
    const { tool } = obj
    if (!obj.points || obj.points.length < 2) return

    switch (tool) {
        case 'pencil': drawPencil(ctx, obj); break
        case 'pen': drawPen(ctx, obj); break
        case 'marker': drawMarker(ctx, obj); break
        case 'brush': drawBrush(ctx, obj); break
    }
}

function drawShape(ctx: CanvasRenderingContext2D, obj: any) {
    const { tool } = obj
    if (!obj.startPoint || !obj.endPoint) return

    switch (tool) {
        case 'rectangle':
        case 'rectangle-fill': drawRectangle(ctx, obj); break
        case 'circle':
        case 'circle-fill': drawCircle(ctx, obj); break
        case 'triangle':
        case 'triangle-fill': drawTriangle(ctx, obj); break
        case 'line': drawLine(ctx, obj); break
        case 'arrow': drawArrow(ctx, obj); break
    }
}

// ... 其他绘制函数保持不变（drawPencil, drawPen 等）
function drawPencil(ctx: CanvasRenderingContext2D, obj: any) {
    ctx.save()
    ctx.strokeStyle = obj.color
    ctx.lineWidth = obj.lineWidth
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(obj.points[0].x, obj.points[0].y)
    obj.points.forEach((p: any) => ctx.lineTo(p.x, p.y))
    ctx.stroke()
    ctx.restore()
}

function drawPen(ctx: CanvasRenderingContext2D, obj: any) {
    ctx.save()
    ctx.strokeStyle = obj.color
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    if (obj.points.length < 2) { ctx.restore(); return }
    for (let i = 0; i < obj.points.length - 1; i++) {
        const p0 = obj.points[i]
        const p1 = obj.points[i + 1]
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

function drawMarker(ctx: CanvasRenderingContext2D, obj: any) {
    ctx.save()
    ctx.strokeStyle = obj.color
    ctx.lineWidth = obj.lineWidth * 1.6
    ctx.globalAlpha = 0.35
    ctx.globalCompositeOperation = 'multiply'
    ctx.lineCap = 'butt'
    ctx.beginPath()
    ctx.moveTo(obj.points[0].x, obj.points[0].y)
    obj.points.forEach((p: any) => ctx.lineTo(p.x, p.y))
    ctx.stroke()
    ctx.restore()
}

function drawBrush(ctx: CanvasRenderingContext2D, obj: any) {
    ctx.save()
    ctx.strokeStyle = obj.color
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    for (let i = 0; i < 3; i++) {
        ctx.globalAlpha = 0.15
        ctx.lineWidth = obj.lineWidth + i * 2
        ctx.beginPath()
        const first = obj.points[0]
        ctx.moveTo(first.x + (first.ox ?? 0), first.y + (first.oy ?? 0))
        obj.points.forEach((p: any) => ctx.lineTo(p.x + (p.ox ?? 0), p.y + (p.oy ?? 0)))
        ctx.stroke()
    }
    ctx.restore()
}

function drawRectangle(ctx: CanvasRenderingContext2D, obj: any) {
    const width = obj.endPoint.x - obj.startPoint.x
    const height = obj.endPoint.y - obj.startPoint.y
    ctx.save()
    if (obj.tool === 'rectangle-fill') {
        ctx.fillStyle = obj.color
        ctx.fillRect(obj.startPoint.x, obj.startPoint.y, width, height)
    } else {
        ctx.strokeStyle = obj.color
        ctx.lineWidth = obj.lineWidth
        ctx.strokeRect(obj.startPoint.x, obj.startPoint.y, width, height)
    }
    ctx.restore()
}

function drawCircle(ctx: CanvasRenderingContext2D, obj: any) {
    const centerX = (obj.startPoint.x + obj.endPoint.x) / 2
    const centerY = (obj.startPoint.y + obj.endPoint.y) / 2
    const radiusX = Math.abs(obj.endPoint.x - obj.startPoint.x) / 2
    const radiusY = Math.abs(obj.endPoint.y - obj.startPoint.y) / 2
    ctx.save()
    ctx.beginPath()
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2)
    if (obj.tool === 'circle-fill') {
        ctx.fillStyle = obj.color
        ctx.fill()
    } else {
        ctx.strokeStyle = obj.color
        ctx.lineWidth = obj.lineWidth
        ctx.stroke()
    }
    ctx.restore()
}

function drawTriangle(ctx: CanvasRenderingContext2D, obj: any) {
    const topX = (obj.startPoint.x + obj.endPoint.x) / 2
    const topY = obj.startPoint.y
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(topX, topY)
    ctx.lineTo(obj.endPoint.x, obj.endPoint.y)
    ctx.lineTo(obj.startPoint.x, obj.endPoint.y)
    ctx.closePath()
    if (obj.tool === 'triangle-fill') {
        ctx.fillStyle = obj.color
        ctx.fill()
    } else {
        ctx.strokeStyle = obj.color
        ctx.lineWidth = obj.lineWidth
        ctx.stroke()
    }
    ctx.restore()
}

function drawLine(ctx: CanvasRenderingContext2D, obj: any) {
    ctx.save()
    ctx.strokeStyle = obj.color
    ctx.lineWidth = obj.lineWidth
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(obj.startPoint.x, obj.startPoint.y)
    ctx.lineTo(obj.endPoint.x, obj.endPoint.y)
    ctx.stroke()
    ctx.restore()
}

function drawArrow(ctx: CanvasRenderingContext2D, obj: any) {
    const dx = obj.endPoint.x - obj.startPoint.x
    const dy = obj.endPoint.y - obj.startPoint.y
    const angle = Math.atan2(dy, dx)
    const arrowLength = 15
    ctx.save()
    ctx.strokeStyle = obj.color
    ctx.fillStyle = obj.color
    ctx.lineWidth = obj.lineWidth
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(obj.startPoint.x, obj.startPoint.y)
    ctx.lineTo(obj.endPoint.x, obj.endPoint.y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(obj.endPoint.x, obj.endPoint.y)
    ctx.lineTo(
        obj.endPoint.x - arrowLength * Math.cos(angle - Math.PI / 6),
        obj.endPoint.y - arrowLength * Math.sin(angle - Math.PI / 6)
    )
    ctx.lineTo(
        obj.endPoint.x - arrowLength * Math.cos(angle + Math.PI / 6),
        obj.endPoint.y - arrowLength * Math.sin(angle + Math.PI / 6)
    )
    ctx.closePath()
    ctx.fill()
    ctx.restore()
}