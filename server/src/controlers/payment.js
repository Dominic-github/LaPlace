import paymentService from '../services/payment'
import catchAsync from '@/helpers/catchAsync'
import { OK, CREATED } from '@/core/success'

class PaymentController {
  createPayment = catchAsync(async (req, res) => {
    CREATED(
      res,
      'Payment created successfully',
      await paymentService.createPayment(req.body)
    )
  })

  updatePayment = catchAsync(async (req, res) => {
    OK(
      res,
      'Payment updated successfully',
      await paymentService.updatePayment(req.params.id, req.body)
    )
  })

  getPaymentById = catchAsync(async (req, res) => {
    OK(
      res,
      'Payment fetched successfully',
      await paymentService.getPaymentById(req.params.id)
    )
  })

  getAllPaymentsFromUser = catchAsync(async (req, res) => {
    OK(
      res,
      'User Payments fetched successfully',
      await paymentService.getAllPaymentsFromUser(req.params.user_id)
    )
  })
}

export default new PaymentController()
