import catchAsync from '../helpers/catchAsync.js'
import settingService from '@/services/setting.js'
import { StatusCodes } from 'http-status-codes'

class SettingController {
  // GET /api/settings — trả format cho Refine dataProvider
  getAllSettings = catchAsync(async (req, res) => {
    const result = await settingService.getAllSettings(req.query)
    res.status(StatusCodes.OK).json(result)
  })

  // GET /api/settings/group/:group
  getSettingsByGroup = catchAsync(async (req, res) => {
    const data = await settingService.getSettingsByGroup(req.params.group)
    res.status(StatusCodes.OK).json({ data })
  })

  // GET /api/settings/:id
  getOne = catchAsync(async (req, res) => {
    const data = await settingService.getById(req.params.id)
    res.status(StatusCodes.OK).json({ data })
  })

  // POST /api/settings
  createSetting = catchAsync(async (req, res) => {
    const data = await settingService.createSetting(req.body)
    res.status(StatusCodes.CREATED).json({ data })
  })

  // POST /api/settings/bulk — admin save all settings
  bulkUpdate = catchAsync(async (req, res) => {
    const { settings } = req.body
    const data = await settingService.bulkUpdate(settings)
    res.status(StatusCodes.OK).json({ data })
  })

  // PUT /api/settings/:id
  updateOne = catchAsync(async (req, res) => {
    const data = await settingService.updateById(req.params.id, req.body)
    res.status(StatusCodes.OK).json({ data })
  })

  // DELETE /api/settings/:id
  deleteOne = catchAsync(async (req, res) => {
    await settingService.deleteSetting(req.params.id)
    res.status(StatusCodes.OK).json({ data: { id: req.params.id } })
  })
}

export default new SettingController()
