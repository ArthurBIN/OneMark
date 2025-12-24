export interface UserProfile {
    id: string
    email: string
    display_name: string | null
    avatar_url: string | null
    avatar_bg_color: string
    bio: string | null
    created_at: string
    updated_at: string
}