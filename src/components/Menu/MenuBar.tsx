import './MenuBar.scss'
import type { Editor } from '@tiptap/react'
import { useEditorState } from '@tiptap/react'

import MenuItem from './MenuItem.tsx'
import HeadingDropdown from './HeadingDropdown/index.tsx'
import HighlightColorPicker from './HighlightColorPicker/index.tsx'
import TextColorPicker from './TextColorPicker/index.tsx'
import FontSizePicker from './FontSizePicker/index.tsx'

export default function MenuBar({ editor }: { editor: Editor }) {
  const editorState = useEditorState({
    editor,
    selector: ({ editor }) => {
      // 直接从当前选区获取 textAlign 属性
      const { textAlign } = editor.getAttributes('textStyle')
      const currentAlign = textAlign || editor.getAttributes('paragraph').textAlign || editor.getAttributes('heading').textAlign || 'left'

      return {
        bold: editor.isActive('bold'),
        italic: editor.isActive('italic'),
        strike: editor.isActive('strike'),
        code: editor.isActive('code'),
        highlight: editor.isActive('highlight'),
        bulletList: editor.isActive('bulletList'),
        orderedList: editor.isActive('orderedList'),
        taskList: editor.isActive('taskList'),
        codeBlock: editor.isActive('codeBlock'),
        blockquote: editor.isActive('blockquote'),
        textAlign: currentAlign,
      }
    },
  })

  const items = [
    {
      icon: 'bold',
      title: '加粗',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive('bold'),
    },
    {
      icon: 'italic',
      title: '斜体',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive('italic'),
    },
    {
      icon: 'underline',
      title: '下划线',
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: () => editor.isActive('underline'),
    },
    {
      icon: 'strikethrough',
      title: '删除线',
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive('strike'),
    },
    {
      type: 'text-color-picker',
    },
    {
      type: 'highlight-color-picker',
    },
    {
      type: 'font-size-picker',
    },
    {
      type: 'divider',
    },
    {
      type: 'heading-dropdown',
    },
    {
      type: 'divider',
    },
    {
      icon: 'align-left',
      title: '左对齐',
      action: () => editor.chain().focus().setTextAlign('left').run(),
      isActive: () => editorState.textAlign === 'left',
    },
    {
      icon: 'align-center',
      title: '居中对齐',
      action: () => editor.chain().focus().setTextAlign('center').run(),
      isActive: () => editorState.textAlign === 'center',
    },
    {
      icon: 'align-right',
      title: '右对齐',
      action: () => editor.chain().focus().setTextAlign('right').run(),
      isActive: () => editorState.textAlign === 'right',
    },
    {
      icon: 'align-justify',
      title: '两端对齐',
      action: () => editor.chain().focus().setTextAlign('justify').run(),
      isActive: () => editorState.textAlign === 'justify',
    },
    {
      type: 'divider',
    },
    {
      icon: 'list-unordered',
      title: '无序列表',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive('bulletList'),
    },
    {
      icon: 'list-ordered',
      title: '有序列表',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive('orderedList'),
    },
    {
      icon: 'list-check-2',
      title: '任务列表',
      action: () => editor.chain().focus().toggleTaskList().run(),
      isActive: () => editor.isActive('taskList'),
    },
    {
      icon: 'code-box-line',
      title: '代码块',
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: () => editor.isActive('codeBlock'),
    },
    {
      type: 'divider',
    },
    {
      icon: 'double-quotes-l',
      title: '引用块',
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive('blockquote'),
    },
    {
      icon: 'separator',
      title: '水平分割线',
      action: () => editor.chain().focus().setHorizontalRule().run(),
    },
    {
      type: 'divider',
    },
    {
      icon: 'text-wrap',
      title: '换行',
      action: () => editor.chain().focus().setHardBreak().run(),
    },
    {
      icon: 'format-clear',
      title: '清除格式',
      action: () => editor.chain().focus().clearNodes().unsetAllMarks().run(),
    },
    {
      type: 'divider',
    },
    {
      icon: 'arrow-go-back-line',
      title: '撤销',
      action: () => editor.chain().focus().undo().run(),
    },
    {
      icon: 'arrow-go-forward-line',
      title: '重做',
      action: () => editor.chain().focus().redo().run(),
    },
  ]

  return (
    <div className="editor__header">
      {items.map((item, index) => (
        <div key={index}>
          {item?.type === 'divider' ? (
            <div className="divider" />
          ) : item?.type === 'heading-dropdown' ? (
            <HeadingDropdown editor={editor} />
          ) : item?.type === 'highlight-color-picker' ? (
            <HighlightColorPicker editor={editor} />
          ) : item?.type === 'text-color-picker' ? (
            <TextColorPicker editor={editor} />
          ) : item?.type === 'font-size-picker' ? (
            <FontSizePicker editor={editor} />
          ) : (
            <MenuItem {...item} />
          )}
        </div>
      ))}
    </div>
  )
}