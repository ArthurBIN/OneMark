export type Resume = {
    id: string;
    user_id: string;
    title: string;
    slug?: string;  //用于分享链接如 /resume/abc123
    is_public: boolean;
    thumbnail?: string;  // 缩略图，用于展示简历封面
    created_at: string;
    updated_at: string;
};

export type BlockType =
    | 'header'          // 页眉：姓名、联系方式、头像等
    | 'about'           // 关于我/个人简介
    | 'experience'      // 工作经历
    | 'education'       // 教育背景
    | 'projects'        // 项目经历
    | 'skills'          // 技能列表
    | 'certifications'  // 证书/资格认证
    | 'languages'       // 语言能力
    | 'custom';         // 自定义组件

export type ResumeBlock = {
    id: string;
    resume_id: string;
    type: BlockType;
    order_index: number; // 块的顺序索引
    content: Record<string, any>; // 块的内容
    styles: Record<string, any>; // 块的样式
    created_at: string;
    updated_at: string;
};