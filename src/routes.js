const { Router } = require('express')
const AccountController = require('./controller/Account')
const accountController = new AccountController({})
const router = Router()


router.get('/account', accountController.find.bind(accountController))

router.post('/account/transaction', accountController.createTransaction.bind(accountController))
router.get('/account/:accountId/statement', accountController.getStatment.bind(accountController))

module.exports = router
