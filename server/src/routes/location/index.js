import express from 'express'
const router = express.Router()
import locationController from '@/controlers/location'

router.get('/provinces', locationController.getProvinces)
router.get('/provinces/:code_name', locationController.getProvinceByCode)
router.get('/provinces/:province_code/wards', locationController.getWardsByProvince)

export default router
