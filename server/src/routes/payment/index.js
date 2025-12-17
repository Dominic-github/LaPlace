import express from 'express'
const router = express.Router()
import paymentController from '@/controlers/payment'
import { authentication, checkPermission } from '@/middlewares/authentication.js'

router.use(authentication)

router.get('', checkPermission('payment_view', paymentController.getAllPaymentsFromUser))
router.get('/:payment_id', checkPermission('payment_view', paymentController.getPaymentById))

router.post('/', checkPermission('payment_add'), paymentController.createPayment)
router.patch('/:payment_id', checkPermission('payment_edit'), paymentController.updatePayment)

export default router
