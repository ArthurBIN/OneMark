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
import { useDrawing } from '@/contexts/DrawingContext';
import { useEffect, useRef } from 'react'
import DrawingCanvas from '@/components/DrawingCanvas';
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from "@/store"
import { setColor, setLineWidth, setTool } from '@/store/modules/drawingSlice'


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

    const dispatch = useDispatch<AppDispatch>()

    const {
        tool,
        color,
        lineWidth
    } = useSelector((state: RootState) => state.drawing)

    const editorContainerRef = useRef<HTMLDivElement | null>(null);
    const { isDrawingMode, drawingTool, setIsDrawingMode, setDrawingTool } = useDrawing();

    // 监听右键取消绘图事件
    useEffect(() => {
        const handleCancelDrawing = () => {
            setIsDrawingMode(false);
            setDrawingTool(null);
        }

        window.addEventListener('cancelDrawing', handleCancelDrawing);

        return () => {
            window.removeEventListener('cancelDrawing', handleCancelDrawing);
        }
    }, [setIsDrawingMode, setDrawingTool]);

    useEffect(() => {
        dispatch(setTool(drawingTool))

        switch (drawingTool) {
            case 'pencil':
                dispatch(setLineWidth(2));
                return;
            case 'pen':
                dispatch(setLineWidth(3));
                return;
            case 'marker':
                dispatch(setColor('#ffeb3b'));
                dispatch(setLineWidth(8));
                return;
            case 'brush':
                dispatch(setLineWidth(5));
                return;
            default:
                dispatch(setLineWidth(2));
                return;
        }
    }, [drawingTool])

    if (!editor) return null

    return (
        <div className="editor-container">
            <MenuBar editor={editor} />
            <div ref={editorContainerRef}>
                <EditorContent editor={editor} className="editor-content" />
                {/* 绘图层 */}
                {isDrawingMode && editorContainerRef.current && (
                    <DrawingCanvas
                        isActive={isDrawingMode}
                        targetRef={editorContainerRef}
                        color={color}
                        lineWidth={lineWidth}
                        tool={tool}
                    />
                )}
            </div>
        </div>
    )
}