import catchAsync from '../helpers/catchAsync.js'
import { CREATED, OK } from '@/core/success.js'
import accommodationService from '@/services/accommodation.js'

class AccommodationController {
  getAllAccommodations = catchAsync(async (req, res) => {
    OK(
      res,
      'Accommodations fetched successfully',
      await accommodationService.getAllAccommodations()
    )
  })

  getAccommodationById = catchAsync(async (req, res) => {
    OK(
      res,
      'Accommodation fetched successfully',
      await accommodationService.getAccommodationById(
        req.params.accommodation_id
      )
    )
  })

  createAccommodation = catchAsync(async (req, res) => {
    CREATED(
      res,
      'Accommodation created successfully',
      await accommodationService.createAccommodation(req.body)
    )
  })

  updateAccommodation = catchAsync(async (req, res) => {
    OK(
      res,
      'Accommodation updated successfully',
      await accommodationService.updateAccommodation(
        req.params.accommodation_id,
        req.body
      )
    )
  })

  deleteAccommodation = catchAsync(async (req, res) => {
    OK(
      res,
      'Accommodation deleted successfully',
      await accommodationService.deleteAccommodation(
        req.params.accommodation_id
      )
    )
  })

  addAccommodationToFavorite = catchAsync(async (req, res) => {
    CREATED(
      res,
      'Added accommodation to favorite',
      await accommodationService.addAccommodationToFavourites(
        req.user.user_id,
        req.body
      )
    )
  })
}

export default new AccommodationController()
