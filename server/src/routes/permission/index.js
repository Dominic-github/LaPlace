import express from 'express'
const router = express.Router()
import permissionController from '@/controlers/permission'
import { authentication } from '@/middlewares/authentication.js'


router.use(authentication)
router.get('/', permissionController.getAllPermissions)
router.get('/:role_id', permissionController.getAllPermissionsByRole)

export default router
