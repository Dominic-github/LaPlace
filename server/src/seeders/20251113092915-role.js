'use strict'
const { default: role } = require('@/services/role')
const { v4: uuidv4 } = require('uuid')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {


    const adminPerms = [
      'user_view',
      'user_add',
      'user_edit',
      'user_delete',

      'role_view',
      'role_add',
      'role_edit',
      'role_delete',

      'permission_view',
      'permission_add',
      'permission_edit',
      'permission_delete',

      'report_view',
      'report_add',
      'report_edit',
      'report_delete',

      'booking_view',
      'booking_add',
      'booking_edit',
      'booking_delete',

      'accommodation_view',

      'payment_view',

    ]
    const userPerms = [
      'accommodation_view',

      'booking_view',
      'booking_add',
      'booking_edit',
      'booking_delete',

      'review_view',
      'review_add',
      'review_edit',
      'review_delete',

      'view_own_contracts',
      'manage_profile'
    ]

    // landlord permissions
    const landlordPerms = [
      'accommodation_view',
      'accommodation_add',
      'accommodation_edit',
      'accommodation_delete',

      'booking_view',
      'booking_edit',
      'booking_delete',

      'payment_view',
      'payment_add',
      'payment_edit',
      'payment_delete',

      'review_view',
      'user_view',

      'contract_view',
      'contract_add',
      'contract_edit',
      'contract_delete',
    ]

    const brokerPerms = [
      'review_view',
      'user_view',

      'booking_view',
      'booking_add',
      'booking_edit',
      'booking_delete',

    ]

    const roleIds = {
      user: uuidv4(),
      landlord: uuidv4(),
      admin: uuidv4(),
      broker: uuidv4()
    }

    const permissionIds = {
      user_view: uuidv4(),
      user_add: uuidv4(),
      user_edit: uuidv4(),
      user_delete: uuidv4(),

      role_view: uuidv4(),
      role_add: uuidv4(),
      role_edit: uuidv4(),
      role_delete: uuidv4(),

      permission_view: uuidv4(),
      permission_add: uuidv4(),
      permission_edit: uuidv4(),
      permission_delete: uuidv4(),

      report_view: uuidv4(),
      report_add: uuidv4(),
      report_edit: uuidv4(),
      review_delete: uuidv4(),

      booking_view: uuidv4(),
      booking_add: uuidv4(),
      booking_edit: uuidv4(),
      booking_delete: uuidv4(),

      accommodation_view: uuidv4(),
      accommodation_add: uuidv4(),
      accommodation_update: uuidv4(),
      accommodation_delete: uuidv4(),

      setting: uuidv4(),

      payment_view: uuidv4(),
      payment_add: uuidv4(),
      payment_edit: uuidv4(),
      payment_delete: uuidv4(),

      landlord_view: uuidv4(),
      landlord_add: uuidv4(),
      landlord_edit: uuidv4(),
      landlord_delete: uuidv4(),

      broker_view: uuidv4(),
      broker_add: uuidv4(),
      broker_edit: uuidv4(),
      broker_delete: uuidv4(),
    }

    // --- Insert roles ---
    await queryInterface.bulkInsert('roles', [
      {
        role_id: roleIds.user,
        name: 'user',
        description: 'Tenant user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_id: roleIds.landlord,
        name: 'landlord',
        description: 'Landlord role',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_id: roleIds.admin,
        name: 'admin',
        description: 'Administrator role',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_id: roleIds.broker,
        name: 'broker',
        description: 'Broker role',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])

    // --- Insert permissions ---
    await queryInterface.bulkInsert(
      'permissions',
      Object.entries(permissionIds).map(([name, id]) => ({
        permission_id: id,
        name,
        description: name.replace(/_/g, ' '),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
    const rolePermissions = []

    userPerms.forEach((p) =>
      rolePermissions.push({
        role_id: roleIds.user,
        permission_id: permissionIds[p],
        createdAt: new Date(),
        updatedAt: new Date()
      })
    )

    landlordPerms.forEach((p) =>
      rolePermissions.push({
        role_id: roleIds.landlord,
        permission_id: permissionIds[p],
        createdAt: new Date(),
        updatedAt: new Date()
      })
    )

    brokerPerms.forEach((p) =>
      rolePermissions.push({
        role_id: roleIds.broker,
        permission_id: permissionIds[p],
        createdAt: new Date(),
        updatedAt: new Date()
      })
    )

    // admin = full access
    Object.keys(permissionIds).forEach((p) =>
      rolePermissions.push({
        role_id: roleIds.admin,
        permission_id: permissionIds[p],
        createdAt: new Date(),
        updatedAt: new Date()
      })
    )

    await queryInterface.bulkInsert('role_permissions', rolePermissions)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {})
    await queryInterface.bulkDelete('permissions', null, {})
  }
}
