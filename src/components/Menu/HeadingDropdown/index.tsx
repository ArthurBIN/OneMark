import './index.scss'
import { useState, useRef, useEffect } from 'react'
import type { Editor } from '@tiptap/react'
import { useEditorState } from '@tiptap/react'

interface HeadingOption {
    label: string
    level?: number
    icon: string
    action: () => void
    isActive: () => boolean
}

export default function HeadingDropdown({ editor }: { editor: Editor }) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // 使用 useEditorState 监听编辑器状态变化
    const editorState = useEditorState({
        editor,
        selector: ({ editor }) => ({
            isParagraph: editor.isActive('paragraph'),
            isH1: editor.isActive('heading', { level: 1 }),
            isH2: editor.isActive('heading', { level: 2 }),
            isH3: editor.isActive('heading', { level: 3 }),
            isH4: editor.isActive('heading', { level: 4 }),
        }),
    })

    const options: HeadingOption[] = [
        {
            label: '段落',
            icon: 'paragraph',
            action: () => editor.chain().focus().setParagraph().run(),
            isActive: () => editor.isActive('paragraph'),
        },
        {
            label: '一级标题',
            level: 1,
            icon: 'h-1',
            action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            isActive: () => editor.isActive('heading', { level: 1 }),
        },
        {
            label: '二级标题',
            level: 2,
            icon: 'h-2',
            action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: () => editor.isActive('heading', { level: 2 }),
        },
        {
            label: '三级标题',
            level: 3,
            icon: 'h-3',
            action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
            isActive: () => editor.isActive('heading', { level: 3 }),
        },
        {
            label: '四级标题',
            level: 4,
            icon: 'h-4',
            action: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
            isActive: () => editor.isActive('heading', { level: 4 }),
        }
    ]

    // 获取当前激活的选项
    const activeOption = options.find(option => option.isActive()) || options[0]

    // 点击外部关闭下拉框
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleOptionClick = (option: HeadingOption) => {
        option.action()
        setIsOpen(false)
    }

    return (
        <div className="heading-dropdown" ref={dropdownRef}>
            <button
                className={`heading-dropdown__trigger ${isOpen ? 'is-open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                title="选择标题级别"
            >
                <i className={`ri-${activeOption.icon} remix`} />
                <span className="heading-dropdown__label">{activeOption.label}</span>
                <i className={`ri-arrow-down-s-line remix heading-dropdown__arrow`} />
            </button>

            {isOpen && (
                <div className="heading-dropdown__menu">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            className={`heading-dropdown__item ${option.isActive() ? 'is-active' : ''}`}
                            onClick={() => handleOptionClick(option)}
                        >
                            <i className={`ri-${option.icon} remix`} />

                            <span>{option.label}</span>
                            {option.isActive() && (
                                <i className={`ri-check-line remix heading-dropdown__check`} />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}