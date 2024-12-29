const User = require('../../models/User')

const saveUser = async ({
  user, repository
}) => {
  const result = await repository.create(user)

  return new User(result.toJSON())
}

module.exports = saveUser
