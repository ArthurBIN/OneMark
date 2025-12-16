import React, { useEffect, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import {
    Bold, Italic, Strikethrough, List, ListOrdered,
    Code, Quote, Link as LinkIcon, RotateCcw, RotateCw, Heading1, Heading2
} from 'lucide-react'

import './index.scss'


// 在组件最上面定义类型
interface EditorActiveStates {
    bold: boolean
    italic: boolean
    strike: boolean
    h1: boolean
    h2: boolean
    bulletList: boolean
    orderedList: boolean
    codeBlock: boolean
    blockquote: boolean
    link: boolean
}

export default function SimpleTextEditor({ value, onChange }: {
    value: string
    onChange: (html: string) => void
}) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure(),
            Placeholder.configure({
                placeholder: 'Write something …',
            }),
            Link.configure({ openOnClick: false, autolink: true, defaultProtocol: 'https' }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html);
        }
    })

    const [active, setActive] = useState<EditorActiveStates>({
        bold: false,
        italic: false,
        strike: false,
        h1: false,
        h2: false,
        bulletList: false,
        orderedList: false,
        codeBlock: false,
        blockquote: false,
        link: false,
    })

    useEffect(() => {
        if (!editor) return

        const update = () => {
            setActive({
                bold: editor.isActive('bold'),
                italic: editor.isActive('italic'),
                strike: editor.isActive('strike'),
                h1: editor.isActive('heading', { level: 1 }),
                h2: editor.isActive('heading', { level: 2 }),
                bulletList: editor.isActive('bulletList'),
                orderedList: editor.isActive('orderedList'),
                codeBlock: editor.isActive('codeBlock'),
                blockquote: editor.isActive('blockquote'),
                link: editor.isActive('link'),
            })
        }

        editor.on('selectionUpdate', update)
        editor.on('transaction', update)

        // 初始更新
        update()

        return () => {
            editor.off('selectionUpdate', update)
            editor.off('transaction', update)
        }
    }, [editor])

    if (!editor) return null

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl || 'https://')

        // 取消
        if (url === null) return

        // 清空
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }

        // 设置
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }

    return (
        <div className="simple-editor-container">
            <div className="simple-editor-toolbar">
                <div className="toolbar-group">
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={active.bold ? 'is-active' : ''}
                    >
                        <Bold size={18} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={active.italic ? 'is-active' : ''}
                    >
                        <Italic size={18} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={active.strike ? 'is-active' : ''}
                    >
                        <Strikethrough size={18} />
                    </button>
                </div>

                <div className="toolbar-separator" />

                <div className="toolbar-group">
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={active.h1 ? 'is-active' : ''}
                    >
                        <Heading1 size={18} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={active.h2 ? 'is-active' : ''}
                    >
                        <Heading2 size={18} />
                    </button>
                </div>

                <div className="toolbar-separator" />

                <div className="toolbar-group">
                    <button
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={active.bulletList ? 'is-active' : ''}
                    >
                        <List size={18} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={active.orderedList ? 'is-active' : ''}
                    >
                        <ListOrdered size={18} />
                    </button>
                </div>

                <div className="toolbar-separator" />

                <div className="toolbar-group">
                    <button
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        className={active.codeBlock ? 'is-active' : ''}
                    >
                        <Code size={18} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={active.blockquote ? 'is-active' : ''}
                    >
                        <Quote size={18} />
                    </button>
                    <button onClick={setLink} className={active.link ? 'is-active' : ''}>
                        <LinkIcon size={18} />
                    </button>
                </div>

                <div className="toolbar-separator" />

                <div className="toolbar-group">
                    <button
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                    >
                        <RotateCcw size={18} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                    >
                        <RotateCw size={18} />
                    </button>
                </div>
            </div>

            <EditorContent editor={editor} className="simple-editor-content" />
        </div>
    )
}