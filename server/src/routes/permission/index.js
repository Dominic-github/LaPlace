import express from 'express'
const router = express.Router()
import permissionController from '@/controlers/permission'
import { authentication } from '@/middlewares/authentication.js'

router.get('/', permissionController.getAllPermissions)
router.get('/:role_id', permissionController.getAllPermissionsByRole)

router.use(authentication)

export default router
