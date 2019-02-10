require('dotenv').config();
const db = require('../src/db/db')

db.initDb().then(() => {
    const categorySchema = require('../src/models/category')()

    categorySchema.create({parentName: null,displayName:"درمانگران",name:"darmangaran"})
    categorySchema.create({parentName: "darmangaran",displayName:"دندانپزشکی",name:"dandanPezeshk"})
    categorySchema.create({parentName: "dandanPezeshk",displayName:"",name:"pezeshk motakhases"})
    categorySchema.create({parentName: "darmangaran",displayName:"",name:"pezeshkOmumi"})

});
