import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Highlight from "@tiptap/extension-highlight"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import CharacterCount from "@tiptap/extension-character-count"
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import { FontSize } from './extensions/fontSize'
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
            Highlight.configure({
                multicolor: true
            }),
            TaskList,
            TaskItem,
            CharacterCount.configure({ limit: 10000 }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                alignments: ['left', 'center', 'right', 'justify'],
                defaultAlignment: 'left',
            }),
            Underline,
            TextStyle,
            Color,
            FontSize,
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