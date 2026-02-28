/**
 * Chuyển đổi chuỗi tiếng Việt thành slug URL-friendly
 * @param text - Chuỗi cần chuyển đổi
 * @returns Slug đã được chuẩn hóa
 * 
 * @example
 * slugify("Hướng dẫn sử dụng Next.js") // "huong-dan-su-dung-nextjs"
 * slugify("Xin chào các bạn!") // "xin-chao-cac-ban"
 */
export const slugify = (text: string): string => {
  if (!text) return '';
  
  // Bảng chuyển đổi ký tự tiếng Việt sang không dấu
  const vietnameseMap: { [key: string]: string } = {
    // Chữ thường
    'à': 'a', 'á': 'a', 'ạ': 'a', 'ả': 'a', 'ã': 'a',
    'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a', 'ẫ': 'a',
    'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',
    'è': 'e', 'é': 'e', 'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e',
    'ê': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
    'ì': 'i', 'í': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
    'ò': 'o', 'ó': 'o', 'ọ': 'o', 'ỏ': 'o', 'õ': 'o',
    'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o',
    'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',
    'ù': 'u', 'ú': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u',
    'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u',
    'ỳ': 'y', 'ý': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',
    'đ': 'd',
    
    // Chữ hoa
    'À': 'A', 'Á': 'A', 'Ạ': 'A', 'Ả': 'A', 'Ã': 'A',
    'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ậ': 'A', 'Ẩ': 'A', 'Ẫ': 'A',
    'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ặ': 'A', 'Ẳ': 'A', 'Ẵ': 'A',
    'È': 'E', 'É': 'E', 'Ẹ': 'E', 'Ẻ': 'E', 'Ẽ': 'E',
    'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ệ': 'E', 'Ể': 'E', 'Ễ': 'E',
    'Ì': 'I', 'Í': 'I', 'Ị': 'I', 'Ỉ': 'I', 'Ĩ': 'I',
    'Ò': 'O', 'Ó': 'O', 'Ọ': 'O', 'Ỏ': 'O', 'Õ': 'O',
    'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ộ': 'O', 'Ổ': 'O', 'Ỗ': 'O',
    'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ợ': 'O', 'Ở': 'O', 'Ỡ': 'O',
    'Ù': 'U', 'Ú': 'U', 'Ụ': 'U', 'Ủ': 'U', 'Ũ': 'U',
    'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ự': 'U', 'Ử': 'U', 'Ữ': 'U',
    'Ỳ': 'Y', 'Ý': 'Y', 'Ỵ': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y',
    'Đ': 'D'
  };

  // Bước 1: Chuyển đổi ký tự tiếng Việt sang không dấu
  let slug = text.split('').map(char => vietnameseMap[char] || char).join('');
  
  // Bước 2: Chuyển thành chữ thường
  slug = slug.toLowerCase();
  
  // Bước 3: Xóa các ký tự đặc biệt, chỉ giữ chữ cái, số, khoảng trắng và dấu gạch ngang
  slug = slug.replace(/[^a-z0-9\s-]/g, '');
  
  // Bước 4: Thay khoảng trắng bằng dấu gạch ngang
  slug = slug.replace(/\s+/g, '-');
  
  // Bước 5: Xóa các dấu gạch ngang liên tiếp
  slug = slug.replace(/-+/g, '-');
  
  // Bước 6: Xóa dấu gạch ngang ở đầu và cuối
  slug = slug.replace(/^-+|-+$/g, '');
  
  return slug;
};

/**
 * Tạo slug unique bằng cách thêm số vào cuối nếu slug đã tồn tại
 * @param baseSlug - Slug gốc
 * @param existingSlugs - Mảng các slug đã tồn tại
 * @returns Slug unique
 * 
 * @example
 * makeUniqueSlug("hello-world", ["hello-world"]) // "hello-world-1"
 * makeUniqueSlug("hello-world", ["hello-world", "hello-world-1"]) // "hello-world-2"
 */
export const makeUniqueSlug = (baseSlug: string, existingSlugs: string[]): string => {
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }

  let counter = 1;
  let uniqueSlug = `${baseSlug}-${counter}`;

  while (existingSlugs.includes(uniqueSlug)) {
    counter++;
    uniqueSlug = `${baseSlug}-${counter}`;
  }

  return uniqueSlug;
};

/**
 * Validate slug format
 * @param slug - Slug cần validate
 * @returns true nếu slug hợp lệ
 *
 * @example
 * isValidSlug("hello-world") // true
 * isValidSlug("Hello World") // false
 * isValidSlug("hello_world") // false
 */
export const isValidSlug = (slug: string): boolean => {
  if (!slug) return false;

  // Slug chỉ được chứa chữ thường, số và dấu gạch ngang
  // Không được bắt đầu hoặc kết thúc bằng dấu gạch ngang
  // Không được có dấu gạch ngang liên tiếp
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  return slugPattern.test(slug);
};

/**
 * Xóa tất cả thẻ HTML khỏi chuỗi
 * @param html - Chuỗi HTML cần xóa thẻ
 * @returns Chuỗi text thuần không có thẻ HTML
 *
 * @example
 * stripHtml("<p>Hello <strong>World</strong></p>") // "Hello World"
 * stripHtml("<div>Test<br/>Line</div>") // "Test Line"
 */
export const stripHtml = (html: string): string => {
  if (!html) return '';

  // Xóa tất cả thẻ HTML
  let text = html.replace(/<[^>]*>/g, ' ');

  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");

  // Xóa khoảng trắng thừa
  text = text.replace(/\s+/g, ' ').trim();

  return text;
};

/**
 * Tạo meta description từ HTML content
 * Xóa thẻ HTML và cắt ngắn về độ dài phù hợp
 * @param html - Chuỗi HTML
 * @param maxLength - Độ dài tối đa (mặc định 160)
 * @returns Meta description đã được xử lý
 *
 * @example
 * generateMetaDescription("<p>This is a long text...</p>", 50)
 * // => "This is a long text..."
 */
export const generateMetaDescription = (html: string, maxLength: number = 160): string => {
  if (!html) return '';

  // Xóa thẻ HTML
  const text = stripHtml(html);

  // Nếu text ngắn hơn maxLength, trả về nguyên
  if (text.length <= maxLength) {
    return text;
  }

  // Cắt ngắn và thêm dấu ...
  // Tìm khoảng trắng gần nhất để không cắt giữa từ
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + '...';
  }

  return truncated + '...';
};

