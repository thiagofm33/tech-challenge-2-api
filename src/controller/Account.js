const userDTO = require('../models/User')
const accountDTO = require('../models/Account')
const cardDTO = require('../models/Card')
const TransactionDTO = require('../models/DetailedAccount')


class AccountController {
  constructor(di = {}) {
    this.di = Object.assign({
      userRepository: require('../infra/mongoose/repository/userRepository'),
      accountRepository: require('../infra/mongoose/repository/accountRepository'),
      cardRepository: require('../infra/mongoose/repository/cardRepository'),
      transactionRepository: require('../infra/mongoose/repository/detailedAccountRepository'),

      saveCard: require('../feature/Card/saveCard'),
      salvarUsuario: require('../feature/User/salvarUsuario'),
      saveAccount: require('../feature/Account/saveAccount'),
      getUser: require('../feature/User/getUser'),
      getAccount: require('../feature/Account/getAccount'),
      saveTransaction: require('../feature/Transaction/saveTransaction'),
      getTransaction: require('../feature/Transaction/getTransaction'),
    }, di)
  }

  async create(req, res) {
    const user = new userDTO(req.body)
    const { userRepository, accountRepository, cardRepository, salvarUsuario, saveAccount, saveCard } = this.di

    if (!user.isValid()) return res.status(400).json({ 'message': 'não houve informações enviadas' })
    try {
      const userCreated = await salvarUsuario({
        user, repository: userRepository
      })

      const accountCreated = await saveAccount({ account: new accountDTO({ userId: userCreated.id, type: 'Debit' }), repository: accountRepository })

      const firstCard = new cardDTO({ 
        type: 'GOLD',
        number: 13748712374891010 ,
        dueDate: '2027-01-07',
        functions: 'Debit',
        cvc: '505',
        paymentDate: null,
        name: userCreated.username,
        accountId: accountCreated.id,
        type: 'Debit' 
      })

      const cardCreated = await saveCard({ card: firstCard, repository: cardRepository })

      res.status(201).json({
        message: 'usuário criado com sucesso',
        result: userCreated,
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'caiu a aplicação' })
    }

  }
  async find(req, res) {
    const { accountRepository, getAccount } = this.di

    try {
    const userId =   req.user.id
      const account = await getAccount({ repository: accountRepository,  userId })
      const transactions = await 
      res.status(200).json({
        message: 'Conta encontrada carregado com sucesso',
        result: account
      })
    } catch (error) {
      res.status(500).json({
        message: 'Erro no servidor'
      })
    }
    
  }

  async createTransaction(req, res) {
    const { saveTransaction, transactionRepository } = this.di
    const { accountId, value, type, from, to } = req.body
    const transactionDTO = new TransactionDTO({ accountId, value, from, to,  type, date: new Date() })

    const transaction = await saveTransaction({ transaction: transactionDTO, repository: transactionRepository })
    
    res.status(201).json({
      message: 'Transação criada com sucesso',
      result: transaction
    })
  }

  async getStatment(req, res) {
    const { getTransaction, transactionRepository } = this.di

    const { accountId } = req.params

    const transactions = await getTransaction({accountId,  repository: transactionRepository})
    res.status(201).json({
      message: 'Transação criada com sucesso',
      result: {
        transactions
      }
    })
  }
}

module.exports = AccountController