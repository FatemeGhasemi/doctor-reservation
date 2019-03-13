require('dotenv').config();
const db = require('./db/db')
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());


/**
 *
 */
db.initDb().then(() => {
    addRoutes();
    initSwagger();
    app.listen(process.env.PORT, () => {
        console.log("Example app listening at http://%s:%s", process.env.PORT)
        if (process.env.IS_MOCK === 'true') console.log('Mock mode ....')
    });
}).catch(e => {
    console.log("Error init db ", e.message)
    throw e
});


/**
 *
 */
const initSwagger=()=> {
    const swaggerUi = require('swagger-ui-express');
    const swaggerDocument = require('./swager');
// Because production environment support ssl we should scheme of swaggerData to https to can load that in production
    if (process.env.NODE_ENVIRONMENT === 'production') {
        swaggerDocument.schemes = ['https'];
        app.use('/api-docsdjflhdjshflsjhnsjljcmslncksncscmmcasmka', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    } else app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log('swaggerDocument.schemes ', swaggerDocument.schemes);
}


/**
 *
 */
function addRoutes() {
    app.use('/api/v1/users', require('./routers/v1/user'));
    app.use('/api/v1/getOtp', require('./routers/v1/login-register'));
    app.use('/api/v1/activation', require('./routers/v1/login-register'));
    app.use('/api/v1/doctors', require('./routers/v1/doctor'));
    app.use('/api/v1/categories', require('./routers/v1/category'));
    app.use('/api/v1/secretaries', require('./routers/v1/secretary'));
    app.use('/api/v1/offices', require('./routers/v1/office'));
    app.use('/api/v1/reserves', require('./routers/v1/reserve'));
    app.use('/api/v1/reservations', require('./routers/v1/reservation'));
    app.use('/api/v1/secretaryApproved', require('./routers/v1/active-secretary'));
    app.use('/api/v1/list-of-secretaries', require('./routers/v1/active-secretary'));
    app.use('/api/v1/doctor-profile',require('./routers/v1/get-doctor-profile'));
    app.use('/api/v1/listOfFreeTimes',require('./routers/v1/show-doctor-list-of-rserves'));
    app.use('/api/v1/advertises', require('./routers/v1/advertise'));
    app.use('/api/v1/galleries', require('./routers/v1/gallery'));
    app.use('/api/v1/doctor-registration', require('./routers/v1/doctor-registration'));
    app.use('/api/v1/cities', require('./routers/v1/city'));
    app.use('/api/v1/send-user-reserve-data', require('./routers/v1/reserve-data-sender'));
}


