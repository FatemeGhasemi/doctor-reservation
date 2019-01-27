require('dotenv').config();

let userSchemaInstance
const db = require('./db/db')

const getUserSchema = async () => {
    if (userSchemaInstance) return userSchemaInstance
    const sequelize = await db.getInstance();
    const userSchema = require('./models/user')(sequelize);
    userSchemaInstance = userSchema.initUserSchema();
    return userSchemaInstance
};

const init = async ()=>{
    const userSchema = await getUserSchema();
    await userSchema.sync({force: true})



}

init()