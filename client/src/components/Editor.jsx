import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';

export function Editor({ value, onChange }) {
  const editor = useEditor({ extensions: [StarterKit, Link.configure({ openOnClick: false }), Placeholder.configure({ placeholder: 'Start writing your idea...' })], content: value || '<p></p>', onUpdate: ({ editor: current }) => onChange(current.getJSON()) });
  if (!editor) return null;
  const button = (label, action, active) => <button type="button" onClick={action} className={`rounded px-2 py-1 text-sm ${active ? 'bg-[#6575e8] text-white' : 'bg-[#f0f1f8] dark:bg-[#35405a]'}`}>{label}</button>;
  return <div className="overflow-hidden rounded-xl border border-[#e5e7f0] dark:border-[#35405a]">
    <div className="flex flex-wrap gap-2 border-b border-[#e5e7f0] p-3 dark:border-[#35405a]">{button('B', () => editor.chain().focus().toggleBold().run(), editor.isActive('bold'))}{button('I', () => editor.chain().focus().toggleItalic().run(), editor.isActive('italic'))}{button('H2', () => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive('heading', { level: 2 }))}{button('• List', () => editor.chain().focus().toggleBulletList().run(), editor.isActive('bulletList'))}{button('Quote', () => editor.chain().focus().toggleBlockquote().run(), editor.isActive('blockquote'))}</div>
    <EditorContent editor={editor} className="editor-content p-5"/>
  </div>;
}

