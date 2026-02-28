import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  FileText,
  Tags,
  Eye,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { slugify } from '../../utils/slugify';

// Default SEO configuration
const DEFAULT_SEO_CONFIG = {
  metaTitle: {
    minLength: 30,
    maxLength: 60,
    optimalMin: 50,
    optimalMax: 60,
    weight: 30,
  },
  metaDescription: {
    minLength: 120,
    maxLength: 160,
    optimalMin: 140,
    optimalMax: 160,
    weight: 30,
  },
  metaKeywords: {
    minCount: 3,
    maxCount: 10,
    optimalMin: 5,
    optimalMax: 8,
    weight: 20,
  },
  slug: {
    minLength: 3,
    maxLength: 100,
    weight: 20,
  },
};

interface SEOBoxProps {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  slug?: string;
  title?: string;
  excerpt?: string;
  content?: string;
  focusKeyword?: string;
  onMetaTitleChange?: (value: string) => void;
  onMetaDescriptionChange?: (value: string) => void;
  onMetaKeywordsChange?: (value: string) => void;
  seoConfig?: typeof DEFAULT_SEO_CONFIG;
  siteName?: string;
  siteUrl?: string;
}

export const SEOBox: React.FC<SEOBoxProps> = ({
  metaTitle = '',
  metaDescription = '',
  metaKeywords = '',
  slug = '',
  title = '',
  excerpt = '',
  content = '',
  focusKeyword = '',
  onMetaTitleChange,
  onMetaDescriptionChange,
  onMetaKeywordsChange,
  seoConfig = DEFAULT_SEO_CONFIG,
  siteName = 'Webest FastShop',
  siteUrl = 'https://yoursite.com',
}) => {
  const [showCustomize, setShowCustomize] = useState(true);
  const [seoIssues, setSeoIssues] = useState<string[]>([]);

  // Auto-generate default values
  const defaultMetaTitle = useMemo(() => {
    if (!title) return '';
    const titleWithSite = `${title} | ${siteName}`;
    return titleWithSite.length <= seoConfig.metaTitle.maxLength
      ? titleWithSite
      : title.substring(0, seoConfig.metaTitle.maxLength - 3) + '...';
  }, [title, siteName, seoConfig.metaTitle.maxLength]);

  const defaultMetaDescription = useMemo(() => {
    if (excerpt) return excerpt.substring(0, seoConfig.metaDescription.maxLength);
    if (content) {
      const plainText = content.replace(/<[^>]*>/g, '').trim();
      return plainText.substring(0, seoConfig.metaDescription.maxLength);
    }
    return '';
  }, [excerpt, content, seoConfig.metaDescription.maxLength]);

  const defaultMetaKeywords = useMemo(() => {
    if (focusKeyword) return focusKeyword;
    if (!title) return '';
    const words = title.split(' ').filter(w => w.length > 3);
    return words.slice(0, 5).join(', ');
  }, [focusKeyword, title]);

  const displayMetaTitle = metaTitle || defaultMetaTitle;
  const displayMetaDescription = metaDescription || defaultMetaDescription;
  const displayMetaKeywords = metaKeywords || defaultMetaKeywords;

  // SEO Score calculation
  const calculateSEOScore = () => {
    let score = 0;
    const issues: string[] = [];

    // Meta Title scoring
    const titleLen = displayMetaTitle.length;
    if (titleLen >= seoConfig.metaTitle.optimalMin && titleLen <= seoConfig.metaTitle.optimalMax) {
      score += seoConfig.metaTitle.weight;
    } else if (titleLen >= seoConfig.metaTitle.minLength && titleLen <= seoConfig.metaTitle.maxLength) {
      score += seoConfig.metaTitle.weight * 0.7;
      issues.push(`Meta Title nên dài ${seoConfig.metaTitle.optimalMin}-${seoConfig.metaTitle.optimalMax} ký tự`);
    } else if (titleLen > 0) {
      score += seoConfig.metaTitle.weight * 0.3;
      if (titleLen < seoConfig.metaTitle.minLength) {
        issues.push(`Meta Title quá ngắn (tối thiểu ${seoConfig.metaTitle.minLength} ký tự)`);
      } else {
        issues.push(`Meta Title quá dài (tối đa ${seoConfig.metaTitle.maxLength} ký tự)`);
      }
    } else {
      issues.push('Chưa có Meta Title');
    }

    // Meta Description scoring
    const descLen = displayMetaDescription.length;
    if (descLen >= seoConfig.metaDescription.optimalMin && descLen <= seoConfig.metaDescription.optimalMax) {
      score += seoConfig.metaDescription.weight;
    } else if (descLen >= seoConfig.metaDescription.minLength && descLen <= seoConfig.metaDescription.maxLength) {
      score += seoConfig.metaDescription.weight * 0.7;
      issues.push(`Meta Description nên dài ${seoConfig.metaDescription.optimalMin}-${seoConfig.metaDescription.optimalMax} ký tự`);
    } else if (descLen > 0) {
      score += seoConfig.metaDescription.weight * 0.3;
      if (descLen < seoConfig.metaDescription.minLength) {
        issues.push(`Meta Description quá ngắn (tối thiểu ${seoConfig.metaDescription.minLength} ký tự)`);
      } else {
        issues.push(`Meta Description quá dài (tối đa ${seoConfig.metaDescription.maxLength} ký tự)`);
      }
    } else {
      issues.push('Chưa có Meta Description');
    }

    // Meta Keywords scoring
    const keywordsCount = displayMetaKeywords ? displayMetaKeywords.split(',').filter(k => k.trim()).length : 0;
    if (keywordsCount >= seoConfig.metaKeywords.optimalMin && keywordsCount <= seoConfig.metaKeywords.optimalMax) {
      score += seoConfig.metaKeywords.weight;
    } else if (keywordsCount >= seoConfig.metaKeywords.minCount && keywordsCount <= seoConfig.metaKeywords.maxCount) {
      score += seoConfig.metaKeywords.weight * 0.7;
      issues.push(`Nên có ${seoConfig.metaKeywords.optimalMin}-${seoConfig.metaKeywords.optimalMax} keywords`);
    } else if (keywordsCount > 0) {
      score += seoConfig.metaKeywords.weight * 0.3;
    } else {
      issues.push('Chưa có Meta Keywords');
    }

    // Slug scoring
    const slugLen = slug.length;
    if (slugLen >= seoConfig.slug.minLength && slugLen <= seoConfig.slug.maxLength) {
      score += seoConfig.slug.weight;
    } else if (slugLen > 0) {
      score += seoConfig.slug.weight * 0.5;
    } else {
      issues.push('Chưa có Slug');
    }

    // Focus keyword checks
    if (focusKeyword && title) {
      const titleLower = title.toLowerCase();
      const keywordLower = focusKeyword.toLowerCase();
      if (titleLower.includes(keywordLower)) {
        issues.push('✅ Từ khóa chính xuất hiện trong Title');
      } else {
        issues.push('⚠️ Từ khóa chính chưa xuất hiện trong Title');
      }
    }

    if (focusKeyword && slug) {
      const slugLower = slug.toLowerCase();
      const keywordSlug = slugify(focusKeyword);
      if (slugLower.includes(keywordSlug)) {
        issues.push('✅ Từ khóa chính xuất hiện trong Slug');
      } else {
        issues.push('⚠️ Từ khóa chính chưa xuất hiện trong Slug');
      }
    }

    return { score: Math.round(score), issues };
  };

  const { score: seoScore, issues } = useMemo(() => calculateSEOScore(), [
    displayMetaTitle,
    displayMetaDescription,
    displayMetaKeywords,
    slug,
    seoConfig,
    focusKeyword,
    title,
  ]);

  useEffect(() => {
    setSeoIssues(issues);
  }, [issues]);

  const getScoreColor = () => {
    if (seoScore >= 80) return 'text-success';
    if (seoScore >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreStatus = () => {
    if (seoScore >= 80) return 'Xuất sắc';
    if (seoScore >= 60) return 'Tốt';
    if (seoScore >= 40) return 'Trung bình';
    return 'Cần cải thiện';
  };

  const getScoreIcon = () => {
    if (seoScore >= 80) return <CheckCircle className="h-4 w-4 text-success" />;
    if (seoScore >= 60) return <CheckCircle className="h-4 w-4 text-warning" />;
    if (seoScore >= 40) return <AlertTriangle className="h-4 w-4 text-warning" />;
    return <XCircle className="h-4 w-4 text-destructive" />;
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Search className="h-4 w-4" />
          SEO
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* SEO Score */}
        <div>
          <div className="flex justify-between items-center mb-2 text-sm">
            <span>Điểm SEO:</span>
            <div className="flex items-center gap-2">
              {getScoreIcon()}
              <span className={`font-semibold ${getScoreColor()}`}>
                {seoScore}/100 - {getScoreStatus()}
              </span>
            </div>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${seoScore >= 80 ? 'bg-success' : seoScore >= 60 ? 'bg-warning' : 'bg-destructive'
                }`}
              style={{ width: `${seoScore}%` }}
            />
          </div>
        </div>

        {/* SEO Issues */}
        {seoIssues.length > 0 && (
          <div
            className={`p-3 rounded-lg text-sm ${seoScore >= 60 ? 'bg-primary/10' : 'bg-warning/10'
              }`}
          >
            <p className="font-medium mb-2">Gợi ý cải thiện SEO:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              {seoIssues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Google Preview */}
        <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-muted)' }}>
          <p className="text-xs text-muted-foreground mb-2">Xem trước trên Google:</p>
          <div className="text-blue-600 text-base font-medium truncate">
            {displayMetaTitle || 'Tiêu đề bài viết của bạn'}
            {!metaTitle && displayMetaTitle && (
              <Badge variant="secondary" className="ml-2 text-xs">Mặc định</Badge>
            )}
          </div>
          <div className="text-green-700 text-sm truncate">
            {siteUrl}/{slug || 'bai-viet'}
          </div>
          <div className="text-sm text-muted-foreground line-clamp-2">
            {displayMetaDescription || 'Mô tả bài viết sẽ hiển thị ở đây...'}
            {!metaDescription && displayMetaDescription && (
              <Badge variant="secondary" className="ml-2 text-xs">Mặc định</Badge>
            )}
          </div>
        </div>

        {/* Customize SEO */}
        <div>
          <button
            onClick={() => setShowCustomize(!showCustomize)}
            className="flex items-center gap-2 text-sm font-medium w-full py-2"
          >
            {showCustomize ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            Tùy chỉnh SEO
          </button>

          {showCustomize && (
            <div className="space-y-4 pt-2">
              {/* Meta Title */}
              <div className="space-y-2">
                <Label className="flex items-center gap-1 text-sm">
                  <FileText className="h-3 w-3" />
                  Meta Title:
                </Label>
                <Input
                  value={metaTitle}
                  onChange={(e) => onMetaTitleChange?.(e.target.value)}
                  placeholder={defaultMetaTitle || `Tiêu đề SEO (${seoConfig.metaTitle.minLength}-${seoConfig.metaTitle.maxLength} ký tự)`}
                  maxLength={seoConfig.metaTitle.maxLength}
                />
                <p className="text-xs text-muted-foreground">
                  {metaTitle ? (
                    `${metaTitle.length}/${seoConfig.metaTitle.maxLength} ký tự`
                  ) : (
                    <span className="text-primary">Để trống để sử dụng giá trị mặc định</span>
                  )}
                </p>
              </div>

              {/* Meta Description */}
              <div className="space-y-2">
                <Label className="flex items-center gap-1 text-sm">
                  <Eye className="h-3 w-3" />
                  Meta Description:
                </Label>
                <Textarea
                  value={metaDescription}
                  onChange={(e) => onMetaDescriptionChange?.(e.target.value)}
                  placeholder={defaultMetaDescription || `Mô tả SEO (${seoConfig.metaDescription.minLength}-${seoConfig.metaDescription.maxLength} ký tự)`}
                  rows={3}
                  maxLength={seoConfig.metaDescription.maxLength}
                />
                <p className="text-xs text-muted-foreground">
                  {metaDescription ? (
                    `${metaDescription.length}/${seoConfig.metaDescription.maxLength} ký tự`
                  ) : (
                    <span className="text-primary">Để trống để sử dụng giá trị mặc định</span>
                  )}
                </p>
              </div>

              {/* Meta Keywords */}
              <div className="space-y-2">
                <Label className="flex items-center gap-1 text-sm">
                  <Tags className="h-3 w-3" />
                  Meta Keywords:
                </Label>
                <Input
                  value={metaKeywords}
                  onChange={(e) => onMetaKeywordsChange?.(e.target.value)}
                  placeholder={defaultMetaKeywords || "keyword1, keyword2, keyword3"}
                />
                <p className="text-xs text-muted-foreground">
                  {metaKeywords ? (
                    `${metaKeywords.split(',').filter(k => k.trim()).length} keywords (khuyến nghị: ${seoConfig.metaKeywords.optimalMin}-${seoConfig.metaKeywords.optimalMax})`
                  ) : (
                    <span className="text-primary">Để trống để sử dụng giá trị mặc định</span>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
