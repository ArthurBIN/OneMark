export type AnnotationType = 'text' | 'file' | 'img';
export type ContentType = 'text' | 'pdf' | 'word' | 'image';
export type TextAnnotationType = 'highlight' | 'underline' | 'strikethrough' | 'comment';
export type DrawingType = 'pen' | 'rectangle' | 'circle' | 'arrow' | 'line' | 'text_box';

export type Annotation = {
    id: string;
    user_id: string;
    title: string;
    type: AnnotationType;
    slug?: string;
    is_public: boolean;
    thumbnail?: string;
    created_at: string;
    updated_at: string;
};

export type AnnotationPage = {
    id: string;
    annotation_id: string;
    page_number: number;
    content_type: ContentType;
    original_filename?: string;
    file_url?: string;
    text_content?: string;
    thumbnail_url?: string;
    metadata?: Record<string, any>;
    created_at: string;
    updated_at: string;
};

export type AnnotationDetail = Annotation & {
    pages: AnnotationPage[];
};

export type TextAnnotation = {
    id: string;
    page_id: string;
    user_id: string;
    start_offset: number;
    end_offset: number;
    selected_text: string;
    annotation_type: TextAnnotationType;
    color: string;
    note?: string;
    created_at: string;
    updated_at: string;
};

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