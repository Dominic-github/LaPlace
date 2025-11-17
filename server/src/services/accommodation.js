import modles from '@/models'
import { Api403Error } from '@/core/error'

const { accommodations, favorites } = models

class AccommodationService {
  getAccommodationById = async (accommodation_id) => {
    const findAccommodation = await accommodations.findOne({
      where: { accommodation_id }
    })
    if (!findAccommodation) {
      throw new Error('Accommodation not found')
    }
    return findAccommodation
  }

  createAccommodation = async ({ name, location, description }) => {
    return accommodations.create({ name, location, description })
  }

  updateAccommodation = async (accommodation_id, data) => {
    const findAccommodation = await accommodations.findOne({
      where: { accommodation_id }
    })
    if (!findAccommodation) {
      throw new Error('Accommodation not found')
    }
    return accommodations.update(data, { where: { accommodation_id } })
  }

  deleteAccommodation = async (accommodation_id) => {
    const findAccommodation = await accommodations.findOne({
      where: { accommodation_id }
    })
    if (!findAccommodation) {
      throw new Error('Accommodation not found')
    }
    return accommodations.destroy({ where: { accommodation_id } })
  }

  addAccommodationToFavourites = async (user_id, accommodation_id) => {
    const favorite = await favorites.create({ user_id, accommodation_id })
    if (!favorite) {
      throw new Api403Error('Could not add to favorites')
    }

    return favorite
  }
}

export default new AccommodationService()
