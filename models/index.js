const Blog = require('./blog')
const User = require('./user')
const Readinglist = require('./readingList')
const Session = require('./sessions')

User.hasMany(Blog)
Blog.belongsTo(User)

User.hasMany(Session)
Session.belongsTo(User)

User.belongsToMany(Blog, { through: Readinglist, as: 'readings' })
Blog.belongsToMany(User, { through: Readinglist, as: 'usersMarked' })

module.exports = {
    Blog,
    User,
    Readinglist,
    Session
}