import express from 'express'
const router = express.Router()
import roleController from '@/controlers/role'
import {
  authentication,
  checkPermission
} from '@/middlewares/authentication.js'

// router.get('/:role_id/permissions', role.getAllPermissionsByRole)

router.use(authentication)
router.get('/', checkPermission('*'), roleController.getAllRoles)

export default router
