import express from 'express'
const router = express.Router()
import settingController from '@/controlers/setting'
import {
  authentication,
  checkPermission
} from '@/middlewares/authentication.js'

// Public: Lấy settings (cho client frontend & admin list)
router.get('/', settingController.getAllSettings)
router.get('/group/:group', settingController.getSettingsByGroup)

// Admin only
router.use(authentication)
router.get('/:id', settingController.getOne)
router.post('/', checkPermission('*'), settingController.createSetting)
router.post('/bulk', checkPermission('*'), settingController.bulkUpdate)
router.put('/:id', checkPermission('*'), settingController.updateOne)
router.delete('/:id', checkPermission('*'), settingController.deleteOne)

export default router
