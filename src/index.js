require('dotenv').config();
const db = require('./db/db')
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

db.initDb().then(()=> {
    addRoutes();
    initSwagger();
    app.listen(process.env.PORT, () => {
        console.log("Example app listening at http://%s:%s", process.env.PORT)
    });
}).catch(e =>{
    console.log("Error init db ", e.message)
    throw e
})

function initSwagger() {
    const swaggerUi = require('swagger-ui-express');
    const swaggerDocument = require('./swager');
// Because production environment support ssl we should scheme of swaggerData to https to can load that in production
    if (process.env.NODE_ENVIRONMENT === 'production') {
        swaggerDocument.schemes = ['https'];
        app.use('/api-docsdjflhdjshflsjhnsjljcmslncksncscmmcasmka', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    } else app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log('swaggerDocument.schemes ', swaggerDocument.schemes);
}


function addRoutes() {
    app.use('/api/v1/users', require('./routers/v1/user'));
    app.use('/api/v1/getOtp', require('./routers/v1/login-register'));
    app.use('/api/v1/activation', require('./routers/v1/login-register'));

}


