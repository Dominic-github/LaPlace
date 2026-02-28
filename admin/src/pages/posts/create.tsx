import { useState } from 'react'
import { useForm, useCreate } from '@refinedev/core'
import { useList, useNavigation } from '@refinedev/core'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  PostEditorLayout,
  PublishBox,
  CategoriesBox,
  TagsBox,
  FeaturedImageBox,
  SEOBox,
  CreateCategoryModal,
  CreateTagModal,
  PreviewPostModal
} from '../../components/posts'
import { RichTextEditor } from '../../components/common/RichTextEditor'
import { slugify, generateMetaDescription } from '../../utils/slugify'
import { Bot, Zap, Search, FileText, Loader2 } from 'lucide-react'
import { AIButton } from '@/components/ui/ai-coming-soon'
import axios from 'axios'

// AI Feature Flag - Set to true when ready to enable
const AI_ENABLED = false

export const PostCreate = () => {
  const { push } = useNavigation()
  const { mutate: createPost, isLoading: isCreating } = useCreate()

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
  const [focusKeyword, setFocusKeyword] = useState<string>('')

  // Validation error states
  const [contentError, setContentError] = useState<boolean>(false)
  const [categoryError, setCategoryError] = useState<boolean>(false)
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false)

  // Modal states
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false)
  const [showTagModal, setShowTagModal] = useState<boolean>(false)
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false)

  // Toast message
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info' | 'warning'; text: string } | null>(null)

  const showMessage = (type: 'success' | 'error' | 'info' | 'warning', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  // Xử lý khi blur khỏi input Keyword
  const handleKeywordBlur = () => {
    if (!slug && focusKeyword) {
      const generatedSlug = slugify(focusKeyword)
      setSlug(generatedSlug)
    }
    if (!metaKeywords && focusKeyword) {
      setMetaKeywords(focusKeyword)
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

  // Tạo nội dung bằng AI (DISABLED)
  const handleGenerateAI = async () => {
    if (!AI_ENABLED) {
      showMessage('warning', '🚧 Tính năng AI đang được phát triển. Vui lòng thử lại sau!')
      return
    }

    if (!focusKeyword || focusKeyword.trim() === '') {
      showMessage('warning', 'Vui lòng nhập từ khóa chính trước!')
      return
    }

    setIsGeneratingAI(true)
    showMessage('info', 'Đang tạo nội dung bằng AI...')

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api'
      const token = localStorage.getItem('token')

      const axiosInstance = axios.create({
        baseURL: API_URL,
        headers: { Authorization: `Bearer ${token}` }
      })

      const [seoConfigRes, aiSettingsRes] = await Promise.all([
        axiosInstance.get('/settings/seo_config'),
        axiosInstance.get('/settings?group=ai')
      ])

      const seoConfigData = seoConfigRes.data.data || seoConfigRes.data
      const aiSettingsData = aiSettingsRes.data

      let seoConfig: any = {}
      try {
        seoConfig = JSON.parse(seoConfigData.value || '{}')
      } catch (e) {
        console.error('Failed to parse SEO config:', e)
      }

      const aiSettings: any = {}
      aiSettingsData.data?.forEach((setting: any) => {
        aiSettings[setting.key] = setting.value
      })

      const aiProvider = aiSettings.ai_provider || 'gemini'
      const apiKey = aiProvider === 'gemini' ? aiSettings.gemini_api_key : aiSettings.chatgpt_api_key

      if (!apiKey) {
        showMessage('error', `Vui lòng cấu hình API Key cho ${aiProvider} trong Cấu hình hệ thống!`)
        setIsGeneratingAI(false)
        return
      }

      const prompt = `
Bạn là một chuyên gia viết nội dung SEO. Hãy tạo một bài viết blog hoàn chỉnh với các yêu cầu sau:

**Thông tin bài viết:**
- Từ khóa chính: ${focusKeyword}

**Yêu cầu SEO:**
- Độ dài nội dung: Tối thiểu ${seoConfig.contentLength?.minWords || 250} từ
- Mật độ từ khóa: ${seoConfig.keywordDensity?.minPercent || 0.5}% - ${seoConfig.keywordDensity?.maxPercent || 3.5}%
- Cấu trúc heading: Có H2, H3 (không dùng H1)

**Yêu cầu nội dung:**
1. Viết bằng tiếng Việt
2. Nội dung phải chất lượng, hữu ích, dễ đọc
3. Cấu trúc rõ ràng với các heading H2, H3
4. Format HTML (chỉ trả về nội dung HTML, không cần thẻ <html>, <body>)

**Ngoài ra, hãy tạo thêm:**
- Tiêu đề bài viết (SEO-friendly, hấp dẫn)
- Meta Description (${seoConfig.metaDescription?.minLength || 70}-${seoConfig.metaDescription?.maxLength || 160} ký tự)
- Excerpt/Mô tả ngắn (100-150 ký tự)

Trả về JSON với format:
{
  "title": "Tiêu đề bài viết",
  "content": "HTML content của bài viết",
  "metaDescription": "Meta description",
  "excerpt": "Excerpt ngắn"
}
`

      let aiResponse: any
      if (aiProvider === 'gemini') {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`
        const geminiRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: parseFloat(aiSettings.ai_temperature || '0.7'),
              maxOutputTokens: parseInt(aiSettings.ai_max_tokens || '8000')
            }
          })
        })

        if (!geminiRes.ok) {
          throw new Error(`Gemini API error: ${geminiRes.status}`)
        }

        const geminiData = await geminiRes.json()
        const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || ''

        let jsonText = generatedText
        const jsonMatch = generatedText.match(/```json\s*([\s\S]*?)(?:```|$)/)
        if (jsonMatch) {
          jsonText = jsonMatch[1].trim()
        }

        try {
          aiResponse = JSON.parse(jsonText)
        } catch (parseError) {
          // Fallback regex extraction
          const titleMatch = jsonText.match(/"title"\s*:\s*"([^"]*(?:\\.[^"]*)*)"/)
          const contentMatch = jsonText.match(/"content"\s*:\s*"([\s\S]*?)"/)
          const excerptMatch = jsonText.match(/"excerpt"\s*:\s*"([^"]*(?:\\.[^"]*)*)"/)
          const metaDescMatch = jsonText.match(/"metaDescription"\s*:\s*"([^"]*(?:\\.[^"]*)*)"/)

          aiResponse = {
            title: titleMatch ? titleMatch[1].replace(/\\"/g, '"') : '',
            content: contentMatch ? contentMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"') : '',
            excerpt: excerptMatch ? excerptMatch[1].replace(/\\"/g, '"') : '',
            metaDescription: metaDescMatch ? metaDescMatch[1].replace(/\\"/g, '"') : ''
          }
        }
      } else {
        // ChatGPT
        const chatgptRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: 'You are a professional SEO content writer.' },
              { role: 'user', content: prompt }
            ],
            temperature: parseFloat(aiSettings.ai_temperature || '0.7'),
            max_tokens: parseInt(aiSettings.ai_max_tokens || '8000')
          })
        })

        if (!chatgptRes.ok) {
          throw new Error(`ChatGPT API error: ${chatgptRes.status}`)
        }

        const chatgptData = await chatgptRes.json()
        const generatedText = chatgptData.choices?.[0]?.message?.content || ''

        let jsonText = generatedText
        const jsonMatch = generatedText.match(/```json\s*([\s\S]*?)(?:```|$)/)
        if (jsonMatch) {
          jsonText = jsonMatch[1].trim()
        }

        aiResponse = JSON.parse(jsonText)
      }

      // Set generated content
      if (aiResponse.title) setTitle(aiResponse.title)
      if (aiResponse.content) setContent(aiResponse.content)
      if (aiResponse.excerpt) setExcerpt(aiResponse.excerpt)
      if (aiResponse.metaDescription) setMetaDescription(aiResponse.metaDescription)

      showMessage('success', 'Đã tạo nội dung thành công!')
    } catch (error: any) {
      console.error('AI Generation Error:', error)
      showMessage('error', `Lỗi khi tạo nội dung AI: ${error.message}`)
    } finally {
      setIsGeneratingAI(false)
    }
  }

  // Fetch categories
  const { data: categoriesData, refetch: refetchCategories } = useList({
    resource: 'post-categories',
    pagination: { mode: 'off' }
  })
  const categories = categoriesData?.data || []

  // Fetch tags
  const { data: tagsData, refetch: refetchTags } = useList({
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

    const generatedMetaTitle = title ? `${title} | Webest FastShop` : ''

    const submitData: any = {
      title,
      slug,
      status,
      publishedAt,
      categoryId,
      tags: selectedTags,
      metaTitle: metaTitle || generatedMetaTitle,
      metaDescription,
      metaKeywords,
      isFeatured,
      excerpt,
      content
    }

    if (thumbnail && thumbnail.trim() !== '') {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5002/api'
      const apiHost = apiUrl.replace(/\/api\/?$/, '')
      let finalThumb = thumbnail.trim()
      if (!/^https?:\/\//i.test(finalThumb)) {
        if (!finalThumb.startsWith('/')) finalThumb = '/' + finalThumb
        finalThumb = apiHost + finalThumb
      }
      submitData.thumbnail = finalThumb
    }

    // Remove empty optional fields
    const optionalStringFields = ['slug', 'excerpt', 'metaDescription', 'metaKeywords']
    optionalStringFields.forEach((f) => {
      if (submitData[f] !== undefined && (submitData[f] === null || String(submitData[f]).trim() === '')) {
        delete submitData[f]
      }
    })

    if (!submitData.publishedAt) {
      delete submitData.publishedAt
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api'
      const token = localStorage.getItem('token')
      const headers: any = { 'Content-Type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const res = await axios.post(`${API_URL}/posts`, submitData, { headers })
      if (res?.data?.success) {
        showMessage('success', 'Tạo bài viết thành công!')
        // Reset form
        setTitle('')
        setSlug('')
        setContent('')
        setExcerpt('')
        setThumbnail('')
        setSelectedTags([])
        setCategoryId('')
        // Navigate to list
        setTimeout(() => push('/posts'), 1000)
      } else {
        throw new Error(res?.data?.message || 'Unknown API error')
      }
    } catch (apiErr: any) {
      console.error('Save failed:', apiErr)
      if (apiErr?.response?.data?.errors) {
        const fieldErrors = apiErr.response.data.errors.map((e: any) => `${e.field}: ${e.message}`)
        showMessage('error', fieldErrors.join('. '))
      } else if (apiErr?.response?.data?.message) {
        showMessage('error', apiErr.response.data.message)
      } else {
        showMessage('error', 'Có lỗi khi lưu bài viết.')
      }
    }
  }

  // Main Content
  const mainContent = (
    <div className="space-y-4">
      {/* Toast Message */}
      {message && (
        <div
          className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-md shadow-lg max-w-md ${message.type === 'success' ? 'bg-success text-white' :
            message.type === 'error' ? 'bg-destructive text-white' :
              message.type === 'warning' ? 'bg-warning text-white' :
                'bg-primary text-white'
            }`}
        >
          {message.text}
        </div>
      )}

      {/* Từ khóa chính + Nút AI */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Bot className="h-4 w-4 text-primary" />
              Từ khóa & AI Content Generator
            </CardTitle>
            <div className="flex items-center gap-2">
              {AI_ENABLED ? (
                <Button
                  onClick={handleGenerateAI}
                  disabled={isGeneratingAI || !focusKeyword || focusKeyword.trim() === ''}
                  variant="default"
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
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Từ khóa chính (Focus Keyword)</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={focusKeyword}
                onChange={(e) => setFocusKeyword(e.target.value)}
                onBlur={handleKeywordBlur}
                placeholder="Ví dụ: hướng dẫn sử dụng nextjs"
                className="pl-9 text-lg"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Từ khóa này sẽ được dùng để tạo slug và tối ưu SEO
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
          placeholder="Nhập tiêu đề bài viết (sẽ là H1 khi hiển thị)"
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
        <p className="text-xs text-muted-foreground">Để trống để tự động tạo từ từ khóa</p>
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
        focusKeyword={focusKeyword}
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
        onPreview={() => setShowPreviewModal(true)}
        isSubmitting={isCreating}
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
          onAddNew={() => setShowCategoryModal(true)}
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
        onAddNew={() => setShowTagModal(true)}
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
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FileText className="h-8 w-8" />
              Tạo bài viết mới
            </h1>
          </div>
        </div>

        <PostEditorLayout
          mainContent={mainContent}
          sidebar={sidebar}
        />
      </div>

      {/* Create Category Modal */}
      <CreateCategoryModal
        visible={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSuccess={(newCategory) => {
          refetchCategories()
          setCategoryId(newCategory.id)
          showMessage('success', `Đã tạo chuyên mục "${newCategory.name}"`)
        }}
        categories={categories}
      />

      {/* Create Tag Modal */}
      <CreateTagModal
        visible={showTagModal}
        onClose={() => setShowTagModal(false)}
        onSuccess={(newTag) => {
          refetchTags()
          setSelectedTags([...selectedTags, newTag.id])
          showMessage('success', `Đã tạo tag "${newTag.name}"`)
        }}
      />

      {/* Preview Post Modal */}
      <PreviewPostModal
        visible={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        data={{
          title: title,
          content: content,
          excerpt: excerpt,
          featuredImage: thumbnail,
          categoryName: categories.find((c: any) => c.id === categoryId)?.name,
          tags: tags.filter((t: any) => selectedTags.includes(t.id)).map((t: any) => t.name),
          metaDescription: metaDescription,
          metaKeywords: metaKeywords,
          focusKeyword: focusKeyword
        }}
      />
    </>
  )
}
