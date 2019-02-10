require('dotenv').config();
const db = require('../src/db/db')

db.initDb().then(() => {
    const categorySchema = require('../src/models/category')()

    categorySchema.create({parentName: "darmangaran",name:"dandan pezeshk"})
    categorySchema.create({parentName: "",name:"darmangaran"})
    categorySchema.create({parentName: "marakez darmani",name:"pezeshk motakhases"})
    categorySchema.create({parentName: "darmangaran",name:"pezeshk omomi"})

});
