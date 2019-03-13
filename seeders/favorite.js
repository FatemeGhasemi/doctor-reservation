async function insertFavorite() {
    const FavoriteSchema = require('../src/models/favorit')()
    const mockData = require('./city.json')
    for (let index = 0; index < mockData.length; index++) {
        const item = mockData[index]
        await FavoriteSchema.create(item)
    }
}

module.exports = {insertFavorite}