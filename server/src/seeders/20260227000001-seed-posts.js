'use strict'

const { v4: uuidv4 } = require('uuid')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date()

    // ========================================
    // POST CATEGORIES (4 categories)
    // ========================================
    const CAT = {
      kinhnghiem: uuidv4(),
      phongthuy: uuidv4(),
      phapluat: uuidv4(),
      tinthitruong: uuidv4(),
    }

    await queryInterface.bulkInsert('post_categories', [
      { category_id: CAT.kinhnghiem, name: 'Kinh nghiệm', slug: 'kinh-nghiem', description: 'Mẹo hay, kinh nghiệm thuê trọ cho người thuê và chủ trọ', createdAt: now, updatedAt: now },
      { category_id: CAT.phongthuy, name: 'Phong thủy', slug: 'phong-thuy', description: 'Phong thủy nhà ở, phòng trọ, bố trí nội thất hợp mệnh', createdAt: now, updatedAt: now },
      { category_id: CAT.phapluat, name: 'Pháp luật', slug: 'phap-luat', description: 'Quy định pháp luật về thuê nhà, hợp đồng, quyền lợi', createdAt: now, updatedAt: now },
      { category_id: CAT.tinthitruong, name: 'Tin thị trường', slug: 'tin-thi-truong', description: 'Cập nhật xu hướng giá cả, thị trường cho thuê bất động sản', createdAt: now, updatedAt: now },
    ])

    // ========================================
    // POSTS (9 bài viết)
    // ========================================
    // Lấy admin user
    const [users] = await queryInterface.sequelize.query(
      `SELECT user_id FROM users WHERE email = 'admin@laplace.com' LIMIT 1`
    )
    const adminId = users.length > 0 ? users[0].user_id : null

    await queryInterface.bulkInsert('posts', [
      {
        post_id: uuidv4(),
        title: '10 điều cần kiểm tra kỹ trước khi ký hợp đồng thuê phòng trọ',
        slug: '10-dieu-can-kiem-tra-ky-truoc-khi-ky-hop-dong-thue-phong-tro',
        excerpt: 'Trước khi đặt bút ký hợp đồng, hãy chắc chắn bạn đã kiểm tra kỹ 10 điều quan trọng này để tránh những rắc rối không đáng có.',
        content: '<h2>1. Kiểm tra giấy tờ chủ nhà</h2><p>Yêu cầu chủ nhà xuất trình giấy chứng nhận quyền sở hữu hoặc hợp đồng thuê gốc.</p><h2>2. Kiểm tra tình trạng phòng</h2><p>Chụp ảnh toàn bộ phòng trước khi dọn vào, ghi chú các hỏng hóc có sẵn.</p><h2>3. Đọc kỹ điều khoản hợp đồng</h2><p>Chú ý các điều khoản về tiền cọc, thời hạn báo trước, quy định sinh hoạt.</p><h2>4. Kiểm tra hệ thống điện nước</h2><p>Mở tất cả vòi nước, bật điện kiểm tra ổ cắm, công tắc.</p><h2>5. Hỏi rõ về chi phí phát sinh</h2><p>Giá điện, nước, internet, phí gửi xe, phí vệ sinh cần được ghi rõ trong hợp đồng.</p>',
        category_id: CAT.kinhnghiem,
        author_id: adminId,
        featured_image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop',
        views: 1520,
        read_time: '5 phút đọc',
        is_featured: true,
        status: 'published',
        createdAt: new Date('2026-02-24'), updatedAt: now
      },
      {
        post_id: uuidv4(),
        title: 'Xu hướng giá thuê phòng trọ TP.HCM năm 2026 — Những điều bạn cần biết',
        slug: 'xu-huong-gia-thue-phong-tro-tphcm-nam-2026',
        excerpt: 'Phân tích chi tiết xu hướng giá thuê trọ tại các quận trung tâm và ngoại thành TP.HCM trong năm 2026.',
        content: '<h2>Tổng quan thị trường</h2><p>Năm 2026 chứng kiến sự ổn định giá thuê tại các quận trung tâm, trong khi giá tại các khu vực ngoại thành có xu hướng tăng nhẹ 5-10%.</p><h2>Quận 1, 3, 5 — Ổn định</h2><p>Giá thuê phòng trọ trung bình 3.5 - 5 triệu/tháng, căn hộ mini 6 - 10 triệu.</p><h2>Thủ Đức, Bình Thạnh — Tăng nhẹ</h2><p>Do hạ tầng metro hoàn thiện, giá tăng 8-12% so với năm trước.</p>',
        category_id: CAT.tinthitruong,
        author_id: adminId,
        featured_image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=500&fit=crop',
        views: 2340,
        read_time: '8 phút đọc',
        is_featured: true,
        status: 'published',
        createdAt: new Date('2026-02-22'), updatedAt: now
      },
      {
        post_id: uuidv4(),
        title: 'Phong thủy phòng trọ: 7 mẹo bố trí để tài lộc hanh thông',
        slug: 'phong-thuy-phong-tro-7-meo-bo-tri-de-tai-loc-hanh-thong',
        excerpt: 'Dù không gian nhỏ hẹp, bạn vẫn có thể áp dụng những nguyên tắc phong thủy đơn giản để mang lại vận may.',
        content: '<h2>1. Giữ cửa chính sạch sẽ</h2><p>Cửa chính là nơi đón khí vào phòng, luôn giữ sạch sẽ, thông thoáng.</p><h2>2. Không để gương đối diện giường</h2><p>Gương phản chiếu năng lượng, ảnh hưởng giấc ngủ.</p><h2>3. Đặt cây xanh nhỏ</h2><p>Cây xanh giúp lọc không khí và mang lại sinh khí cho phòng.</p>',
        category_id: CAT.phongthuy,
        author_id: adminId,
        featured_image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=500&fit=crop',
        views: 980,
        read_time: '6 phút đọc',
        is_featured: false,
        status: 'published',
        createdAt: new Date('2026-02-20'), updatedAt: now
      },
      {
        post_id: uuidv4(),
        title: 'Quyền và nghĩa vụ của người thuê trọ theo pháp luật Việt Nam 2026',
        slug: 'quyen-va-nghia-vu-cua-nguoi-thue-tro-theo-phap-luat-viet-nam-2026',
        excerpt: 'Tổng hợp đầy đủ quyền lợi và nghĩa vụ pháp lý mà mọi người thuê trọ cần nắm rõ để bảo vệ bản thân.',
        content: '<h2>Quyền của người thuê</h2><p>Được sử dụng phòng đúng mục đích, được bảo vệ quyền riêng tư, được trả lại tiền cọc khi hết hạn hợp đồng.</p><h2>Nghĩa vụ của người thuê</h2><p>Thanh toán tiền thuê đúng hạn, giữ gìn tài sản, tuân thủ nội quy.</p>',
        category_id: CAT.phapluat,
        author_id: adminId,
        featured_image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=500&fit=crop',
        views: 3120,
        read_time: '10 phút đọc',
        is_featured: false,
        status: 'published',
        createdAt: new Date('2026-02-18'), updatedAt: now
      },
      {
        post_id: uuidv4(),
        title: 'Bí quyết tiết kiệm chi phí khi thuê phòng trọ cho sinh viên',
        slug: 'bi-quyet-tiet-kiem-chi-phi-khi-thue-phong-tro-cho-sinh-vien',
        excerpt: 'Sinh viên với ngân sách hạn hẹp có thể áp dụng những mẹo sau để giảm đáng kể chi phí thuê trọ hàng tháng.',
        content: '<h2>1. Ở ghép</h2><p>Chia sẻ phòng với bạn bè để giảm 30-50% chi phí.</p><h2>2. Chọn khu vực ngoại thành</h2><p>Giá rẻ hơn 20-40% so với trung tâm nhưng vẫn tiện đi học.</p><h2>3. Nấu ăn tại nhà</h2><p>Tiết kiệm 1-2 triệu/tháng so với ăn ngoài.</p>',
        category_id: CAT.kinhnghiem,
        author_id: adminId,
        featured_image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=500&fit=crop',
        views: 1870,
        read_time: '4 phút đọc',
        is_featured: false,
        status: 'published',
        createdAt: new Date('2026-02-15'), updatedAt: now
      },
      {
        post_id: uuidv4(),
        title: 'Cách nhận biết phòng trọ bị ẩm mốc và cách xử lý hiệu quả',
        slug: 'cach-nhan-biet-phong-tro-bi-am-moc-va-cach-xu-ly-hieu-qua',
        excerpt: 'Ẩm mốc là vấn đề phổ biến tại các phòng trọ, đặc biệt trong mùa mưa. Dưới đây là cách nhận biết sớm và xử lý.',
        content: '<h2>Dấu hiệu nhận biết</h2><p>Mùi ẩm mốc, vệt đen trên tường, sơn bong tróc, đồ vật bị mốc.</p><h2>Cách xử lý</h2><p>Sử dụng máy hút ẩm, quạt thông gió, vệ sinh bằng dung dịch chống mốc chuyên dụng.</p>',
        category_id: CAT.kinhnghiem,
        author_id: adminId,
        featured_image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=500&fit=crop',
        views: 760,
        read_time: '5 phút đọc',
        is_featured: false,
        status: 'published',
        createdAt: new Date('2026-02-12'), updatedAt: now
      },
      {
        post_id: uuidv4(),
        title: 'Top 5 khu vực thuê trọ giá rẻ nhưng an ninh tốt tại Hà Nội',
        slug: 'top-5-khu-vuc-thue-tro-gia-re-nhung-an-ninh-tot-tai-ha-noi',
        excerpt: 'Khám phá những khu vực lý tưởng tại Hà Nội với mức giá phải chăng và môi trường sống an toàn cho người thuê.',
        content: '<h2>1. Cầu Giấy</h2><p>Gần các trường đại học, giá từ 2-3.5 triệu, an ninh tốt.</p><h2>2. Thanh Xuân</h2><p>Khu dân cư đông đúc, tiện ích đầy đủ, giá 2.5-4 triệu.</p><h2>3. Đống Đa</h2><p>Gần trung tâm, nhiều lựa chọn, giá 3-5 triệu.</p>',
        category_id: CAT.tinthitruong,
        author_id: adminId,
        featured_image: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=500&fit=crop',
        views: 2100,
        read_time: '7 phút đọc',
        is_featured: false,
        status: 'published',
        createdAt: new Date('2026-02-10'), updatedAt: now
      },
      {
        post_id: uuidv4(),
        title: 'Hướng giường ngủ trong phòng trọ theo tuổi — Bạn đã đặt đúng chưa?',
        slug: 'huong-giuong-ngu-trong-phong-tro-theo-tuoi',
        excerpt: 'Mỗi tuổi có một hướng ngủ phù hợp để tăng cường sức khỏe và tài vận. Kiểm tra ngay hướng giường bạn đang nằm.',
        content: '<h2>Cách xác định hướng</h2><p>Hướng giường tính theo hướng đầu giường khi nằm ngủ.</p><h2>Theo ngũ hành</h2><p>Người mệnh Kim nên nằm hướng Tây, Tây Bắc. Người mệnh Mộc nên nằm hướng Đông, Đông Nam.</p>',
        category_id: CAT.phongthuy,
        author_id: adminId,
        featured_image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=500&fit=crop',
        views: 1340,
        read_time: '6 phút đọc',
        is_featured: false,
        status: 'published',
        createdAt: new Date('2026-02-08'), updatedAt: now
      },
      {
        post_id: uuidv4(),
        title: 'Mức phạt khi chủ trọ không ký hợp đồng với người thuê',
        slug: 'muc-phat-khi-chu-tro-khong-ky-hop-dong-voi-nguoi-thue',
        excerpt: 'Theo quy định mới nhất, chủ trọ bắt buộc phải ký hợp đồng với người thuê. Vi phạm có thể bị phạt đến 10 triệu.',
        content: '<h2>Quy định hiện hành</h2><p>Theo Nghị định 16/2022/NĐ-CP, việc cho thuê nhà mà không lập hợp đồng bằng văn bản bị phạt 2-5 triệu đồng.</p><h2>Nếu không đăng ký tạm trú</h2><p>Chủ trọ không khai báo tạm trú cho người thuê bị phạt 1-2 triệu đồng.</p>',
        category_id: CAT.phapluat,
        author_id: adminId,
        featured_image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=500&fit=crop',
        views: 4210,
        read_time: '5 phút đọc',
        is_featured: false,
        status: 'published',
        createdAt: new Date('2026-02-05'), updatedAt: now
      },
    ])

    console.log('✅ Posts seeded: 4 categories, 9 posts')
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('posts', null, {})
    await queryInterface.bulkDelete('post_categories', null, {})
  }
}
