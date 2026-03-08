// types/collaborator.ts
export type CollaboratorRole = 'editor' | 'viewer'

export interface Collaborator {
    id: string
    annotation_id: string
    user_id: string
    role: CollaboratorRole
    created_at: string
    updated_at: string
}