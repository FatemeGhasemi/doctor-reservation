async function insertComment() {
    const commentSchema = require('../src/models/comment')()
    const mockData = require('./comment.json')
    for (let index = 0; index < mockData.length; index++) {
        const item = mockData[index]
        await commentSchema.create(item)
    }
}

module.exports = { insertComment}