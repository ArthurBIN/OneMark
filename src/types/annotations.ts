export type Annotation = {
    id: string;
    user_id: string;
    title: string;
    slug?: string;  //用于分享链接如 /resume/abc123
    is_public: boolean;
    thumbnail?: string;  // 缩略图，用于展示简历封面
    created_at: string;
    updated_at: string;
};