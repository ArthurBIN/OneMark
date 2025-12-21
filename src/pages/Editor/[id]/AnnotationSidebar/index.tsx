import { useDrawing } from "@/contexts/DrawingContext";


type params = {
    className?: string;
}

export const AnnotationSidebar = ({
    className = '',
}: params) => {

    const { isDrawingMode, drawingTool } = useDrawing();


    if (!isDrawingMode) {
        return (
            <div>无</div>
        )
    }

    return (
        <div className={`AnnotationSidebar ${className}`}>
            {drawingTool}
        </div>
    )
}