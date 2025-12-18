import './index.scss'
import { useState, useRef, useEffect } from 'react'
import type { Editor } from '@tiptap/react'
import { Tooltip } from 'antd'

const FONT_SIZES = [
    { value: '12px', label: '12' },
    { value: '14px', label: '14' },
    { value: '16px', label: '16' },
    { value: '18px', label: '18' },
    { value: '20px', label: '20' },
    { value: '24px', label: '24' },
    { value: '28px', label: '28' },
    { value: '32px', label: '32' },
    { value: '36px', label: '36' },
]

export default function FontSizePicker({ editor }: { editor: Editor }) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

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

    const applyFontSize = (size: string) => {
        editor.chain().focus().setFontSize(size).run()
        setIsOpen(false)
    }

    return (
        <div className="font-size-picker" ref={dropdownRef}>
            <Tooltip placement="top" title="字体大小" color="black">
                <button
                    className="font-size-picker__trigger"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <i className="ri-font-size remix" />
                    <i className="ri-arrow-down-s-line remix font-size-picker__arrow" />
                </button>
            </Tooltip>

            {isOpen && (
                <div className="font-size-picker__menu">
                    {FONT_SIZES.map((item) => (
                        <button
                            key={item.value}
                            className="font-size-picker__item"
                            onClick={() => applyFontSize(item.value)}
                        >
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}