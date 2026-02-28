import { slugify, makeUniqueSlug, isValidSlug, stripHtml, generateMetaDescription } from '../slugify';

describe('slugify', () => {
  it('should convert Vietnamese text to slug', () => {
    expect(slugify('Hướng dẫn sử dụng Next.js')).toBe('huong-dan-su-dung-nextjs');
    expect(slugify('Xin chào các bạn')).toBe('xin-chao-cac-ban');
    expect(slugify('Đây là tiêu đề')).toBe('day-la-tieu-de');
  });

  it('should handle uppercase Vietnamese characters', () => {
    expect(slugify('HƯỚNG DẪN SỬ DỤNG')).toBe('huong-dan-su-dung');
    expect(slugify('ĐÂY LÀ TIÊU ĐỀ')).toBe('day-la-tieu-de');
  });

  it('should remove special characters', () => {
    expect(slugify('Hello @World!')).toBe('hello-world');
    expect(slugify('Test #123 $456')).toBe('test-123-456');
    expect(slugify('Foo & Bar')).toBe('foo-bar');
  });

  it('should handle multiple spaces', () => {
    expect(slugify('Hello    World')).toBe('hello-world');
    expect(slugify('  Trim  Spaces  ')).toBe('trim-spaces');
  });

  it('should handle consecutive hyphens', () => {
    expect(slugify('Hello---World')).toBe('hello-world');
    expect(slugify('Test--123')).toBe('test-123');
  });

  it('should trim hyphens from start and end', () => {
    expect(slugify('-Hello-World-')).toBe('hello-world');
    expect(slugify('---Test---')).toBe('test');
  });

  it('should return empty string for empty input', () => {
    expect(slugify('')).toBe('');
    expect(slugify('   ')).toBe('');
  });

  it('should handle mixed Vietnamese and English', () => {
    expect(slugify('Học Next.js cơ bản')).toBe('hoc-nextjs-co-ban');
    expect(slugify('React và Vue.js')).toBe('react-va-vuejs');
  });

  it('should preserve numbers', () => {
    expect(slugify('Top 10 tips')).toBe('top-10-tips');
    expect(slugify('2024 trends')).toBe('2024-trends');
  });
});

describe('makeUniqueSlug', () => {
  it('should return base slug if not exists', () => {
    expect(makeUniqueSlug('hello-world', [])).toBe('hello-world');
    expect(makeUniqueSlug('test', ['other-slug'])).toBe('test');
  });

  it('should append number if slug exists', () => {
    expect(makeUniqueSlug('hello-world', ['hello-world'])).toBe('hello-world-1');
    expect(makeUniqueSlug('test', ['test', 'test-1'])).toBe('test-2');
  });

  it('should find next available number', () => {
    const existing = ['post', 'post-1', 'post-2', 'post-3'];
    expect(makeUniqueSlug('post', existing)).toBe('post-4');
  });

  it('should handle gaps in numbering', () => {
    const existing = ['post', 'post-1', 'post-3'];
    expect(makeUniqueSlug('post', existing)).toBe('post-2');
  });
});

describe('isValidSlug', () => {
  it('should validate correct slugs', () => {
    expect(isValidSlug('hello-world')).toBe(true);
    expect(isValidSlug('test-123')).toBe(true);
    expect(isValidSlug('abc')).toBe(true);
    expect(isValidSlug('a-b-c-d-e')).toBe(true);
  });

  it('should reject invalid slugs', () => {
    expect(isValidSlug('Hello-World')).toBe(false); // uppercase
    expect(isValidSlug('hello_world')).toBe(false); // underscore
    expect(isValidSlug('hello world')).toBe(false); // space
    expect(isValidSlug('hello--world')).toBe(false); // consecutive hyphens
    expect(isValidSlug('-hello')).toBe(false); // starts with hyphen
    expect(isValidSlug('hello-')).toBe(false); // ends with hyphen
    expect(isValidSlug('')).toBe(false); // empty
    expect(isValidSlug('hello@world')).toBe(false); // special char
  });

  it('should handle edge cases', () => {
    expect(isValidSlug('a')).toBe(true);
    expect(isValidSlug('1')).toBe(true);
    expect(isValidSlug('a1')).toBe(true);
    expect(isValidSlug('1a')).toBe(true);
  });
});

describe('stripHtml', () => {
  it('should remove HTML tags', () => {
    expect(stripHtml('<p>Hello World</p>')).toBe('Hello World');
    expect(stripHtml('<div>Test<br/>Line</div>')).toBe('Test Line');
    expect(stripHtml('<strong>Bold</strong> text')).toBe('Bold text');
  });

  it('should handle nested tags', () => {
    expect(stripHtml('<div><p>Hello <strong>World</strong></p></div>')).toBe('Hello World');
    expect(stripHtml('<ul><li>Item 1</li><li>Item 2</li></ul>')).toBe('Item 1 Item 2');
  });

  it('should decode HTML entities', () => {
    expect(stripHtml('Hello&nbsp;World')).toBe('Hello World');
    expect(stripHtml('&lt;div&gt;')).toBe('<div>');
    expect(stripHtml('&amp; &quot; &#39;')).toBe('& " \'');
  });

  it('should remove extra whitespace', () => {
    expect(stripHtml('<p>Hello    World</p>')).toBe('Hello World');
    expect(stripHtml('<div>  Test  </div>')).toBe('Test');
  });

  it('should return empty string for empty input', () => {
    expect(stripHtml('')).toBe('');
    expect(stripHtml('   ')).toBe('');
  });

  it('should handle text without HTML', () => {
    expect(stripHtml('Plain text')).toBe('Plain text');
    expect(stripHtml('No tags here')).toBe('No tags here');
  });
});

describe('generateMetaDescription', () => {
  it('should strip HTML and return text', () => {
    expect(generateMetaDescription('<p>Hello World</p>')).toBe('Hello World');
    expect(generateMetaDescription('<div>Test <strong>content</strong></div>')).toBe('Test content');
  });

  it('should truncate long text', () => {
    const longText = '<p>' + 'a'.repeat(200) + '</p>';
    const result = generateMetaDescription(longText, 50);
    expect(result.length).toBeLessThanOrEqual(54); // 50 + '...'
    expect(result.endsWith('...')).toBe(true);
  });

  it('should not truncate short text', () => {
    const shortText = '<p>Short text</p>';
    const result = generateMetaDescription(shortText, 100);
    expect(result).toBe('Short text');
    expect(result.endsWith('...')).toBe(false);
  });

  it('should truncate at word boundary', () => {
    const text = '<p>This is a very long sentence that needs to be truncated</p>';
    const result = generateMetaDescription(text, 30);
    expect(result.endsWith('...')).toBe(true);
    // Should not cut in the middle of a word
    expect(result).not.toContain('sentenc...');
  });

  it('should use default maxLength of 160', () => {
    const longText = '<p>' + 'a'.repeat(200) + '</p>';
    const result = generateMetaDescription(longText);
    expect(result.length).toBeLessThanOrEqual(164); // 160 + '...'
  });

  it('should return empty string for empty input', () => {
    expect(generateMetaDescription('')).toBe('');
    expect(generateMetaDescription('   ')).toBe('');
  });

  it('should handle complex HTML', () => {
    const html = `
      <div>
        <h1>Title</h1>
        <p>This is a <strong>paragraph</strong> with <em>formatting</em>.</p>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </div>
    `;
    const result = generateMetaDescription(html, 100);
    expect(result).toContain('Title');
    expect(result).toContain('paragraph');
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
  });
});

