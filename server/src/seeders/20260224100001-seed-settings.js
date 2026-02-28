'use strict'

const { v4: uuidv4 } = require('uuid')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date()

    const settings = [
      // ===== GENERAL =====
      {
        setting_id: uuidv4(),
        key: 'site_name',
        value: 'LaPlace',
        label: 'Tên website',
        description: 'Tên hiển thị của website',
        type: 'text',
        group: 'general',
        createdAt: now,
        updatedAt: now
      },
      {
        setting_id: uuidv4(),
        key: 'site_url',
        value: 'https://laplace.vn',
        label: 'Đường dẫn website',
        description: 'URL chính của website (VD: https://laplace.vn)',
        type: 'text',
        group: 'general',
        createdAt: now,
        updatedAt: now
      },
      {
        setting_id: uuidv4(),
        key: 'site_logo',
        value: '',
        label: 'Logo website',
        description: 'Logo hiển thị trên header',
        type: 'image',
        group: 'general',
        createdAt: now,
        updatedAt: now
      },
      {
        setting_id: uuidv4(),
        key: 'site_favicon',
        value: '',
        label: 'Favicon',
        description: 'Icon hiển thị trên tab trình duyệt',
        type: 'image',
        group: 'general',
        createdAt: now,
        updatedAt: now
      },
      {
        setting_id: uuidv4(),
        key: 'site_description',
        value: 'Tìm phòng trọ, căn hộ, nhà nguyên căn cho thuê. Đặt phòng online, hợp đồng điện tử.',
        label: 'Mô tả website',
        description: 'Mô tả ngắn về website',
        type: 'textarea',
        group: 'general',
        createdAt: now,
        updatedAt: now
      },
      {
        setting_id: uuidv4(),
        key: 'timezone',
        value: 'Asia/Ho_Chi_Minh',
        label: 'Múi giờ',
        description: 'Múi giờ mặc định của hệ thống',
        type: 'select',
        group: 'general',
        createdAt: now,
        updatedAt: now
      },
      {
        setting_id: uuidv4(),
        key: 'language',
        value: 'vi',
        label: 'Ngôn ngữ',
        description: 'Ngôn ngữ mặc định',
        type: 'select',
        group: 'general',
        createdAt: now,
        updatedAt: now
      },
      {
        setting_id: uuidv4(),
        key: 'phone',
        value: '0901234567',
        label: 'Số điện thoại',
        description: 'Số điện thoại liên hệ',
        type: 'text',
        group: 'general',
        createdAt: now,
        updatedAt: now
      },
      {
        setting_id: uuidv4(),
        key: 'email',
        value: 'contact@laplace.vn',
        label: 'Email liên hệ',
        description: 'Email liên hệ chính',
        type: 'text',
        group: 'general',
        createdAt: now,
        updatedAt: now
      },
      {
        setting_id: uuidv4(),
        key: 'address',
        value: 'TP. Hồ Chí Minh, Việt Nam',
        label: 'Địa chỉ',
        description: 'Địa chỉ công ty',
        type: 'text',
        group: 'general',
        createdAt: now,
        updatedAt: now
      },

      // ===== LISTING =====
      {
        setting_id: uuidv4(),
        key: 'listing_max_images',
        value: '10',
        label: 'Số ảnh tối đa',
        description: 'Số lượng ảnh tối đa cho mỗi tin đăng',
        type: 'number',
        group: 'listing',
        createdAt: now,
        updatedAt: now
      },
      {
        setting_id: uuidv4(),
        key: 'listing_auto_approve',
        value: 'false',
        label: 'Tự động duyệt tin',
        description: 'Bật/tắt tự động duyệt tin đăng mới',
        type: 'boolean',
        group: 'listing',
        createdAt: now,
        updatedAt: now
      },
      {
        setting_id: uuidv4(),
        key: 'listing_expiry_days',
        value: '30',
        label: 'Thời hạn tin đăng (ngày)',
        description: 'Số ngày hiển thị tin trước khi hết hạn',
        type: 'number',
        group: 'listing',
        createdAt: now,
        updatedAt: now
      },

      // ===== PAYMENT =====
      {
        setting_id: uuidv4(),
        key: 'payment_bank_name',
        value: '',
        label: 'Tên ngân hàng',
        description: 'Ngân hàng nhận thanh toán',
        type: 'text',
        group: 'payment',
        createdAt: now,
        updatedAt: now
      },
      {
        setting_id: uuidv4(),
        key: 'payment_bank_account',
        value: '',
        label: 'Số tài khoản',
        description: 'Số tài khoản ngân hàng',
        type: 'text',
        group: 'payment',
        createdAt: now,
        updatedAt: now
      },
      {
        setting_id: uuidv4(),
        key: 'payment_bank_owner',
        value: '',
        label: 'Chủ tài khoản',
        description: 'Tên chủ tài khoản ngân hàng',
        type: 'text',
        group: 'payment',
        createdAt: now,
        updatedAt: now
      },

      // ===== SEO =====
      {
        setting_id: uuidv4(),
        key: 'seo_title',
        value: 'LaPlace - Tìm phòng trọ, nhà thuê dễ dàng',
        label: 'SEO Title',
        description: 'Title tag mặc định (tối đa 60 ký tự)',
        type: 'text',
        group: 'seo',
        createdAt: now,
        updatedAt: now
      },
      {
        setting_id: uuidv4(),
        key: 'seo_description',
        value: 'Tìm phòng trọ, căn hộ, nhà nguyên căn cho thuê. Đặt phòng online, hợp đồng điện tử, thanh toán an toàn.',
        label: 'SEO Description',
        description: 'Meta description mặc định (tối đa 160 ký tự)',
        type: 'textarea',
        group: 'seo',
        createdAt: now,
        updatedAt: now
      },
      {
        setting_id: uuidv4(),
        key: 'seo_og_image',
        value: '',
        label: 'OG Image',
        description: 'Ảnh mặc định khi share lên mạng xã hội',
        type: 'image',
        group: 'seo',
        createdAt: now,
        updatedAt: now
      },
      {
        setting_id: uuidv4(),
        key: 'google_analytics_id',
        value: '',
        label: 'Google Analytics ID',
        description: 'ID Google Analytics (VD: G-XXXXXXXXXX)',
        type: 'text',
        group: 'seo',
        createdAt: now,
        updatedAt: now
      },

      // ===== SOCIAL =====
      {
        setting_id: uuidv4(),
        key: 'social_facebook',
        value: '',
        label: 'Facebook',
        description: 'Link trang Facebook',
        type: 'text',
        group: 'social',
        createdAt: now,
        updatedAt: now
      },
      {
        setting_id: uuidv4(),
        key: 'social_youtube',
        value: '',
        label: 'YouTube',
        description: 'Link kênh YouTube',
        type: 'text',
        group: 'social',
        createdAt: now,
        updatedAt: now
      },
      {
        setting_id: uuidv4(),
        key: 'social_zalo',
        value: '',
        label: 'Zalo',
        description: 'Link hoặc số Zalo',
        type: 'text',
        group: 'social',
        createdAt: now,
        updatedAt: now
      },
      {
        setting_id: uuidv4(),
        key: 'social_tiktok',
        value: '',
        label: 'TikTok',
        description: 'Link trang TikTok',
        type: 'text',
        group: 'social',
        createdAt: now,
        updatedAt: now
      },

      // ===== EMAIL =====
      {
        setting_id: uuidv4(),
        key: 'email_from_name',
        value: 'LaPlace',
        label: 'Tên người gửi',
        description: 'Tên hiển thị khi gửi email',
        type: 'text',
        group: 'email',
        createdAt: now,
        updatedAt: now
      },
      {
        setting_id: uuidv4(),
        key: 'email_from_address',
        value: 'noreply@laplace.vn',
        label: 'Email gửi',
        description: 'Địa chỉ email gửi đi',
        type: 'text',
        group: 'email',
        createdAt: now,
        updatedAt: now
      },
    ]

    await queryInterface.bulkInsert('settings', settings, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('settings', null, {})
  }
}
