import express from 'express'
const router = express.Router()
import permission from '@/controlers/permission'
import { authentication } from '@/middlewares/authentication.js'

router.get('/', permission.getAllPermissions)
router.get('/:role_id', permission.getAllPermissionsByRole)

router.use(authentication)

export default router
