import models from '@/models'
const { payments } = models
import { Api403Error } from '@/core/error'
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

  updatePayment = async ({payment_id}) => {

    const findPayment = await payments.findOne({ where: { payment_id } })
    if (!findPayment) {
      throw new Api403Error('Payment not found')
    }

    return payments.update({ where: { payment_id } })
  }
}
export default new PaymentService()
