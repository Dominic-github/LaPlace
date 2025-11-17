import catchAsync from '../helpers/catchAsync.js'
import { CREATED, OK } from '@/core/success.js'

class BookingController {
  createBooking = catchAsync(async (req, res) => {
    CREATED(
      res,
      'Booking created successfully',
      await bookingService.createBooking(req.body)
    )
  })
  getBookingById = catchAsync(async (req, res) => {
    OK(
      res,
      'Booking retrieved successfully',
      await bookingService.getBookingById(req.params.booking_id)
    )
  })
  updateBooking = catchAsync(async (req, res) => {
    OK(
      res,
      'Booking updated successfully',
      await bookingService.updateBooking(req.params.booking_id, req.body)
    )
  })
  deleteBooking = catchAsync(async (req, res) => {
    OK(
      res,
      'Booking deleted successfully',
      await bookingService.deleteBooking(req.params.booking_id)
    )
  })
  getBookingsByUserId = catchAsync(async (req, res) => {
    OK(
      res,
      'Bookings retrieved successfully',
      await bookingService.getBookingsByUserId(req.params.user_id)
    )
  })
  getBookingsByAccommodationId = catchAsync(async (req, res) => {
    OK(
      res,
      'Bookings retrieved successfully',
      await bookingService.getBookingsByAccommodationId(
        req.params.accommodation_id
      )
    )
  })
}
export default new BookingController()
