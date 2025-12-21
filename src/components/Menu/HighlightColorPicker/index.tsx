import './index.scss'
import type { Editor } from '@tiptap/react'
import { useEditorState } from '@tiptap/react'
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg'
import { Tooltip, Popover } from 'antd'

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

    const toggleHighlight = () => {
        if (isHighlight) {
            editor.chain().focus().unsetHighlight().run()
        } else {
            editor.chain().focus().setHighlight({ color: currentColor }).run()
        }
    }

    const applyHighlight = (color: string) => {
        editor.chain().focus().setHighlight({ color }).run()
    }

    const removeHighlight = () => {
        editor.chain().focus().unsetHighlight().run()
    }

    /** Popover 内容 */
    const popoverContent = (
        <div>
            <div className="highlight-color-picker__colors">
                {HIGHLIGHT_COLORS.map(item => (
                    <button
                        key={item.color}
                        className={`highlight-color-picker__color-item ${currentColor === item.color ? 'is-active' : ''
                            }`}
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
    )

    return (
        <Popover
            placement="bottomLeft"
            content={popoverContent}
            trigger="hover"
            overlayClassName="highlight-color-picker__popover"
        >
            <Tooltip placement="top" title="高亮颜色" color="black">
                <button
                    className={`highlight-color-picker__trigger ${isHighlight ? 'is-active' : ''
                        }`}
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
        </Popover>
    )
}
