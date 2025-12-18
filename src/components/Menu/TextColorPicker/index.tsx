import './index.scss'
import { useRef, useState } from 'react'
import type { Editor } from '@tiptap/react'
import { useEditorState } from '@tiptap/react'
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg'
import { Tooltip } from 'antd'

const TEXT_COLORS = [
    { color: '#000000', label: '黑色' },
    { color: '#ffffff', label: '白色' },
    { color: '#ff0000', label: '红色' },
    { color: '#00ff00', label: '绿色' },
    { color: '#0000ff', label: '蓝色' },
    { color: '#ffff00', label: '黄色' },
    { color: '#ff00ff', label: '洋红' },
    { color: '#00ffff', label: '青色' },
    { color: '#ffa500', label: '橙色' },
    { color: '#800080', label: '紫色' },
    { color: '#808080', label: '灰色' },
    { color: '#a52a2a', label: '棕色' },
]

export default function TextColorPicker({ editor }: { editor: Editor }) {
    const dropdownRef = useRef<HTMLDivElement>(null)
    const [isHovering, setIsHovering] = useState(false)

    // 监听编辑器状态
    const { currentColor } = useEditorState({
        editor,
        selector: ({ editor }) => {
            const color = editor.getAttributes('textStyle').color || '#000000'
            return {
                currentColor: color,
            }
        },
    })

    // 应用文字颜色
    const applyColor = (color: string) => {
        editor.chain().focus().setColor(color).run()
    }

    // 清除颜色
    const removeColor = () => {
        editor.chain().focus().unsetColor().run()
    }

    return (
        <div
            className="text-color-picker"
            ref={dropdownRef}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <Tooltip placement="top" title="文字颜色" color="black">
                <button
                    className="text-color-picker__trigger"
                    onClick={() => applyColor(currentColor)}
                >
                    <svg className="remix">
                        <use xlinkHref={`${remixiconUrl}#ri-font-color`} />
                    </svg>
                    <span
                        className="text-color-picker__color-bar"
                        style={{ backgroundColor: currentColor }}
                    />
                </button>
            </Tooltip>

            <div className={`text-color-picker__menu ${isHovering ? 'is-visible' : ''}`}>
                <div className="text-color-picker__colors">
                    {TEXT_COLORS.map((item, index) => (
                        <button
                            key={index}
                            className={`text-color-picker__color-item ${currentColor === item.color ? 'is-active' : ''}`}
                            style={{ backgroundColor: item.color }}
                            onClick={() => applyColor(item.color)}
                            title={item.label}
                        >
                            {currentColor === item.color && (
                                <svg className="remix text-color-picker__check">
                                    <use xlinkHref={`${remixiconUrl}#ri-check-line`} />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
                <div className="text-color-picker__divider" />
                <button
                    className="text-color-picker__remove"
                    onClick={removeColor}
                >
                    <svg className="remix">
                        <use xlinkHref={`${remixiconUrl}#ri-format-clear`} />
                    </svg>
                    <span>清除颜色</span>
                </button>
            </div>
        </div>
    )
}