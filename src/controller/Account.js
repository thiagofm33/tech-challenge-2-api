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
      getCard: require('../feature/Card/getCard'),
    }, di)
  }

  async find(req, res) {
    const { accountRepository, getAccount, getCard, getTransaction, transactionRepository, cardRepository } = this.di

    try {
      const userId =   req.user.id
      const account = await getAccount({ repository: accountRepository,  userId })
      const transactions = await getTransaction({ filter: { accountId: account[0].id }, repository: transactionRepository })
      const cards = await getCard({ filter: { accountId: account[0].id }, repository: cardRepository })

      res.status(200).json({
        message: 'Conta encontrada carregado com sucesso',
        result: {
          account,
          transactions,
          cards,
        }
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

    const transactionDTO = new TransactionDTO({
      accountId,
      value,
      from,
      to,
      type,
      date: new Date()
    })

    try {
      const transaction = await saveTransaction({
        transaction: transactionDTO,
        repository: transactionRepository
      })

      res.status(201).json({
        message: 'Transação criada com sucesso',
        result: transaction
      })
    } catch (error) {
      res.status(422).json({
        message: 'Erro ao criar a transação!',
        result: error
      })
    }
  }

  async getStatment(req, res) {
    const { getTransaction, transactionRepository } = this.di
    const { accountId } = req.params

    try {
      const transactions = await getTransaction({
        filter: { accountId },
        repository: transactionRepository
      })

      res.status(200).json({
        message: 'Transações localizadas com sucesso',
        result: {
          transactions
        }
      })
    } catch(error) {
      res.status(500).json({
        message: 'Erro ao carregar transações!',
        result: error
      })
    }
  }
}

module.exports = AccountController