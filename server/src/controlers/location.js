import catchAsync from '../helpers/catchAsync.js'
import { OK } from '@/core/success.js'
import locationService from '@/services/location.js'

class LocationController {
  getProvinces = catchAsync(async (req, res) => {
    OK(res, 'Provinces fetched successfully', await locationService.getProvinces())
  })

  getProvinceByCode = catchAsync(async (req, res) => {
    OK(res, 'Province fetched successfully', await locationService.getProvinceByCode(req.params.code_name))
  })

  getWardsByProvince = catchAsync(async (req, res) => {
    OK(res, 'Wards fetched successfully', await locationService.getWardsByProvince(req.params.province_code))
  })
}

export default new LocationController()
