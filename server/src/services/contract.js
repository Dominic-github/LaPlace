import models from '@/models'

const { contracts } = models

class ContractService {
  createContract = async ({
    tenant_id,
    landlord_id,
    property_id,
    start_date,
    end_date,
    terms
  }) => {
    const newContract = await contracts.create({
      tenant_id,
      landlord_id,
      property_id,
      start_date,
      end_date,
      terms
    })
    return newContract
  }

  updateContract = async (contract_id, updateData) => {
    const contract = await contracts.findByPk(contract_id)
    if (!contract) {
      throw new Error('Contract not found')
    }
    await contract.update(updateData)
    return contract
  }

  getContractById = async (contract_id) => {
    const contract = await contracts.findByPk(contract_id)
    if (!contract) {
      throw new Error('Contract not found')
    }
    return contract
  }

  deleteContract = async (contract_id) => {
    const contract = await contracts.findByPk(contract_id)
    if (!contract) {
      throw new Error('Contract not found')
    }
    await contract.destroy()
    return contract
  }
}

export default new ContractService()
