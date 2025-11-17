import models from '@/models'
const { payments } = models
class PaymentService {
  createPayment = async ({ user_id, amount, method }) => {
    return payments.create({ user_id, amount, method })
  }
  getPaymentById = async (payment_id) => {
    const findPayment = await payments.findOne({ where: { payment_id } })
    if (!findPayment) {
      throw new Error('Payment not found')
    }
    return findPayment
  }
}
export default new PaymentService()
