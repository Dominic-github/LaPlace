import catchAsync from '../helpers/catchAsync.js'
import { CREATED, OK } from '@/core/success.js'
import messageService from '@/services/message.js'

class MessageController {
  create = catchAsync(async (req, res) => {})
  update = catchAsync(async (req, res) => {})
  delete = catchAsync(async (req, res) => {})
  get = catchAsync(async (req, res) => {})
}
export default new MessageController()
