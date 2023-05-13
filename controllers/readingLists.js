const router = require('express').Router()

const { tokenExtractor } = require('../util/middleware')
const { Readinglist } = require('../models')

router.post('/', tokenExtractor, async (req, res) => {
  if (req.decodedToken.id != req.body.user_id) {
    console.log(req.decodedToken.id, req.body.user_id, 'here')
    
    return res.status(403).json({ error: 'Not Authorized' })
  }
  const userId = req.body.user_id
  const blogId = req.body.blog_id
  const reading = await Readinglist.create({ userId, blogId})
  res.json(reading)
})

router.put('/:id', tokenExtractor, async (req, res) => {
  const reading = await Readinglist.findByPk(req.params.id)
  if (req.decodedToken.id != reading.userId) {
    return res.status(403).json({ error: 'Not authorized' })
  }
  reading.read = req.body.read
  await reading.save()
  return res.json(reading)

})

module.exports = router