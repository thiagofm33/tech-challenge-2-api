const DetailedAccountModel = require("../../models/DetailedAccount")

const getTransaction = async ({
  transactionFilter, repository
}) => {
  const result = await repository.get(transactionFilter)
  return result?.map(transaction => new DetailedAccountModel(transaction))
}

module.exports = getTransaction