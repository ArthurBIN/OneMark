import { useEffect, useRef, useState } from 'react'
import './index.scss'

type DrawingCanvasProps = {
    isActive: boolean
    targetRef: React.RefObject<HTMLDivElement | null>
    color?: string
    lineWidth?: number
}

export default function DrawingCanvas({
    isActive,
    targetRef,
    color = '#000000',
    lineWidth = 2
}: DrawingCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)

    // 初始化 canvas
    useEffect(() => {
        if (!canvasRef.current || !targetRef.current || !isActive) return

        const canvas = canvasRef.current
        const target = targetRef.current
        const rect = target.getBoundingClientRect()

        // 设置 canvas 尺寸和位置
        canvas.width = rect.width
        canvas.height = rect.height
        canvas.style.left = `${rect.left}px`
        canvas.style.top = `${rect.top}px`
        canvas.style.width = `${rect.width}px`
        canvas.style.height = `${rect.height}px`

        const ctx = canvas.getContext('2d')
        if (ctx) {
            ctx.strokeStyle = color
            ctx.lineWidth = lineWidth
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'
            setContext(ctx)
        }

        // 监听窗口大小变化
        const handleResize = () => {
            const newRect = target.getBoundingClientRect()
            canvas.style.left = `${newRect.left}px`
            canvas.style.top = `${newRect.top}px`
            canvas.style.width = `${newRect.width}px`
            canvas.style.height = `${newRect.height}px`
        }

        window.addEventListener('resize', handleResize)
        window.addEventListener('scroll', handleResize, true)

        return () => {
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('scroll', handleResize, true)
        }
    }, [isActive, targetRef, color, lineWidth])

    // 开始绘画
    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!context || !canvasRef.current) return

        const canvas = canvasRef.current
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        setIsDrawing(true)
        context.beginPath()
        context.moveTo(x, y)
    }

    // 绘画中
    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !context || !canvasRef.current) return

        const canvas = canvasRef.current
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        context.lineTo(x, y)
        context.stroke()
    }

    // 结束绘画
    const stopDrawing = () => {
        if (!context) return
        setIsDrawing(false)
        context.closePath()
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
        />
    )
}