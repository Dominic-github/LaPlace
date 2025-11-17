import models from '@/models'

const { bookings } = models

class BookingService {
  createBooking = async ({
    user_id,
    accommodation_id,
    start_date,
    end_date
  }) => {
    return bookings.create({ user_id, accommodation_id, start_date, end_date })
  }

  getBookingById = async (booking_id) => {
    const findBooking = await bookings.findOne({ where: { booking_id } })
    if (!findBooking) {
      throw new Error('Booking not found')
    }
    return findBooking
  }
}

export default new BookingService()
