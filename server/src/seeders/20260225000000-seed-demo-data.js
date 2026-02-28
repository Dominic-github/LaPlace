'use strict'

const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date()
    const hash = (pw) => bcrypt.hashSync(pw, 10)

    // ========================================
    // 1. USERS (4 roles: admin, landlord x2, user x3)
    // ========================================
    const USER = {
      admin: uuidv4(),
      landlord1: uuidv4(),
      landlord2: uuidv4(),
      user1: uuidv4(),
      user2: uuidv4(),
      user3: uuidv4(),
    }

    await queryInterface.bulkInsert('users', [
      {
        user_id: USER.admin,
        fullname: 'Admin LaPlace',
        email: 'admin@laplace.com',
        password: hash('admin123'),
        phone: '0901000001',
        image: null,
        address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
        date_of_birth: new Date('1990-01-15'),
        identifier: '079090001234',
        status: 'active',
        createdAt: now,
        updatedAt: now
      },
      {
        user_id: USER.landlord1,
        fullname: 'Nguyễn Văn Hùng',
        email: 'hung.landlord@gmail.com',
        password: hash('landlord123'),
        phone: '0912345678',
        image: null,
        address: '45 Lê Lợi, Quận 1, TP.HCM',
        date_of_birth: new Date('1985-06-20'),
        identifier: '079085006789',
        status: 'active',
        createdAt: now,
        updatedAt: now
      },
      {
        user_id: USER.landlord2,
        fullname: 'Trần Thị Mai',
        email: 'mai.landlord@gmail.com',
        password: hash('landlord123'),
        phone: '0987654321',
        image: null,
        address: '78 Trần Hưng Đạo, Quận 5, TP.HCM',
        date_of_birth: new Date('1988-03-10'),
        identifier: '079088003456',
        status: 'active',
        createdAt: now,
        updatedAt: now
      },
      {
        user_id: USER.user1,
        fullname: 'Lê Minh Tuấn',
        email: 'tuan.user@gmail.com',
        password: hash('user123'),
        phone: '0909112233',
        image: null,
        address: '12 Phan Xích Long, Phú Nhuận, TP.HCM',
        date_of_birth: new Date('1998-09-05'),
        identifier: '079098005678',
        status: 'active',
        createdAt: now,
        updatedAt: now
      },
      {
        user_id: USER.user2,
        fullname: 'Phạm Thị Hương',
        email: 'huong.user@gmail.com',
        password: hash('user123'),
        phone: '0933445566',
        image: null,
        address: '56 Hoàng Diệu, Quận 4, TP.HCM',
        date_of_birth: new Date('2000-12-25'),
        identifier: '079000007890',
        status: 'active',
        createdAt: now,
        updatedAt: now
      },
      {
        user_id: USER.user3,
        fullname: 'Võ Đức Anh',
        email: 'anh.user@gmail.com',
        password: hash('user123'),
        phone: '0977889900',
        image: null,
        address: '90 Nguyễn Thái Học, Quận 1, TP.HCM',
        date_of_birth: new Date('1996-07-18'),
        identifier: '079096001234',
        status: 'active',
        createdAt: now,
        updatedAt: now
      },
    ])

    // ========================================
    // 2. ROLES & USER_ROLES — Tạo roles nếu chưa có, gán role cho users
    // ========================================
    let roles = await queryInterface.sequelize.query(
      `SELECT role_id, name FROM roles`,
      { type: Sequelize.QueryTypes.SELECT }
    )

    // Tạo roles nếu bảng trống
    if (roles.length === 0) {
      const newRoles = [
        { role_id: uuidv4(), name: 'admin', description: 'Administrator role', createdAt: now, updatedAt: now },
        { role_id: uuidv4(), name: 'landlord', description: 'Landlord role', createdAt: now, updatedAt: now },
        { role_id: uuidv4(), name: 'user', description: 'Tenant user', createdAt: now, updatedAt: now },
        { role_id: uuidv4(), name: 'broker', description: 'Broker role', createdAt: now, updatedAt: now },
      ]
      await queryInterface.bulkInsert('roles', newRoles)
      roles = newRoles.map(r => ({ role_id: r.role_id, name: r.name }))
    }

    const roleMap = {}
    roles.forEach(r => { roleMap[r.name] = r.role_id })

    await queryInterface.bulkInsert('user_roles', [
      { user_roles_id: uuidv4(), user_id: USER.admin, role_id: roleMap['admin'], createdAt: now, updatedAt: now },
      { user_roles_id: uuidv4(), user_id: USER.landlord1, role_id: roleMap['landlord'], createdAt: now, updatedAt: now },
      { user_roles_id: uuidv4(), user_id: USER.landlord2, role_id: roleMap['landlord'], createdAt: now, updatedAt: now },
      { user_roles_id: uuidv4(), user_id: USER.user1, role_id: roleMap['user'], createdAt: now, updatedAt: now },
      { user_roles_id: uuidv4(), user_id: USER.user2, role_id: roleMap['user'], createdAt: now, updatedAt: now },
      { user_roles_id: uuidv4(), user_id: USER.user3, role_id: roleMap['user'], createdAt: now, updatedAt: now },
    ])

    // ========================================
    // 3. FACILITIES (12 tiện nghi phổ biến)
    // ========================================
    const FAC = {
      wifi: uuidv4(),
      ac: uuidv4(),
      heater: uuidv4(),
      fridge: uuidv4(),
      washer: uuidv4(),
      parking: uuidv4(),
      security: uuidv4(),
      bed: uuidv4(),
      kitchen: uuidv4(),
      toilet: uuidv4(),
      balcony: uuidv4(),
      elevator: uuidv4(),
    }

    await queryInterface.bulkInsert('facilities', [
      { facility_id: FAC.wifi, name: 'WiFi miễn phí', createdAt: now, updatedAt: now },
      { facility_id: FAC.ac, name: 'Điều hòa', createdAt: now, updatedAt: now },
      { facility_id: FAC.heater, name: 'Nóng lạnh', createdAt: now, updatedAt: now },
      { facility_id: FAC.fridge, name: 'Tủ lạnh', createdAt: now, updatedAt: now },
      { facility_id: FAC.washer, name: 'Máy giặt', createdAt: now, updatedAt: now },
      { facility_id: FAC.parking, name: 'Chỗ để xe', createdAt: now, updatedAt: now },
      { facility_id: FAC.security, name: 'Bảo vệ 24/7', createdAt: now, updatedAt: now },
      { facility_id: FAC.bed, name: 'Giường ngủ', createdAt: now, updatedAt: now },
      { facility_id: FAC.kitchen, name: 'Bếp riêng', createdAt: now, updatedAt: now },
      { facility_id: FAC.toilet, name: 'WC riêng', createdAt: now, updatedAt: now },
      { facility_id: FAC.balcony, name: 'Ban công', createdAt: now, updatedAt: now },
      { facility_id: FAC.elevator, name: 'Thang máy', createdAt: now, updatedAt: now },
    ])

    // ========================================
    // 4. ACCOMMODATIONS (10 phòng trọ đa dạng)
    // ========================================
    const ACC = {
      a1: uuidv4(), a2: uuidv4(), a3: uuidv4(), a4: uuidv4(), a5: uuidv4(),
      a6: uuidv4(), a7: uuidv4(), a8: uuidv4(), a9: uuidv4(), a10: uuidv4(),
    }

    await queryInterface.bulkInsert('accommodations', [
      {
        accommodation_id: ACC.a1,
        landlord_id: USER.landlord1,
        name: 'Phòng trọ cao cấp Quận 1 - Full nội thất',
        type: 'phong-tro',
        description: 'Phòng trọ mới xây tại trung tâm Quận 1, đầy đủ nội thất cao cấp. Gần chợ Bến Thành, thuận tiện di chuyển. An ninh tốt, có bảo vệ 24/7. Phù hợp cho nhân viên văn phòng và sinh viên.',
        price: '4500000',
        slot: 2,
        location: '123 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP.HCM',
        thumbnail: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        area: '25',
        bedrooms: 1, bathrooms: 1, deposit_months: 2, status: 'active', province_code: '79',
        createdAt: now, updatedAt: now
      },
      {
        accommodation_id: ACC.a2,
        landlord_id: USER.landlord1,
        name: 'Căn hộ mini Phú Nhuận - Ban công thoáng mát',
        type: 'can-ho',
        description: 'Căn hộ mini 35m² có ban công rộng view đẹp. Phòng khách riêng, bếp riêng, WC riêng. Gần sân bay Tân Sơn Nhất, đường Phan Xích Long sầm uất.',
        price: '6000000',
        slot: 2,
        location: '45 Phan Xích Long, Phường 3, Phú Nhuận, TP.HCM',
        thumbnail: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        area: '35',
        bedrooms: 1, bathrooms: 1, deposit_months: 2, status: 'active', province_code: '79',
        createdAt: now, updatedAt: now
      },
      {
        accommodation_id: ACC.a3,
        landlord_id: USER.landlord1,
        name: 'Nhà nguyên căn 3 tầng Bình Thạnh',
        type: 'nha-nguyen-can',
        description: 'Nhà nguyên căn 3 tầng khang trang tại Bình Thạnh. 3 phòng ngủ, 2 WC, sân thượng rộng. Khu dân cư yên tĩnh, gần trường học và bệnh viện. Phù hợp gia đình 4-6 người.',
        price: '12000000',
        slot: 6,
        location: '67 Đinh Bộ Lĩnh, Phường 24, Bình Thạnh, TP.HCM',
        thumbnail: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
        area: '80',
        bedrooms: 3, bathrooms: 2, deposit_months: 3, status: 'active', province_code: '79',
        createdAt: now, updatedAt: now
      },
      {
        accommodation_id: ACC.a4,
        landlord_id: USER.landlord2,
        name: 'Ký túc xá sinh viên Thủ Đức - Giá rẻ',
        type: 'ky-tuc-xa',
        description: 'Ký túc xá gần ĐH Bách Khoa và ĐH Quốc gia TP.HCM. Phòng 4 người, có điều hòa, WiFi tốc độ cao. Khu vực có nhiều quán ăn và tiện ích.',
        price: '1200000',
        slot: 4,
        location: '234 Xa lộ Hà Nội, Thủ Đức, TP.HCM',
        thumbnail: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
        area: '40',
        bedrooms: 1, bathrooms: 1, deposit_months: 1, status: 'active', province_code: '79',
        createdAt: now, updatedAt: now
      },
      {
        accommodation_id: ACC.a5,
        landlord_id: USER.landlord1,
        name: 'Phòng trọ gác lửng Gò Vấp - Gần chợ',
        type: 'phong-tro',
        description: 'Phòng trọ có gác lửng rộng rãi, thoáng mát. Gần chợ Gò Vấp, siêu thị CoopMart. Chủ nhà thân thiện, khu vực an ninh tốt. Điện nước giá dân.',
        price: '2800000',
        slot: 2,
        location: '89 Nguyễn Oanh, Phường 17, Gò Vấp, TP.HCM',
        thumbnail: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
        area: '20',
        bedrooms: 1, bathrooms: 1, deposit_months: 1, status: 'active', province_code: '79',
        createdAt: now, updatedAt: now
      },
      {
        accommodation_id: ACC.a6,
        landlord_id: USER.landlord2,
        name: 'Studio cao cấp Quận 7 - Gần Phú Mỹ Hưng',
        type: 'can-ho',
        description: 'Studio thiết kế hiện đại tại Quận 7, gần khu đô thị Phú Mỹ Hưng. Full nội thất nhập khẩu: tủ bếp, máy lạnh Daikin, nóng lạnh Ariston. Hồ bơi, gym, sauna miễn phí.',
        price: '8500000',
        slot: 2,
        location: '456 Nguyễn Lương Bằng, Phường Tân Phú, Quận 7, TP.HCM',
        thumbnail: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        area: '30',
        bedrooms: 1, bathrooms: 1, deposit_months: 2, status: 'active', province_code: '79',
        createdAt: now, updatedAt: now
      },
      {
        accommodation_id: ACC.a7,
        landlord_id: USER.landlord1,
        name: 'Phòng trọ giá rẻ Tân Bình - Gần sân bay',
        type: 'phong-tro',
        description: 'Phòng trọ sạch sẽ, giá rẻ khu vực Tân Bình. Gần sân bay Tân Sơn Nhất 2km. Có chỗ nấu ăn riêng, WC riêng. Không chung chủ.',
        price: '3200000',
        slot: 2,
        location: '12 Cộng Hòa, Phường 4, Tân Bình, TP.HCM',
        thumbnail: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800',
        area: '22',
        bedrooms: 1, bathrooms: 1, deposit_months: 1, status: 'active', province_code: '79',
        createdAt: now, updatedAt: now
      },
      {
        accommodation_id: ACC.a8,
        landlord_id: USER.landlord2,
        name: 'Căn hộ 2PN Quận 2 - View sông Sài Gòn',
        type: 'can-ho',
        description: 'Căn hộ 2 phòng ngủ tại chung cư cao cấp Quận 2. View sông Sài Gòn tuyệt đẹp. Full nội thất, an ninh chuẩn quốc tế. Gần Metro, trung tâm thương mại.',
        price: '15000000',
        slot: 4,
        location: '789 Mai Chí Thọ, Phường Thủ Thiêm, Quận 2, TP.HCM',
        thumbnail: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
        area: '65',
        bedrooms: 2, bathrooms: 2, deposit_months: 3, status: 'active', province_code: '79',
        createdAt: now, updatedAt: now
      },
      {
        accommodation_id: ACC.a9,
        landlord_id: USER.landlord2,
        name: 'Nhà nguyên căn Quận 9 - Sân vườn rộng',
        type: 'nha-nguyen-can',
        description: 'Nhà nguyên căn 2 tầng có sân vườn rộng tại Quận 9. 4 phòng ngủ, 3 WC, garage ô tô. Khu compound an ninh, yên tĩnh. Phù hợp gia đình có trẻ nhỏ.',
        price: '18000000',
        slot: 8,
        location: '321 Lê Văn Việt, Phường Tăng Nhơn Phú, Quận 9, TP.HCM',
        thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        area: '120',
        bedrooms: 4, bathrooms: 3, deposit_months: 3, status: 'active', province_code: '79',
        createdAt: now, updatedAt: now
      },
      {
        accommodation_id: ACC.a10,
        landlord_id: USER.landlord2,
        name: 'Ký túc xá nữ Quận 10 - An ninh cao',
        type: 'ky-tuc-xa',
        description: 'Ký túc xá dành cho nữ tại Quận 10. An ninh nghiêm ngặt, camera giám sát 24/7. Gần ĐH Bách Khoa, ĐH Y Dược. Phòng máy lạnh, WiFi, giường tầng chất lượng.',
        price: '1500000',
        slot: 6,
        location: '56 Sư Vạn Hạnh, Phường 9, Quận 10, TP.HCM',
        thumbnail: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
        area: '50',
        bedrooms: 1, bathrooms: 2, deposit_months: 1, status: 'active', province_code: '79',
        createdAt: now, updatedAt: now
      },
    ])

    // ========================================
    // 5. ACCOMMODATION_IMAGES (3 ảnh mỗi phòng)
    // ========================================
    const accImages = []
    const imgSets = {
      [ACC.a1]: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
      ],
      [ACC.a2]: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      ],
      [ACC.a3]: [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      ],
      [ACC.a4]: [
        'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
        'https://images.unsplash.com/photo-1595599512519-0e3c1e384ae2?w=800',
        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
      ],
      [ACC.a5]: [
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
        'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800',
        'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=800',
      ],
    }
    for (const [accId, urls] of Object.entries(imgSets)) {
      urls.forEach((url, i) => {
        accImages.push({
          accommodation_image_id: uuidv4(),
          accommodation_id: accId,
          image_url: url,
          caption: `Ảnh ${i + 1}`,
          createdAt: now, updatedAt: now,
        })
      })
    }
    await queryInterface.bulkInsert('accommodations_images', accImages)

    // ========================================
    // 6. ACCOMMODATION_FACILITIES (gán tiện nghi)
    // ========================================
    const accFacilities = [
      // a1: phong tro cao cap — full tien nghi
      ...[FAC.wifi, FAC.ac, FAC.heater, FAC.fridge, FAC.parking, FAC.security, FAC.bed, FAC.toilet].map(f => ({
        accommodation_id: ACC.a1, facility_id: f, createdAt: now, updatedAt: now
      })),
      // a2: can ho mini — co bep, ban cong
      ...[FAC.wifi, FAC.ac, FAC.heater, FAC.fridge, FAC.washer, FAC.kitchen, FAC.toilet, FAC.balcony].map(f => ({
        accommodation_id: ACC.a2, facility_id: f, createdAt: now, updatedAt: now
      })),
      // a3: nha nguyen can — full all
      ...[FAC.wifi, FAC.ac, FAC.heater, FAC.fridge, FAC.washer, FAC.parking, FAC.security, FAC.bed, FAC.kitchen, FAC.toilet, FAC.balcony].map(f => ({
        accommodation_id: ACC.a3, facility_id: f, createdAt: now, updatedAt: now
      })),
      // a4: ky tuc xa — basic
      ...[FAC.wifi, FAC.ac, FAC.bed, FAC.toilet, FAC.parking].map(f => ({
        accommodation_id: ACC.a4, facility_id: f, createdAt: now, updatedAt: now
      })),
      // a5: phong tro gac lung — basic+
      ...[FAC.wifi, FAC.heater, FAC.parking, FAC.toilet, FAC.bed].map(f => ({
        accommodation_id: ACC.a5, facility_id: f, createdAt: now, updatedAt: now
      })),
      // a6: studio cao cap — full + elevator
      ...[FAC.wifi, FAC.ac, FAC.heater, FAC.fridge, FAC.washer, FAC.security, FAC.bed, FAC.kitchen, FAC.toilet, FAC.balcony, FAC.elevator].map(f => ({
        accommodation_id: ACC.a6, facility_id: f, createdAt: now, updatedAt: now
      })),
      // a7: phong tro gia re
      ...[FAC.wifi, FAC.heater, FAC.toilet, FAC.parking].map(f => ({
        accommodation_id: ACC.a7, facility_id: f, createdAt: now, updatedAt: now
      })),
      // a8: can ho 2PN — luxury
      ...[FAC.wifi, FAC.ac, FAC.heater, FAC.fridge, FAC.washer, FAC.parking, FAC.security, FAC.bed, FAC.kitchen, FAC.toilet, FAC.balcony, FAC.elevator].map(f => ({
        accommodation_id: ACC.a8, facility_id: f, createdAt: now, updatedAt: now
      })),
      // a9: nha nguyen can san vuon — full
      ...[FAC.wifi, FAC.ac, FAC.heater, FAC.fridge, FAC.washer, FAC.parking, FAC.security, FAC.bed, FAC.kitchen, FAC.toilet, FAC.balcony].map(f => ({
        accommodation_id: ACC.a9, facility_id: f, createdAt: now, updatedAt: now
      })),
      // a10: ky tuc xa nu
      ...[FAC.wifi, FAC.ac, FAC.security, FAC.bed, FAC.toilet, FAC.elevator].map(f => ({
        accommodation_id: ACC.a10, facility_id: f, createdAt: now, updatedAt: now
      })),
    ]
    await queryInterface.bulkInsert('accommodation_facilities', accFacilities)

    // ========================================
    // 7. BOOKINGS (6 bookings — đủ status)
    // ========================================
    const BK = { b1: uuidv4(), b2: uuidv4(), b3: uuidv4(), b4: uuidv4(), b5: uuidv4(), b6: uuidv4() }

    await queryInterface.bulkInsert('bookings', [
      {
        booking_id: BK.b1,
        user_id: USER.user1,
        accommodation_id: ACC.a1,
        landlord_id: USER.landlord1,
        start_date: new Date('2026-03-01'),
        end_date: new Date('2026-09-01'),
        status: 'confirmed',
        total_price: 27000000,
        payment_status: 'paid',
        note: 'Khách đặt trước 6 tháng, đã thanh toán cọc 1 tháng.',
        createdAt: now, updatedAt: now
      },
      {
        booking_id: BK.b2,
        user_id: USER.user2,
        accommodation_id: ACC.a2,
        landlord_id: USER.landlord1,
        start_date: new Date('2026-03-15'),
        end_date: new Date('2027-03-15'),
        status: 'pending',
        total_price: 72000000,
        payment_status: 'unpaid',
        note: 'Chờ xác nhận, khách muốn ở 1 năm.',
        createdAt: now, updatedAt: now
      },
      {
        booking_id: BK.b3,
        user_id: USER.user3,
        accommodation_id: ACC.a4,
        landlord_id: USER.landlord2,
        start_date: new Date('2026-02-01'),
        end_date: new Date('2026-08-01'),
        status: 'completed',
        total_price: 7200000,
        payment_status: 'paid',
        note: 'Sinh viên năm 3, đã hoàn thành hợp đồng.',
        createdAt: new Date('2026-01-15'), updatedAt: now
      },
      {
        booking_id: BK.b4,
        user_id: USER.user1,
        accommodation_id: ACC.a6,
        landlord_id: USER.landlord2,
        start_date: new Date('2026-04-01'),
        end_date: new Date('2027-04-01'),
        status: 'pending',
        total_price: 10200000,
        payment_status: 'unpaid',
        note: 'Khách muốn xem phòng trước khi đặt cọc.',
        createdAt: now, updatedAt: now
      },
      {
        booking_id: BK.b5,
        user_id: USER.user2,
        accommodation_id: ACC.a5,
        landlord_id: USER.landlord1,
        start_date: new Date('2026-01-01'),
        end_date: new Date('2026-03-01'),
        status: 'cancelled',
        total_price: 5600000,
        payment_status: 'refunded',
        note: 'Khách hủy vì chuyển đi tỉnh công tác.',
        createdAt: new Date('2025-12-20'), updatedAt: now
      },
      {
        booking_id: BK.b6,
        user_id: USER.user3,
        accommodation_id: ACC.a8,
        landlord_id: USER.landlord2,
        start_date: new Date('2026-05-01'),
        end_date: new Date('2027-05-01'),
        status: 'confirmed',
        total_price: 18000000,
        payment_status: 'deposit_paid',
        note: 'Đã đặt cọc 2 tháng tiền nhà.',
        createdAt: now, updatedAt: now
      },
    ])

    // ========================================
    // 8. CONTRACTS (3 hợp đồng)
    // ========================================
    const CT = { c1: uuidv4(), c2: uuidv4(), c3: uuidv4() }

    await queryInterface.bulkInsert('contracts', [
      {
        contract_id: CT.c1,
        owner_id: USER.landlord1,
        tenant_id: USER.user1,
        status: 'active',
        pdf_url: null,
        signed_at: new Date('2026-02-25'),
        createdAt: now, updatedAt: now
      },
      {
        contract_id: CT.c2,
        owner_id: USER.landlord2,
        tenant_id: USER.user3,
        status: 'expired',
        pdf_url: null,
        signed_at: new Date('2026-02-01'),
        createdAt: new Date('2026-01-15'), updatedAt: now
      },
      {
        contract_id: CT.c3,
        owner_id: USER.landlord2,
        tenant_id: USER.user3,
        status: 'active',
        pdf_url: null,
        signed_at: new Date('2026-02-20'),
        createdAt: now, updatedAt: now
      },
    ])

    // ========================================
    // 9. PAYMENTS (5 thanh toán)
    // ========================================
    await queryInterface.bulkInsert('payments', [
      {
        payment_id: uuidv4(),
        payer_id: USER.user1,
        contract_id: CT.c1,
        payment_type: 'deposit',
        amount: 4500000,
        method: 'bank_transfer',
        status: 'completed',
        transaction_code: 'LP20260225001',
        payment_date: new Date('2026-02-25'),
        createdAt: now, updatedAt: now
      },
      {
        payment_id: uuidv4(),
        payer_id: USER.user1,
        contract_id: CT.c1,
        payment_type: 'monthly',
        amount: 4500000,
        method: 'bank_transfer',
        status: 'completed',
        transaction_code: 'LP20260301001',
        payment_date: new Date('2026-03-01'),
        createdAt: now, updatedAt: now
      },
      {
        payment_id: uuidv4(),
        payer_id: USER.user3,
        contract_id: CT.c2,
        payment_type: 'deposit',
        amount: 1200000,
        method: 'cash',
        status: 'completed',
        transaction_code: 'LP20260115001',
        payment_date: new Date('2026-01-15'),
        createdAt: new Date('2026-01-15'), updatedAt: now
      },
      {
        payment_id: uuidv4(),
        payer_id: USER.user3,
        contract_id: CT.c3,
        payment_type: 'deposit',
        amount: 30000000,
        method: 'bank_transfer',
        status: 'completed',
        transaction_code: 'LP20260220001',
        payment_date: new Date('2026-02-20'),
        createdAt: now, updatedAt: now
      },
      {
        payment_id: uuidv4(),
        payer_id: USER.user3,
        contract_id: CT.c3,
        payment_type: 'monthly',
        amount: 15000000,
        method: 'online',
        status: 'pending',
        transaction_code: 'LP20260301002',
        payment_date: new Date('2026-03-05'),
        createdAt: now, updatedAt: now
      },
    ])

    // ========================================
    // 10. REVIEWS (8 đánh giá)
    // ========================================
    await queryInterface.bulkInsert('reviews', [
      {
        review_id: uuidv4(),
        user_id: USER.user1,
        accommodation_id: ACC.a1,
        ratting: 5,
        comment: 'Phòng rất đẹp, sạch sẽ, chủ nhà nhiệt tình. Vị trí trung tâm, đi lại thuận tiện. Giá hợp lý so với khu vực Quận 1.',
        createdAt: now, updatedAt: now
      },
      {
        review_id: uuidv4(),
        user_id: USER.user2,
        accommodation_id: ACC.a1,
        ratting: 4,
        comment: 'Phòng tốt, nội thất đầy đủ. Hơi ồn vào ban đêm do gần đường lớn nhưng tổng thể rất ổn.',
        createdAt: now, updatedAt: now
      },
      {
        review_id: uuidv4(),
        user_id: USER.user3,
        accommodation_id: ACC.a4,
        ratting: 4,
        comment: 'KTX sạch sẽ, WiFi mạnh, phù hợp sinh viên. Khu vực có nhiều quán ăn giá rẻ xung quanh.',
        createdAt: now, updatedAt: now
      },
      {
        review_id: uuidv4(),
        user_id: USER.user1,
        accommodation_id: ACC.a2,
        ratting: 5,
        comment: 'Căn hộ mini nhưng đầy đủ tiện nghi. Ban công view đẹp, gió mát. Chủ nhà rất tốt bụng.',
        createdAt: now, updatedAt: now
      },
      {
        review_id: uuidv4(),
        user_id: USER.user2,
        accommodation_id: ACC.a5,
        ratting: 3,
        comment: 'Phòng ổn so với giá. Gác lửng hơi thấp, cần cải thiện thêm. Chủ nhà dễ tính.',
        createdAt: now, updatedAt: now
      },
      {
        review_id: uuidv4(),
        user_id: USER.user3,
        accommodation_id: ACC.a6,
        ratting: 5,
        comment: 'Studio cực đẹp! Nội thất cao cấp, có hồ bơi và gym. Khu Phú Mỹ Hưng sống rất thoải mái.',
        createdAt: now, updatedAt: now
      },
      {
        review_id: uuidv4(),
        user_id: USER.user1,
        accommodation_id: ACC.a8,
        ratting: 5,
        comment: 'Căn hộ view sông tuyệt đẹp, buổi sáng trong lành. An ninh chuẩn quốc tế, rất yên tâm.',
        createdAt: now, updatedAt: now
      },
      {
        review_id: uuidv4(),
        user_id: USER.user2,
        accommodation_id: ACC.a7,
        ratting: 4,
        comment: 'Giá rất tốt cho khu Tân Bình. Phòng sạch sẽ, gần sân bay tiện cho đi công tác.',
        createdAt: now, updatedAt: now
      },
    ])

    // ========================================
    // 11. FAVORITES (user yêu thích phòng)
    // ========================================
    await queryInterface.bulkInsert('favorites', [
      { favorite_id: uuidv4(), user_id: USER.user1, accommodation_id: ACC.a2, createdAt: now, updatedAt: now },
      { favorite_id: uuidv4(), user_id: USER.user1, accommodation_id: ACC.a6, createdAt: now, updatedAt: now },
      { favorite_id: uuidv4(), user_id: USER.user1, accommodation_id: ACC.a8, createdAt: now, updatedAt: now },
      { favorite_id: uuidv4(), user_id: USER.user2, accommodation_id: ACC.a1, createdAt: now, updatedAt: now },
      { favorite_id: uuidv4(), user_id: USER.user2, accommodation_id: ACC.a3, createdAt: now, updatedAt: now },
      { favorite_id: uuidv4(), user_id: USER.user3, accommodation_id: ACC.a9, createdAt: now, updatedAt: now },
      { favorite_id: uuidv4(), user_id: USER.user3, accommodation_id: ACC.a4, createdAt: now, updatedAt: now },
    ])

    // ========================================
    // 12. MESSAGES (chat giữa user và landlord)
    // ========================================
    await queryInterface.bulkInsert('messages', [
      {
        message_id: uuidv4(),
        sender_id: USER.user1,
        receiver_id: USER.landlord1,
        content: 'Chào anh, phòng trọ ở Quận 1 còn trống không ạ?',
        createdAt: new Date('2026-02-24T10:00:00'), updatedAt: now
      },
      {
        message_id: uuidv4(),
        sender_id: USER.landlord1,
        receiver_id: USER.user1,
        content: 'Chào em, phòng vẫn còn trống. Em muốn đến xem phòng khi nào?',
        createdAt: new Date('2026-02-24T10:05:00'), updatedAt: now
      },
      {
        message_id: uuidv4(),
        sender_id: USER.user1,
        receiver_id: USER.landlord1,
        content: 'Em muốn xem chiều nay được không anh? Khoảng 3h.',
        createdAt: new Date('2026-02-24T10:08:00'), updatedAt: now
      },
      {
        message_id: uuidv4(),
        sender_id: USER.landlord1,
        receiver_id: USER.user1,
        content: 'Được em, 3h chiều nay anh đợi em tại phòng nhé.',
        createdAt: new Date('2026-02-24T10:10:00'), updatedAt: now
      },
      {
        message_id: uuidv4(),
        sender_id: USER.user2,
        receiver_id: USER.landlord2,
        content: 'Chị ơi, studio Quận 7 có thể thương lượng giá không ạ?',
        createdAt: new Date('2026-02-23T14:00:00'), updatedAt: now
      },
      {
        message_id: uuidv4(),
        sender_id: USER.landlord2,
        receiver_id: USER.user2,
        content: 'Giá đã tốt nhất rồi em. Nhưng nếu em thuê 1 năm, chị giảm 500k/tháng nhé.',
        createdAt: new Date('2026-02-23T14:15:00'), updatedAt: now
      },
    ])

    // ========================================
    // 13. REPORTS (báo cáo vi phạm)
    // ========================================
    await queryInterface.bulkInsert('reports', [
      {
        report_id: uuidv4(),
        user_id: USER.user2,
        accommodation_id: ACC.a5,
        reason: 'Thông tin sai sự thật',
        description: 'Ảnh đăng không đúng thực tế. Phòng thực tế nhỏ hơn và không có gác lửng như mô tả.',
        createdAt: now, updatedAt: now
      },
      {
        report_id: uuidv4(),
        user_id: USER.user3,
        accommodation_id: ACC.a7,
        reason: 'Giá không chính xác',
        description: 'Giá đăng là 3.2 triệu nhưng khi liên hệ thì chủ nhà báo giá 4 triệu + phí dịch vụ.',
        createdAt: now, updatedAt: now
      },
    ])

    console.log('✅ Demo data seeded successfully!')
    console.log(`   - ${Object.keys(USER).length} users`)
    console.log(`   - ${Object.keys(FAC).length} facilities`)
    console.log(`   - ${Object.keys(ACC).length} accommodations + images`)
    console.log(`   - 6 bookings, 3 contracts, 5 payments`)
    console.log(`   - 8 reviews, 7 favorites, 6 messages, 2 reports`)
  },

  async down(queryInterface, Sequelize) {
    // Xóa theo thứ tự ngược lại (giữ roles/permissions)
    await queryInterface.bulkDelete('reports', null, {})
    await queryInterface.bulkDelete('messages', null, {})
    await queryInterface.bulkDelete('favorites', null, {})
    await queryInterface.bulkDelete('reviews', null, {})
    await queryInterface.bulkDelete('payments', null, {})
    await queryInterface.bulkDelete('contracts', null, {})
    await queryInterface.bulkDelete('bookings', null, {})
    await queryInterface.bulkDelete('accommodation_facilities', null, {})
    await queryInterface.bulkDelete('accommodations_images', null, {})
    await queryInterface.bulkDelete('accommodations', null, {})
    await queryInterface.bulkDelete('facilities', null, {})
    await queryInterface.bulkDelete('user_roles', null, {})
    await queryInterface.bulkDelete('users', null, {})
  }
}
