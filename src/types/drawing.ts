export type DrawingType =
    | 'pencil'
    | 'pen'
    | 'marker'
    | 'brush'
    | 'rectangle'      // 矩形（空心）
    | 'rectangle-fill' // 矩形（实心）
    | 'circle'         // 圆形（空心）
    | 'circle-fill'    // 圆形（实心）
    | 'triangle'       // 三角形（空心）
    | 'triangle-fill'  // 三角形（实心）
    | 'line'           // 直线
    | 'arrow'          // 箭头
    | 'eraser'         // 橡皮擦
    | null


export type Point = {
    x: number
    y: number
    ox?: number
    oy?: number
    pressure?: number
}

export type DrawingObject = {
    type: 'path' | 'shape'
    tool: DrawingType
    color: string
    lineWidth: number
    points?: Point[]
    startPoint?: Point
    endPoint?: Point
}


export type DrawingAnnotation = {
    id: string;
    page_id: string;
    user_id: string;
    drawing_type: DrawingType;
    geometry: Record<string, any>;
    stroke_color: string;
    stroke_width: number;
    fill_color?: string;
    opacity: number;
    text_content?: string;
    font_size?: number;
    note?: string;
    created_at: string;
    updated_at: string;
};