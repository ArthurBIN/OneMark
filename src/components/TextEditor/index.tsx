import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CharacterCount from "@tiptap/extension-character-count";
import './index.scss'
import MenuBar from '../Menu/MenuBar'


export default function TextEditor({ value, onChange }: {
    value?: string
    onChange: (html: string) => void
}) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({ placeholder: "请输入内容..." }),
            Highlight,
            TaskList,
            TaskItem,
            CharacterCount.configure({ limit: 10000 }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html);
        }
    })

    if (!editor) return null

    return (
        <div className="editor-container">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} className="editor-content" />
        </div>
    )
}