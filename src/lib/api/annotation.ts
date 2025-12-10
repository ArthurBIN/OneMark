// services/annotation.ts
import { supabase } from '@/utils/supabaseClient';
import type { Annotation } from '@/types/annotations';

type AnnotationType = 'text' | 'file' | 'img';

// 创建空白标注项目
export async function createAnnotation(title: string = '新的标注项目', type: AnnotationType) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('未登录');

    const { data: annotation, error } = await supabase
        .from('annotations')
        .insert({
            user_id: user.id,
            title,
            type
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
    return data ?? [];
}

// 删除标注项目
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
