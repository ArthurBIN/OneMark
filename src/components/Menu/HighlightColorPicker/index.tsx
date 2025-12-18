import './index.scss'
import { useRef, useState } from 'react'
import type { Editor } from '@tiptap/react'
import { useEditorState } from '@tiptap/react'
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg'
import { Tooltip } from 'antd'

const HIGHLIGHT_COLORS = [
    { color: '#fff59d', label: '黄色' },
    { color: '#a5d6a7', label: '绿色' },
    { color: '#90caf9', label: '蓝色' },
    { color: '#ef9a9a', label: '红色' },
    { color: '#ce93d8', label: '紫色' },
    { color: '#ffcc80', label: '橙色' },
    { color: '#80deea', label: '青色' },
    { color: '#f48fb1', label: '粉色' },
]

export default function HighlightColorPicker({ editor }: { editor: Editor }) {
    const dropdownRef = useRef<HTMLDivElement>(null)
    const [isHovering, setIsHovering] = useState(false)

    // 监听编辑器状态，包括当前高亮颜色
    const { isHighlight, currentColor } = useEditorState({
        editor,
        selector: ({ editor }) => {
            const highlightAttrs = editor.getAttributes('highlight')
            return {
                isHighlight: editor.isActive('highlight'),
                currentColor: highlightAttrs.color || '#fff59d',
            }
        },
    })

    // 点击按钮直接应用当前颜色
    const toggleHighlight = () => {
        if (isHighlight) {
            // 如果已经高亮，则取消高亮
            editor.chain().focus().unsetHighlight().run()
        } else {
            // 如果未高亮，直接应用当前颜色
            editor.chain().focus().setHighlight({ color: currentColor }).run()
        }
    }

    // 应用高亮颜色
    const applyHighlight = (color: string) => {
        editor.chain().focus().setHighlight({ color }).run()
    }

    // 移除高亮
    const removeHighlight = () => {
        editor.chain().focus().unsetHighlight().run()
    }

    return (
        <div
            className="highlight-color-picker"
            ref={dropdownRef}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <Tooltip placement="top" title="高亮颜色" color="black">
                <button
                    className={`highlight-color-picker__trigger ${isHighlight ? 'is-active' : ''}`}
                    onClick={toggleHighlight}
                >
                    <svg className="remix">
                        <use xlinkHref={`${remixiconUrl}#ri-mark-pen-line`} />
                    </svg>
                    <span
                        className="highlight-color-picker__color-bar"
                        style={{ backgroundColor: currentColor }}
                    />
                </button>
            </Tooltip>

            <div className={`highlight-color-picker__menu ${isHovering ? 'is-visible' : ''}`}>
                <div className="highlight-color-picker__colors">
                    {HIGHLIGHT_COLORS.map((item, index) => (
                        <button
                            key={index}
                            className={`highlight-color-picker__color-item ${currentColor === item.color ? 'is-active' : ''}`}
                            style={{ backgroundColor: item.color }}
                            onClick={() => applyHighlight(item.color)}
                        >
                            {currentColor === item.color && (
                                <svg className="remix highlight-color-picker__check">
                                    <use xlinkHref={`${remixiconUrl}#ri-check-line`} />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
                <div className="highlight-color-picker__divider" />
                <button
                    className="highlight-color-picker__remove"
                    onClick={removeHighlight}
                >
                    <svg className="remix">
                        <use xlinkHref={`${remixiconUrl}#ri-format-clear`} />
                    </svg>
                    <span>清除高亮</span>
                </button>
            </div>
        </div>
    )
}