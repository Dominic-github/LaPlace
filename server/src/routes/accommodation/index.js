import express from 'express'
const router = express.Router()
import accommodationControler from '@/controlers/accommodation'
import {
  authentication,
  checkPermission
} from '@/middlewares/authentication.js'

router.get('/', accommodationControler.getAllAccommodations)
router.get('/:accommodation_id', accommodationControler.getAccommodationById)
router.use(authentication)
// router.post('/create', accommodation.createAccommodation)

router.post('/favorite', accommodationControler.addAccommodationToFavorite)
router.post(
  '/',
  checkPermission(''),
  accommodationControler.createAccommodation
)
router.patch(
  '/',
  checkPermission(''),
  accommodationControler.updateAccommodation
)
router.delete(
  '/',
  checkPermission(''),
  accommodationControler.deleteAccommodation
)

export default router
