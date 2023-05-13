const router = require('express').Router()
const { Op } = require('sequelize')
const { blogFinder } = require('../util/middleware')

const { Blog, User } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    where = {
      [Op.or]: [
        { title: { [Op.substring]: req.query.search}},
        { author: { [Op.substring]: req.query.search}}
      ]
    }
  }
  const blogs = await Blog.findAll({
    include: {
      model: User,
      attributes: ['name', 'username']
    },
    where,
    order: [
      ['likes', 'DESC']
    ]
  })
  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const blog = await Blog.build(req.body)
  blog.userId = user.id
  await blog.save()
  return res.json(blog)
})

router.put('/:id', blogFinder, async (req, res) => {
  const blog = req.blog
  const likes = req.body.likes
  if (blog) {
    blog.likes = likes
    await blog.save()
    return res.json(blog)
  } else {
    return res.status(404).end()
  }
})

router.delete('/:id', tokenExtractor, blogFinder, async (req, res) => {
  const blog = req.blog
  if (req.decodedToken.id != blog.userId) {
    res.status(403).json({ error: 'Not authorized: Only owner of blog can delete a blog'})
  }
  if (blog) {
    await blog.destroy()
    res.json(blog)
  } else {
    res.status(404).end()
  }
})

module.exports = router