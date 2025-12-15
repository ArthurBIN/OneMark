// services/annotation.ts
import { supabase } from '@/utils/supabaseClient';
import type {
    Annotation,
    AnnotationPage,
    TextAnnotation,
    DrawingAnnotation,
    AnnotationType,
    ContentType,
    TextAnnotationType,
    DrawingType
} from '@/types/annotations';

// ==================== Annotations (项目) ====================

// 创建空白标注项目
export async function createAnnotation(title: string = '新的标注项目', type: AnnotationType, is_public: boolean) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('未登录');

    const { data: annotation, error } = await supabase
        .from('annotations')
        .insert({
            user_id: user.id,
            title,
            type,
            is_public,
            slug: generateSlug() // 生成唯一 slug
        })
        .select()
        .single();

    if (error) throw error;

    return annotation as Annotation;
}

// 获取用户所有标注项目
export async function getMyAnnotations() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('未登录');

    const { data, error } = await supabase
        .from('annotations')
        .select()
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

    if (error) throw error;
    return data as Annotation[];
}

// 获取单个标注项目（包含页面数量）
export async function getAnnotation(
    annotationId: string
): Promise<Annotation & { pages: AnnotationPage[] }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('未登录');

    const { data, error } = await supabase
        .from('annotations')
        .select(`
        *,
        pages:annotation_pages(*)
      `)
        .eq('id', annotationId)
        .eq('user_id', user.id)
        .single();

    if (error) throw error;

    return data;
}

// 通过 slug 获取公开的标注项目
export async function getAnnotationBySlug(slug: string) {
    const { data, error } = await supabase
        .from('annotations')
        .select(`
            *,
            pages:annotation_pages(
                id,
                page_number,
                content_type,
                file_url,
                text_content,
                thumbnail_url
            )
        `)
        .eq('slug', slug)
        .eq('is_public', true)
        .single();

    if (error) throw error;
    return data;
}

// 更新标注项目
export async function updateAnnotation(
    annotationId: string,
    updates: Partial<Pick<Annotation, 'title' | 'is_public' | 'thumbnail'>>
) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('未登录');

    const { data, error } = await supabase
        .from('annotations')
        .update({
            ...updates,
            updated_at: new Date().toISOString()
        })
        .eq('id', annotationId)
        .eq('user_id', user.id)
        .select()
        .single();

    if (error) throw error;
    return data as Annotation;
}

// 删除标注项目（级联删除所有相关数据）
export async function deleteAnnotation(annotationId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('未登录');

    const { error } = await supabase
        .from('annotations')
        .delete()
        .eq('id', annotationId)
        .eq('user_id', user.id);

    if (error) {
        if (error.code === '42501') {
            throw new Error('权限不足');
        }
        throw error;
    }
}

// ==================== Annotation Pages (页面) ====================

// 创建页面（上传文本/文件/图片后调用）
export async function createAnnotationPage(params: {
    annotation_id: string;
    page_number: number;
    content_type: ContentType;
    original_filename?: string;
    file_url?: string;
    text_content?: string;
    thumbnail_url?: string;
    metadata?: Record<string, any>;
}) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('未登录');

    const { data, error } = await supabase
        .from('annotation_pages')
        .insert(params)
        .select()
        .single();

    if (error) throw error;
    return data as AnnotationPage;
}

// 批量创建页面（用于多图片或多页PDF）
export async function createAnnotationPages(pages: Array<{
    annotation_id: string;
    page_number: number;
    content_type: ContentType;
    original_filename?: string;
    file_url?: string;
    text_content?: string;
    thumbnail_url?: string;
    metadata?: Record<string, any>;
}>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('未登录');

    const { data, error } = await supabase
        .from('annotation_pages')
        .insert(pages)
        .select();

    if (error) throw error;
    return data as AnnotationPage[];
}

// 获取项目的所有页面
export async function getAnnotationPages(annotationId: string) {
    const { data, error } = await supabase
        .from('annotation_pages')
        .select()
        .eq('annotation_id', annotationId)
        .order('page_number', { ascending: true });

    if (error) throw error;
    return data as AnnotationPage[];
}

// 获取单个页面详情
export async function getAnnotationPage(pageId: string) {
    const { data, error } = await supabase
        .from('annotation_pages')
        .select()
        .eq('id', pageId)
        .single();

    if (error) throw error;
    return data as AnnotationPage;
}

// 删除页面
export async function deleteAnnotationPage(pageId: string) {
    const { error } = await supabase
        .from('annotation_pages')
        .delete()
        .eq('id', pageId);

    if (error) throw error;
}

// ==================== Text Annotations (文本标记) ====================

// 创建文本标记
export async function createTextAnnotation(params: {
    page_id: string;
    start_offset: number;
    end_offset: number;
    selected_text: string;
    annotation_type: TextAnnotationType;
    color?: string;
    note?: string;
}) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('未登录');

    const { data, error } = await supabase
        .from('text_annotations')
        .insert({
            ...params,
            user_id: user.id,
            color: params.color || '#FFFF00'
        })
        .select()
        .single();

    if (error) throw error;
    return data as TextAnnotation;
}

// 获取页面的所有文本标记
export async function getTextAnnotations(pageId: string) {
    const { data, error } = await supabase
        .from('text_annotations')
        .select()
        .eq('page_id', pageId)
        .order('start_offset', { ascending: true });

    if (error) throw error;
    return data as TextAnnotation[];
}

// 更新文本标记
export async function updateTextAnnotation(
    annotationId: string,
    updates: Partial<Pick<TextAnnotation, 'color' | 'note' | 'annotation_type'>>
) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('未登录');

    const { data, error } = await supabase
        .from('text_annotations')
        .update({
            ...updates,
            updated_at: new Date().toISOString()
        })
        .eq('id', annotationId)
        .eq('user_id', user.id)
        .select()
        .single();

    if (error) throw error;
    return data as TextAnnotation;
}

// 删除文本标记
export async function deleteTextAnnotation(annotationId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('未登录');

    const { error } = await supabase
        .from('text_annotations')
        .delete()
        .eq('id', annotationId)
        .eq('user_id', user.id);

    if (error) throw error;
}

// ==================== Drawing Annotations (绘图标记) ====================

// 创建绘图标记
export async function createDrawingAnnotation(params: {
    page_id: string;
    drawing_type: DrawingType;
    geometry: Record<string, any>;
    stroke_color?: string;
    stroke_width?: number;
    fill_color?: string;
    opacity?: number;
    text_content?: string;
    font_size?: number;
    note?: string;
}) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('未登录');

    const { data, error } = await supabase
        .from('drawing_annotations')
        .insert({
            ...params,
            user_id: user.id,
            stroke_color: params.stroke_color || '#FF0000',
            stroke_width: params.stroke_width || 2,
            opacity: params.opacity || 1.0
        })
        .select()
        .single();

    if (error) throw error;
    return data as DrawingAnnotation;
}

// 获取页面的所有绘图标记
export async function getDrawingAnnotations(pageId: string) {
    const { data, error } = await supabase
        .from('drawing_annotations')
        .select()
        .eq('page_id', pageId)
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data as DrawingAnnotation[];
}

// 更新绘图标记
export async function updateDrawingAnnotation(
    annotation_id: string,
    updates: Partial<Pick<DrawingAnnotation, 'geometry' | 'stroke_color' | 'stroke_width' | 'fill_color' | 'opacity' | 'text_content' | 'font_size' | 'note'>>
) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('未登录');

    const { data, error } = await supabase
        .from('drawing_annotations')
        .update({
            ...updates,
            updated_at: new Date().toISOString()
        })
        .eq('id', annotation_id)
        .eq('user_id', user.id)
        .select()
        .single();

    if (error) throw error;
    return data as DrawingAnnotation;
}

// 删除绘图标记
export async function deleteDrawingAnnotation(annotation_id: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('未登录');

    const { error } = await supabase
        .from('drawing_annotations')
        .delete()
        .eq('id', annotation_id)
        .eq('user_id', user.id);

    if (error) throw error;
}

// ==================== 组合查询 ====================

// 获取页面的所有标记（文本 + 绘图）
export async function getAllAnnotationsForPage(page_id: string) {
    const [textAnnotations, drawingAnnotations] = await Promise.all([
        getTextAnnotations(page_id),
        getDrawingAnnotations(page_id)
    ]);

    return {
        textAnnotations,
        drawingAnnotations
    };
}

// 获取完整的标注项目数据（包含所有页面和标记）
export async function getFullAnnotation(annotation_id: string) {
    const annotation = await getAnnotation(annotation_id);
    const pages = await getAnnotationPages(annotation_id);

    const pagesWithAnnotations = await Promise.all(
        pages.map(async (page) => {
            const annotations = await getAllAnnotationsForPage(page.id);
            return {
                ...page,
                ...annotations
            };
        })
    );

    return {
        ...annotation,
        pages: pagesWithAnnotations
    };
}

// ==================== 事务 ====================

// 创建文本标记项目
export async function createTextAnnotationWithPage(params: {
    title: string;
    is_public: boolean;
    text_content: string;
    thumbnail: string;
}) {
    const {
        title,
        is_public,
        text_content,
        thumbnail
    } = params;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('未登录');

    const { data, error } = await supabase.rpc('create_text_annotation_with_page', {
        p_title: title,
        p_type: 'text',
        p_is_public: is_public,
        p_page_number: 1,
        p_content_type: 'text',
        p_text_content: text_content,
        p_slug: generateSlug(),
        p_thumbnail: thumbnail
    });

    if (error) throw error;
    return data;
}

// ==================== 工具函数 ====================

// 生成唯一的 slug
function generateSlug(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let slug = '';
    for (let i = 0; i < 8; i++) {
        slug += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return slug;
}
