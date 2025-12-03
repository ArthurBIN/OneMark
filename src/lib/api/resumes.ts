// services/resume.ts
import { supabase } from '@/utils/supabaseClient';
import type { Resume } from '@/types/resumes';

// 创建空白简历
export async function createEmptyResume(title: string = '我的新简历') {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('未登录');

    const { data: resume, error } = await supabase
        .from('resumes')
        .insert({
            user_id: user.id,
            title,
        })
        .select()
        .single();

    if (error) throw error;

    // 可选：插入一个默认的 header 块，让用户不至于看到完全空白
    await supabase.from('resume_blocks').insert({
        resume_id: resume.id,
        type: 'header',
        order_index: 0,
        content: {
            name: '你的姓名',
            title: '职业头衔',
            email: 'email@example.com',
            phone: '',
            location: '',
            website: '',
            summary: '一句话介绍自己...',
        },
        styles: {
            textAlign: 'center',
            backgroundColor: '#ffffff',
            color: '#000000',
        },
    });

    return resume as Resume;
}

// 获取用户所有简历列表
export async function getMyResumes() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('未登录');
    }

    const { data, error } = await supabase
        .from('resumes')
        .select('id, title, slug, is_public, thumbnail, created_at, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
}

// 获取某个简历的完整数据（包含所有 blocks，按顺序）
export async function getResumeWithBlocks(resumeId: string) {
    // 先拿 resume
    const { data: resume } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', resumeId)
        .single();

    // 再拿 blocks
    const { data: blocks } = await supabase
        .from('resume_blocks')
        .select('*')
        .eq('resume_id', resumeId)
        .order('order_index', { ascending: true });

    return { resume, blocks };
}