import catchAsync from '../helpers/catchAsync.js'
import { CREATED, OK } from '@/core/success.js'
import messageService from '@/services/message.js'

class MessageController {
  generateResponse = catchAsync(async (req, res) => {
    const { message } = req.body
    const response = await gemini.generateResponse(message)
    OK(res, 'Response generated successfully', response)
  })
  getMessages = catchAsync(async (req, res) => {
    const messages = await messageService.getMessages(req.query)
    OK(res, 'Messages fetched successfully', messages)
  })
  getMessageById = catchAsync(async (req, res) => {
    const message = await messageService.getMessageById(req.params.id)
    OK(res, 'Message fetched successfully', message)
  })
  deleteMessage = catchAsync(async (req, res) => {
    await messageService.deleteMessage(req.params.id)
    OK(res, 'Message deleted successfully')
  })
  updateMessage = catchAsync(async (req, res) => {
    const message = await messageService.updateMessage(req.params.id, req.body)
    OK(res, 'Message updated successfully', message)
  })
}
export default new MessageController()
