const bcrypt = require('bcrypt')
const router = require('express').Router()

const { tokenExtractor } = require('../util/middleware')
const { User, Blog } = require('../models')

router.get('/', async (_req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['password']},
    include: {
      model: Blog
    }
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  const user = User.build(req.body)
  user.password = await bcrypt.hash(req.body.password, 10)
  await user.save()
  res.json(user)
})

router.put('/:username', tokenExtractor, async (req, res) => {
  if (req.decodedToken.username != req.params.username) {
    return res.status(403).json({ error: 'Not Authorized'})
  }
  const user = await User.findOne({ where: { username: req.params.username } })
  user.username = req.body.username
  await user.save()
  res.json(user)
  
})

router.get('/:id', async (req, res) => {
  const { read } = req.query;

  const where = { userId: req.params.id };
  if (read === 'true') {
    where.read = true;
  } else if (read === 'false') {
    where.read = false;
  }
  
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['password']},
    include: [{
      model: Blog
    },
    {
      model: Blog,
      as: 'readings',
      attributes: { exclude: ['userId'] },
      through: {
        attributes: ['read', 'id'],
        where,
      }
    }]
  })
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router