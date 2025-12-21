export type AnnotationType = 'text' | 'file' | 'img';
export type ContentType = 'text' | 'pdf' | 'word' | 'image';

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
