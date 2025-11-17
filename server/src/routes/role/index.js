import express from 'express'
const router = express.Router()
import role from '@/controlers/role'
import {
  authentication,
  checkPermission
} from '@/middlewares/authentication.js'

// router.get('/:role_id/permissions', role.getAllPermissionsByRole)

router.use(authentication)

router.get('/', checkPermission('*'), role.getAllRoles)

export default router
