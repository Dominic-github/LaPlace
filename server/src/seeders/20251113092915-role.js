'use strict'
const { v4: uuidv4 } = require('uuid')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const userPerms = [
      'view_properties',
      'book_property',
      'cancel_booking',
      'add_review',
      'view_own_contracts',
      'manage_profile'
    ]

    // landlord permissions
    const landlordPerms = [
      'create_property',
      'edit_property',
      'delete_property',
      'view_property_bookings',
      'approve_booking',
      'reject_booking',
      'view_tenant_reviews',
      'manage_own_payments'
    ]

    const brokerPerms = [
      'view_property_bookings',
      'approve_booking',
      'reject_booking'
    ]

    const roleIds = {
      user: uuidv4(),
      landlord: uuidv4(),
      admin: uuidv4(),
      broker: uuidv4()
    }

    const permissionIds = {
      view_properties: uuidv4(),
      book_property: uuidv4(),
      cancel_booking: uuidv4(),
      add_review: uuidv4(),
      view_own_contracts: uuidv4(),
      manage_profile: uuidv4(),
      create_property: uuidv4(),
      edit_property: uuidv4(),
      delete_property: uuidv4(),
      view_property_bookings: uuidv4(),
      approve_booking: uuidv4(),
      reject_booking: uuidv4(),
      view_tenant_reviews: uuidv4(),
      manage_own_payments: uuidv4(),
      manage_users: uuidv4(),
      manage_roles: uuidv4(),
      manage_permissions: uuidv4(),
      view_reports: uuidv4(),
      delete_reviews: uuidv4(),
      approve_landlord: uuidv4(),
      manage_all_properties: uuidv4(),
      manage_payments: uuidv4()
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
