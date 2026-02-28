import { useState, useEffect } from 'react'
import { useList, useOne, useUpdate, useNavigation } from '@refinedev/core'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/ui/spinner'
import {
  PostEditorLayout,
  PublishBox,
  CategoriesBox,
  TagsBox,
  FeaturedImageBox,
  SEOBox
} from '../../components/posts'
import { RichTextEditor } from '../../components/common/RichTextEditor'
import { slugify, generateMetaDescription } from '../../utils/slugify'
import { FileText, Bot, Zap, Loader2, Search } from 'lucide-react'
import { AIButton } from '@/components/ui/ai-coming-soon'
import axios from 'axios'

const AI_ENABLED = false

export const PostEdit = () => {
  const { id } = useParams()
  const { push } = useNavigation()
  const { mutate: updatePost, isLoading: isUpdating } = useUpdate()

  // Fetch post data
  const { data: postQuery, isLoading } = useOne({
    resource: 'posts',
    id: id as string,
  })
  const postData = postQuery?.data

  // Form state
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>('DRAFT')
  const [publishedAt, setPublishedAt] = useState<string | null>(null)
  const [categoryId, setCategoryId] = useState<string>('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [thumbnail, setThumbnail] = useState<string>('')
  const [metaTitle, setMetaTitle] = useState<string>('')
  const [metaDescription, setMetaDescription] = useState<string>('')
  const [metaKeywords, setMetaKeywords] = useState<string>('')
  const [isFeatured, setIsFeatured] = useState<boolean>(false)
  const [excerpt, setExcerpt] = useState<string>('')
  const [content, setContent] = useState<string>('')

  // AI state
  const [focusKeyword, setFocusKeyword] = useState('')
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)

  // Validation error states
  const [contentError, setContentError] = useState<boolean>(false)
  const [categoryError, setCategoryError] = useState<boolean>(false)

  // Toast message
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  // Initialize state from postData
  useEffect(() => {
    if (postData) {
      setTitle(postData.title || '')
      setSlug(postData.slug || '')
      setStatus(postData.status || 'DRAFT')
      setPublishedAt(postData.publishedAt || null)
      setCategoryId(postData.categoryId || '')
      setSelectedTags(postData.tags?.map((t: any) => t.tagId) || [])
      setThumbnail(postData.thumbnail || '')
      setContent(postData.content || '')
      setExcerpt(postData.excerpt || '')
      setMetaTitle(postData.metaTitle || '')
      setMetaDescription(postData.metaDescription || '')
      setMetaKeywords(postData.metaKeywords || '')
      setIsFeatured(postData.isFeatured || false)
    }
  }, [postData])

  // Xử lý khi blur khỏi input Title
  const handleTitleBlur = () => {
    if (!slug && title) {
      const generatedSlug = slugify(title)
      setSlug(generatedSlug)
    }
  }

  // Xử lý khi thay đổi Excerpt
  const handleExcerptChange = (value: string) => {
    setExcerpt(value)
    if (!metaDescription && value) {
      const generatedMetaDesc = generateMetaDescription(value, 160)
      setMetaDescription(generatedMetaDesc)
    }
  }

  // Fetch categories
  const { data: categoriesData } = useList({
    resource: 'post-categories',
    pagination: { mode: 'off' }
  })
  const categories = categoriesData?.data || []

  // Fetch tags
  const { data: tagsData } = useList({
    resource: 'post-tags',
    pagination: { mode: 'off' }
  })
  const tags = tagsData?.data || []

  // Handle form submit
  const handleSave = async () => {
    setContentError(false)
    setCategoryError(false)

    const errors: string[] = []

    if (!title || title.trim() === '') {
      errors.push('Tiêu đề không được để trống')
    }

    if (!content || content.trim() === '' || content === '<p></p>') {
      errors.push('Nội dung không được để trống')
      setContentError(true)
    }

    if (!categoryId) {
      errors.push('Vui lòng chọn chuyên mục')
      setCategoryError(true)
    }

    if (status === 'PUBLISHED' && !publishedAt) {
      errors.push('Vui lòng chọn ngày xuất bản')
    }

    if (errors.length > 0) {
      showMessage('error', errors.join('. '))
      return
    }

    const submitData = {
      title,
      slug,
      status,
      publishedAt,
      categoryId,
      tags: selectedTags,
      thumbnail,
      metaTitle,
      metaDescription,
      metaKeywords,
      isFeatured,
      excerpt,
      content
    }

    updatePost(
      {
        resource: 'posts',
        id: id as string,
        values: submitData,
      },
      {
        onSuccess: () => {
          showMessage('success', 'Cập nhật bài viết thành công!')
        },
        onError: (error: any) => {
          console.error('Update failed:', error)
          showMessage('error', 'Có lỗi xảy ra khi cập nhật bài viết')
        },
      }
    )
  }

  // AI Content Generation
  const handleGenerateAI = async () => {
    if (!AI_ENABLED) return
    if (!focusKeyword || focusKeyword.trim() === '') {
      showMessage('error', 'Vui lòng nhập từ khóa trọng tâm!')
      return
    }

    setIsGeneratingAI(true)

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api'
      const token = localStorage.getItem('token')

      const axiosInstance = axios.create({
        baseURL: API_URL,
        headers: { Authorization: `Bearer ${token}` }
      })

      const aiSettingsRes = await axiosInstance.get('/settings?group=ai')
      const aiSettings: any = {}
      aiSettingsRes.data.data?.forEach((s: any) => {
        aiSettings[s.key] = s.value
      })

      const aiProvider = aiSettings.ai_provider || 'gemini'
      const apiKey = aiProvider === 'gemini' ? aiSettings.gemini_api_key : aiSettings.chatgpt_api_key

      if (!apiKey) {
        showMessage('error', `Vui lòng cấu hình API Key cho ${aiProvider}!`)
        setIsGeneratingAI(false)
        return
      }

      const prompt = `
Viết bài blog chi tiết về chủ đề: ${focusKeyword}

Yêu cầu:
1. Tiêu đề hấp dẫn, chứa từ khóa
2. Tóm tắt ngắn gọn 2-3 câu
3. Nội dung chi tiết với H2, H3, danh sách, bao gồm từ khóa tự nhiên
4. Meta description 120-160 ký tự
5. 5-8 meta keywords liên quan

Trả về JSON:
{
  "title": "Tiêu đề bài viết",
  "excerpt": "Tóm tắt ngắn",
  "content": "<h2>...</h2><p>...</p>",
  "metaTitle": "Meta title SEO",
  "metaDescription": "Meta description",
  "metaKeywords": "keyword1, keyword2, keyword3"
}

Viết bằng tiếng Việt, chuyên nghiệp.
`

      let aiResponse: any
      if (aiProvider === 'gemini') {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 8000 }
          })
        })
        const data = await res.json()
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
        const match = text.match(/```json\s*([\s\S]*?)(?:```|$)/)
        aiResponse = JSON.parse(match ? match[1].trim() : text)
      } else {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7
          })
        })
        const data = await res.json()
        const text = data.choices?.[0]?.message?.content || ''
        const match = text.match(/```json\s*([\s\S]*?)(?:```|$)/)
        aiResponse = JSON.parse(match ? match[1].trim() : text)
      }

      if (aiResponse.title) setTitle(aiResponse.title)
      if (aiResponse.excerpt) setExcerpt(aiResponse.excerpt)
      if (aiResponse.content) setContent(aiResponse.content)
      if (aiResponse.metaTitle) setMetaTitle(aiResponse.metaTitle)
      if (aiResponse.metaDescription) setMetaDescription(aiResponse.metaDescription)
      if (aiResponse.metaKeywords) setMetaKeywords(aiResponse.metaKeywords)
      if (!slug && aiResponse.title) setSlug(slugify(aiResponse.title))

      showMessage('success', 'Đã tạo nội dung AI thành công!')
    } catch (error: any) {
      console.error('AI Error:', error)
      showMessage('error', `Lỗi: ${error.message}`)
    } finally {
      setIsGeneratingAI(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  // Main Content
  const mainContent = (
    <div className="space-y-4">
      {/* Toast Message */}
      {message && (
        <div
          className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-md shadow-lg max-w-md ${message.type === 'success' ? 'bg-success text-white' : 'bg-destructive text-white'
            }`}
        >
          {message.text}
        </div>
      )}

      {/* AI Content Generator */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Bot className="h-4 w-4 text-primary" />
              AI Content Generator
            </CardTitle>
            {AI_ENABLED ? (
              <Button
                type="button"
                onClick={handleGenerateAI}
                disabled={isGeneratingAI || !focusKeyword}
                size="sm"
              >
                {isGeneratingAI ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Zap className="h-4 w-4 mr-2" />
                )}
                Tạo nội dung AI
              </Button>
            ) : (
              <AIButton>Tạo nội dung AI</AIButton>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Từ khóa trọng tâm</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={focusKeyword}
                onChange={(e) => setFocusKeyword(e.target.value)}
                placeholder="Nhập từ khóa: hướng dẫn, mẹo, review..."
                className="pl-9 text-lg"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              AI sẽ tạo tiêu đề, nội dung, và SEO dựa trên từ khóa này
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Tiêu đề *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleBlur}
          placeholder="Nhập tiêu đề bài viết"
          className="text-xl font-semibold"
          maxLength={200}
        />
        <p className="text-xs text-muted-foreground">{title.length}/200 ký tự</p>
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <Label htmlFor="slug">Slug (URL)</Label>
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 text-sm" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-muted)' }}>
            URL:
          </span>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="slug-bai-viet"
            className="rounded-l-none"
          />
        </div>
        <p className="text-xs text-muted-foreground">Để trống để tự động tạo từ tiêu đề</p>
      </div>

      {/* Excerpt */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Tóm tắt</CardTitle>
        </CardHeader>
        <CardContent>
          <RichTextEditor
            value={excerpt}
            onChange={handleExcerptChange}
            placeholder="Viết tóm tắt ngắn gọn về bài viết..."
            height={150}
          />
        </CardContent>
      </Card>

      {/* Content */}
      <Card className={contentError ? 'border-destructive border-2' : ''}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            Nội dung <span className="text-destructive">*</span>
            {contentError && (
              <span className="text-destructive text-xs font-normal">
                - Vui lòng nhập nội dung
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RichTextEditor
            value={content}
            onChange={(value) => {
              setContent(value)
              if (contentError && value && value !== '<p></p>') {
                setContentError(false)
              }
            }}
            placeholder="Viết nội dung bài viết..."
            height={500}
          />
        </CardContent>
      </Card>

      {/* SEO Box */}
      <SEOBox
        metaTitle={metaTitle}
        metaDescription={metaDescription}
        metaKeywords={metaKeywords}
        slug={slug}
        title={title}
        excerpt={excerpt}
        content={content}
        onMetaTitleChange={setMetaTitle}
        onMetaDescriptionChange={setMetaDescription}
        onMetaKeywordsChange={setMetaKeywords}
      />
    </div>
  )

  // Sidebar
  const sidebar = (
    <>
      {/* Publish Box */}
      <PublishBox
        status={status}
        publishedAt={publishedAt}
        onStatusChange={(value) => setStatus(value as any)}
        onPublishedAtChange={(date) => setPublishedAt(date ? date.toISOString() : null)}
        onSave={handleSave}
        onPreview={() => {
          if (slug) {
            window.open(`/posts/${slug}`, '_blank')
          } else {
            showMessage('error', 'Chưa có slug để xem trước')
          }
        }}
        isSubmitting={isUpdating}
      />

      {/* Categories Box */}
      <div className={categoryError ? 'ring-2 ring-destructive rounded-lg' : ''}>
        <CategoriesBox
          categories={categories}
          selectedCategoryId={categoryId}
          onCategoryChange={(id) => {
            setCategoryId(id)
            if (categoryError && id) setCategoryError(false)
          }}
          onAddNew={() => showMessage('info', 'Mở modal thêm chuyên mục')}
        />
        {categoryError && (
          <p className="text-destructive text-xs px-4 pb-2">Vui lòng chọn chuyên mục</p>
        )}
      </div>

      {/* Tags Box */}
      <TagsBox
        availableTags={tags}
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        onAddNew={() => showMessage('info', 'Mở modal thêm tag')}
      />

      {/* Featured Image Box */}
      <FeaturedImageBox
        imageUrl={thumbnail}
        onImageChange={setThumbnail}
        onImageRemove={() => setThumbnail('')}
      />

      {/* Featured Toggle */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Nổi bật</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Checkbox
              id="isFeatured"
              checked={isFeatured}
              onCheckedChange={(checked) => setIsFeatured(!!checked)}
            />
            <Label htmlFor="isFeatured" className="cursor-pointer">
              Hiển thị bài viết ở vị trí nổi bật
            </Label>
          </div>
        </CardContent>
      </Card>
    </>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Chỉnh sửa bài viết
          </h1>
        </div>
      </div>

      <PostEditorLayout
        mainContent={mainContent}
        sidebar={sidebar}
      />
    </div>
  )
}
