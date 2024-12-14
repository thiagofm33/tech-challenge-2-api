const DetailedAccountModel = require("../../models/DetailedAccount")

const saveTransaction = async ({
    transaction, repository
}) => {
  const resultado = await repository.create(transaction)
  return new DetailedAccountModel(resultado.toJSON())
}

module.exports = saveTransaction