import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import { Highlight } from '@tiptap/extension-highlight';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Button, Dropdown, Modal, Input, Select, ColorPicker, Space, Divider } from 'antd';
import type { MenuProps } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  LinkOutlined,
  PictureOutlined,
  TableOutlined,
  CodeOutlined,
  HighlightOutlined,
  BgColorsOutlined,
  UndoOutlined,
  RedoOutlined,
  LineOutlined,
  FontColorsOutlined,
} from '@ant-design/icons';
import { MediaManager } from '../media';
import './RichTextEditor.css';

interface RichTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  height?: number;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = '',
  onChange,
  placeholder = 'Nhập nội dung...',
  height = 400,
}) => {
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [linkTarget, setLinkTarget] = useState<'_self' | '_blank'>('_self');
  const [selectedMedia, setSelectedMedia] = useState<any>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'editor-link',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'editor-table',
        },
      }),
      TableRow,
      TableCell,
      TableHeader,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Highlight.configure({
        multicolor: true,
      }),
      TextStyle,
      Color,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none',
        placeholder: placeholder,
      },
    },
  });

  // Update editor content when value prop changes
  useEffect(() => {
    if (editor && value !== undefined) {
      const currentContent = editor.getHTML();
      // Only update if content is different to avoid cursor jumping
      if (currentContent !== value) {
        editor.commands.setContent(value);
      }
    }
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  // Heading dropdown items
  const headingItems: MenuProps['items'] = [
    {
      key: 'p',
      label: 'Paragraph',
      onClick: () => editor.chain().focus().setParagraph().run(),
    },
    { type: 'divider' },
    {
      key: 'h1',
      label: 'Heading 1',
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      key: 'h2',
      label: 'Heading 2',
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      key: 'h3',
      label: 'Heading 3',
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      key: 'h4',
      label: 'Heading 4',
      onClick: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
    },
    {
      key: 'h5',
      label: 'Heading 5',
      onClick: () => editor.chain().focus().toggleHeading({ level: 5 }).run(),
    },
    {
      key: 'h6',
      label: 'Heading 6',
      onClick: () => editor.chain().focus().toggleHeading({ level: 6 }).run(),
    },
  ];

  // Get current heading level for display
  const getCurrentHeading = () => {
    if (editor.isActive('heading', { level: 1 })) return 'H1';
    if (editor.isActive('heading', { level: 2 })) return 'H2';
    if (editor.isActive('heading', { level: 3 })) return 'H3';
    if (editor.isActive('heading', { level: 4 })) return 'H4';
    if (editor.isActive('heading', { level: 5 })) return 'H5';
    if (editor.isActive('heading', { level: 6 })) return 'H6';
    return 'Paragraph';
  };

  // Table dropdown items
  const tableItems: MenuProps['items'] = [
    {
      key: 'insert',
      label: 'Chèn bảng 3x3',
      onClick: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
    },
    { type: 'divider' },
    {
      key: 'addRowBefore',
      label: 'Thêm hàng phía trên',
      onClick: () => editor.chain().focus().addRowBefore().run(),
      disabled: !editor.can().addRowBefore(),
    },
    {
      key: 'addRowAfter',
      label: 'Thêm hàng phía dưới',
      onClick: () => editor.chain().focus().addRowAfter().run(),
      disabled: !editor.can().addRowAfter(),
    },
    {
      key: 'deleteRow',
      label: 'Xóa hàng',
      onClick: () => editor.chain().focus().deleteRow().run(),
      disabled: !editor.can().deleteRow(),
    },
    { type: 'divider' },
    {
      key: 'addColumnBefore',
      label: 'Thêm cột bên trái',
      onClick: () => editor.chain().focus().addColumnBefore().run(),
      disabled: !editor.can().addColumnBefore(),
    },
    {
      key: 'addColumnAfter',
      label: 'Thêm cột bên phải',
      onClick: () => editor.chain().focus().addColumnAfter().run(),
      disabled: !editor.can().addColumnAfter(),
    },
    {
      key: 'deleteColumn',
      label: 'Xóa cột',
      onClick: () => editor.chain().focus().deleteColumn().run(),
      disabled: !editor.can().deleteColumn(),
    },
    { type: 'divider' },
    {
      key: 'deleteTable',
      label: 'Xóa bảng',
      onClick: () => editor.chain().focus().deleteTable().run(),
      disabled: !editor.can().deleteTable(),
      danger: true,
    },
  ];

  // Handle image selection from media library
  const handleSelectImage = (media: any) => {
    setSelectedMedia(media);
  };

  // Handle insert selected image
  const handleInsertImage = () => {
    if (selectedMedia) {
      const imageUrl = selectedMedia.url.startsWith('http')
        ? selectedMedia.url
        : `http://localhost:5002${selectedMedia.url}`;

      editor.chain().focus().setImage({ src: imageUrl, alt: selectedMedia.alt || selectedMedia.originalName }).run();
      setShowMediaModal(false);
      setSelectedMedia(null);
    }
  };

  // Handle link insertion
  const handleInsertLink = () => {
    if (!linkUrl) return;

    if (linkText) {
      // Insert new link with text
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${linkUrl}" target="${linkTarget}">${linkText}</a>`)
        .run();
    } else {
      // Set link on selected text
      editor
        .chain()
        .focus()
        .setLink({ href: linkUrl, target: linkTarget })
        .run();
    }

    setShowLinkModal(false);
    setLinkUrl('');
    setLinkText('');
    setLinkTarget('_self');
  };

  // Open link modal
  const openLinkModal = () => {
    const { href } = editor.getAttributes('link');
    if (href) {
      setLinkUrl(href);
    }
    setShowLinkModal(true);
  };



  return (
    <div className="rich-text-editor">
      {/* Modern Toolbar */}
      <div className="editor-toolbar">
        <Space wrap size="small">
          {/* Heading Dropdown */}
          <Dropdown menu={{ items: headingItems }} trigger={['click']}>
            <Button size="small">
              {getCurrentHeading()} <span style={{ marginLeft: 4 }}>▼</span>
            </Button>
          </Dropdown>

          <Divider type="vertical" style={{ margin: '0 4px' }} />

          {/* Text Formatting */}
          <Button
            size="small"
            icon={<BoldOutlined />}
            type={editor.isActive('bold') ? 'primary' : 'default'}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold (Ctrl+B)"
          />
          <Button
            size="small"
            icon={<ItalicOutlined />}
            type={editor.isActive('italic') ? 'primary' : 'default'}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic (Ctrl+I)"
          />
          <Button
            size="small"
            icon={<UnderlineOutlined />}
            type={editor.isActive('underline') ? 'primary' : 'default'}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="Underline (Ctrl+U)"
          />
          <Button
            size="small"
            icon={<StrikethroughOutlined />}
            type={editor.isActive('strike') ? 'primary' : 'default'}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            title="Strikethrough"
          />

          <Divider type="vertical" style={{ margin: '0 4px' }} />

          {/* Text Color */}
          <ColorPicker
            size="small"
            value={editor.getAttributes('textStyle').color || '#000000'}
            onChange={(color) => {
              editor.chain().focus().setColor(color.toHexString()).run();
            }}
            showText={(color) => <FontColorsOutlined style={{ color: color.toHexString() }} />}
          />

          {/* Highlight */}
          <ColorPicker
            size="small"
            value={editor.getAttributes('highlight').color || '#ffff00'}
            onChange={(color) => {
              editor.chain().focus().toggleHighlight({ color: color.toHexString() }).run();
            }}
            showText={(color) => <HighlightOutlined style={{ color: color.toHexString() }} />}
          />

          <Divider type="vertical" style={{ margin: '0 4px' }} />

          {/* Alignment */}
          <Button
            size="small"
            icon={<AlignLeftOutlined />}
            type={editor.isActive({ textAlign: 'left' }) ? 'primary' : 'default'}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            title="Align Left"
          />
          <Button
            size="small"
            icon={<AlignCenterOutlined />}
            type={editor.isActive({ textAlign: 'center' }) ? 'primary' : 'default'}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            title="Align Center"
          />
          <Button
            size="small"
            icon={<AlignRightOutlined />}
            type={editor.isActive({ textAlign: 'right' }) ? 'primary' : 'default'}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            title="Align Right"
          />
          <Button
            size="small"
            icon={<AlignLeftOutlined />}
            type={editor.isActive({ textAlign: 'justify' }) ? 'primary' : 'default'}
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            title="Justify"
          />

          <Divider type="vertical" style={{ margin: '0 4px' }} />

          {/* Lists */}
          <Button
            size="small"
            icon={<UnorderedListOutlined />}
            type={editor.isActive('bulletList') ? 'primary' : 'default'}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Bullet List"
          />
          <Button
            size="small"
            icon={<OrderedListOutlined />}
            type={editor.isActive('orderedList') ? 'primary' : 'default'}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Numbered List"
          />

          <Divider type="vertical" style={{ margin: '0 4px' }} />

          {/* Insert */}
          <Button
            size="small"
            icon={<LinkOutlined />}
            onClick={openLinkModal}
            title="Insert Link"
          />
          <Button
            size="small"
            icon={<PictureOutlined />}
            onClick={() => setShowMediaModal(true)}
            title="Insert Image"
          />
          <Dropdown menu={{ items: tableItems }} trigger={['click']}>
            <Button
              size="small"
              icon={<TableOutlined />}
              title="Table"
            />
          </Dropdown>
          <Button
            size="small"
            icon={<LineOutlined />}
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Line"
          />

          <Divider type="vertical" style={{ margin: '0 4px' }} />

          {/* Code */}
          <Button
            size="small"
            icon={<CodeOutlined />}
            type={editor.isActive('codeBlock') ? 'primary' : 'default'}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            title="Code Block"
          />

          <Divider type="vertical" style={{ margin: '0 4px' }} />

          {/* Undo/Redo */}
          <Button
            size="small"
            icon={<UndoOutlined />}
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo (Ctrl+Z)"
          />
          <Button
            size="small"
            icon={<RedoOutlined />}
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo (Ctrl+Y)"
          />
        </Space>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="editor-content"
        style={{ minHeight: height }}
      />

      {/* Image Selection Modal */}
      <Modal
        title="Chọn ảnh từ thư viện"
        open={showMediaModal}
        onCancel={() => {
          setShowMediaModal(false);
          setSelectedMedia(null);
        }}
        onOk={handleInsertImage}
        okText="Chèn ảnh"
        cancelText="Hủy"
        okButtonProps={{ disabled: !selectedMedia }}
        width="90%"
        style={{ top: 20 }}
      >
        <div style={{ minHeight: 500 }}>
          <MediaManager
            onSelect={handleSelectImage}
            selectedId={selectedMedia?.id}
            selectable={true}
            multiple={false}
            showFolderTree={true}
          />
        </div>
      </Modal>

      {/* Link Modal */}
      <Modal
        title="Chèn liên kết"
        open={showLinkModal}
        onOk={handleInsertLink}
        onCancel={() => {
          setShowLinkModal(false);
          setLinkUrl('');
          setLinkText('');
          setLinkTarget('_self');
        }}
        okText="Chèn"
        cancelText="Hủy"
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div>
            <label style={{ display: 'block', marginBottom: 8 }}>URL:</label>
            <Input
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 8 }}>Văn bản hiển thị (tùy chọn):</label>
            <Input
              placeholder="Nhập văn bản..."
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 8 }}>Mở liên kết:</label>
            <Select
              style={{ width: '100%' }}
              value={linkTarget}
              onChange={setLinkTarget}
              options={[
                { value: '_self', label: 'Cùng tab' },
                { value: '_blank', label: 'Tab mới' },
              ]}
            />
          </div>
        </Space>
      </Modal>
    </div>
  );
};

