const { Blog, Session } = require('../models')
const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')

const blogFinder = async (req, _res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

const errorHandler = (error, _req, res, next) => {
  
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: 'ValidationError' + error.message })
  } else if (error.name === 'SequelizeValidationError') {
    return res.status(400).send({ error: 'SequelizeValidationError' + error.message })
  } else if (error.name === 'SequelizeDatabaseError') {
    return res.status(400).send({ error: 'SequelizeDatabaseError' + error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  }

  next(error)
}

const unknownEndpoint = (_req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
      const session = await Session.findOne({ where: { token: authorization.substring(7)}})
      if (!session) {
        return res.status(401).json({ error: 'token invalid' })
      }
    } catch (error){
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}


module.exports = {
  blogFinder,
  errorHandler,
  unknownEndpoint,
  tokenExtractor
}