const { Router } = require('express')
const UserController = require('./controller/User')

const userController = new UserController({})
const router = Router()

router.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API!' })
})

router.get('/user', userController.find.bind(userController))
router.post('/user', userController.create.bind(userController))
router.post('/user/auth', userController.auth.bind(userController))

module.exports = router