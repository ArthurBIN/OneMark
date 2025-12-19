import { useEffect, useRef, useState } from 'react'
import './index.scss'
import type { DrawingType } from '@/types/annotations'

type Point = {
    x: number
    y: number
    // 仅毛笔使用
    ox?: number
    oy?: number
}

type DrawingPath = {
    points: Point[]
    color: string
    lineWidth: number
    tool: DrawingType
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
    const [paths, setPaths] = useState<DrawingPath[]>([])
    const [currentPath, setCurrentPath] = useState<Point[]>([])

    /* ---------------- canvas 初始化 ---------------- */
    useEffect(() => {
        if (!canvasRef.current || !targetRef.current || !isActive) return

        const canvas = canvasRef.current
        const rect = targetRef.current.getBoundingClientRect()
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
        redrawAllPaths(ctx, paths)
    }, [isActive])

    /* ---------------- 重绘 ---------------- */
    const redrawAllPaths = (
        ctx: CanvasRenderingContext2D,
        pathList: DrawingPath[]
    ) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        pathList.forEach(path => {
            if (path.points.length < 2) return
            drawPath(ctx, path)
        })
    }

    useEffect(() => {
        if (context) redrawAllPaths(context, paths)
    }, [paths, context])

    /* ---------------- 鼠标坐标 ---------------- */
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
        setIsDrawing(true)
        setCurrentPath([getPoint(e)])
    }

    /* ---------------- 绘制中 ---------------- */
    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !context) return

        const basePoint = getPoint(e)

        const point: Point =
            tool === 'brush'
                ? {
                    ...basePoint,
                    ox: (Math.random() - 0.5) * 2,
                    oy: (Math.random() - 0.5) * 2
                }
                : basePoint

        const newPath = [...currentPath, point]
        setCurrentPath(newPath)

        redrawAllPaths(context, [
            ...paths,
            { points: newPath, color, lineWidth, tool }
        ])
    }

    /* ---------------- 结束绘制 ---------------- */
    const stopDrawing = () => {
        if (!isDrawing || currentPath.length < 2) return
        setIsDrawing(false)
        setPaths(prev => [
            ...prev,
            { points: currentPath, color, lineWidth, tool }
        ])
        setCurrentPath([])
    }

    /* ---------------- 右键取消绘画 ---------------- */
    const handleContextMenu = (e: React.MouseEvent<HTMLCanvasElement>) => {
        e.preventDefault()

        setIsDrawing(false)
        setCurrentPath([])

        // 通知父组件退出绘图模式
        window.dispatchEvent(new CustomEvent('cancelDrawing'))
    }

    if (!isActive) return null

    return (
        <canvas
            ref={canvasRef}
            className="drawing-canvas"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onContextMenu={handleContextMenu}
        />
    )
}

/* ======================================================
   画笔系统
====================================================== */

function drawPath(ctx: CanvasRenderingContext2D, path: DrawingPath) {
    switch (path.tool) {
        case 'pencil':
            drawPencil(ctx, path)
            break
        case 'pen':
            drawPen(ctx, path)
            break
        case 'marker':
            drawMarker(ctx, path)
            break
        case 'brush':
            drawBrush(ctx, path)
            break
    }
}

/* 普通画笔 */
function drawPencil(ctx: CanvasRenderingContext2D, path: DrawingPath) {
    ctx.save()
    ctx.strokeStyle = path.color
    ctx.lineWidth = path.lineWidth
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    ctx.beginPath()
    ctx.moveTo(path.points[0].x, path.points[0].y)
    path.points.forEach(p => ctx.lineTo(p.x, p.y))
    ctx.stroke()
    ctx.restore()
}

/*钢笔 */
function drawPen(ctx: CanvasRenderingContext2D, path: DrawingPath) {
    ctx.save()
    ctx.strokeStyle = path.color
    ctx.lineCap = 'round'

    for (let i = 1; i < path.points.length; i++) {
        const p0 = path.points[i - 1]
        const p1 = path.points[i]

        const dx = p1.x - p0.x
        const dy = p1.y - p0.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        ctx.lineWidth = Math.max(1, path.lineWidth * (4 / (dist + 1)))

        ctx.beginPath()
        ctx.moveTo(p0.x, p0.y)
        ctx.lineTo(p1.x, p1.y)
        ctx.stroke()
    }

    ctx.restore()
}

/* 荧光笔 */
function drawMarker(ctx: CanvasRenderingContext2D, path: DrawingPath) {
    ctx.save()
    ctx.strokeStyle = path.color
    ctx.lineWidth = path.lineWidth * 1.6
    ctx.globalAlpha = 0.35
    ctx.globalCompositeOperation = 'multiply'
    ctx.lineCap = 'butt'

    ctx.beginPath()
    ctx.moveTo(path.points[0].x, path.points[0].y)
    path.points.forEach(p => ctx.lineTo(p.x, p.y))
    ctx.stroke()

    ctx.restore()
}

/* 毛笔 */
function drawBrush(ctx: CanvasRenderingContext2D, path: DrawingPath) {
    ctx.save()
    ctx.strokeStyle = path.color
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    for (let i = 0; i < 3; i++) {
        ctx.globalAlpha = 0.15
        ctx.lineWidth = path.lineWidth + i * 2

        ctx.beginPath()
        const first = path.points[0]
        ctx.moveTo(
            first.x + (first.ox ?? 0),
            first.y + (first.oy ?? 0)
        )

        path.points.forEach(p => {
            ctx.lineTo(
                p.x + (p.ox ?? 0),
                p.y + (p.oy ?? 0)
            )
        })

        ctx.stroke()
    }

    ctx.restore()
}
