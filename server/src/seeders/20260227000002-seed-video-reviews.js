'use strict'

const { v4: uuidv4 } = require('uuid')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date()

    // Lấy accommodation IDs có sẵn
    const [accs] = await queryInterface.sequelize.query(
      `SELECT accommodation_id, name FROM accommodations LIMIT 6`
    )

    await queryInterface.bulkInsert('video_reviews', [
      {
        video_id: uuidv4(),
        title: 'Review phòng trọ cao cấp Quận 1 — Full nội thất',
        slug: 'review-phong-tro-cao-cap-quan-1-full-noi-that',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=450&fit=crop',
        accommodation_id: accs.length > 0 ? accs[0].accommodation_id : null,
        province_code: '79',
        duration: '5:30',
        views: 12500,
        status: 'active',
        createdAt: new Date('2026-02-25'), updatedAt: now
      },
      {
        video_id: uuidv4(),
        title: 'Căn hộ mini Phú Nhuận — Ban công view cực đẹp',
        slug: 'can-ho-mini-phu-nhuan-ban-cong-view-cuc-dep',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=450&fit=crop',
        accommodation_id: accs.length > 1 ? accs[1].accommodation_id : null,
        province_code: '79',
        duration: '8:15',
        views: 8900,
        status: 'active',
        createdAt: new Date('2026-02-23'), updatedAt: now
      },
      {
        video_id: uuidv4(),
        title: 'Nhà nguyên căn 3 tầng Bình Thạnh — Tour khám phá',
        slug: 'nha-nguyen-can-3-tang-binh-thanh-tour-kham-pha',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=450&fit=crop',
        accommodation_id: accs.length > 2 ? accs[2].accommodation_id : null,
        province_code: '79',
        duration: '12:00',
        views: 15200,
        status: 'active',
        createdAt: new Date('2026-02-20'), updatedAt: now
      },
      {
        video_id: uuidv4(),
        title: 'KTX sinh viên Thủ Đức — Giá 1.2 triệu có gì?',
        slug: 'ktx-sinh-vien-thu-duc-gia-1-2-trieu-co-gi',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=450&fit=crop',
        accommodation_id: accs.length > 3 ? accs[3].accommodation_id : null,
        province_code: '79',
        duration: '6:45',
        views: 22100,
        status: 'active',
        createdAt: new Date('2026-02-17'), updatedAt: now
      },
      {
        video_id: uuidv4(),
        title: 'Studio Quận 7 — Sống gần Phú Mỹ Hưng cảm giác thế nào?',
        slug: 'studio-quan-7-song-gan-phu-my-hung-cam-giac-the-nao',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=450&fit=crop',
        accommodation_id: accs.length > 5 ? accs[5].accommodation_id : null,
        province_code: '79',
        duration: '10:20',
        views: 18700,
        status: 'active',
        createdAt: new Date('2026-02-14'), updatedAt: now
      },
      {
        video_id: uuidv4(),
        title: 'So sánh phòng trọ 3 triệu vs 5 triệu tại TP.HCM',
        slug: 'so-sanh-phong-tro-3-trieu-vs-5-trieu-tai-tphcm',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=450&fit=crop',
        accommodation_id: null,
        province_code: '79',
        duration: '15:30',
        views: 31500,
        status: 'active',
        createdAt: new Date('2026-02-10'), updatedAt: now
      },
    ])

    console.log('✅ Video reviews seeded: 6 records')
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('video_reviews', null, {})
  }
}
