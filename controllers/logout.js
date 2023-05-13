const { tokenExtractor } = require('../util/middleware')
const router = require('express').Router()

const { Session } = require('../models')

router.post('/', tokenExtractor, async (request, response) => {
  await Session.destroy({
    where: {
      userId: request.decodedToken.id
    }
  })

  response.status(200)
})

module.exports = router