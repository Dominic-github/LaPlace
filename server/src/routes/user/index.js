import { authentication, checkPermission } from '@/middlewares/authentication'
import express from 'express'
import user from '@/controlers/user'

const router = express.Router()

router.use(authentication)

router.get('/:user_id', user.getUserById)

router.get('/', checkPermission('user_view'), user.getAllUsers)
router.post('/', checkPermission('user_add'), user.createUser)
router.patch('/:user_id', checkPermission('user_edit'), user.updateUser)
router.delete('/:user_id', checkPermission('user_delete'), user.deleteUser)

export default router
