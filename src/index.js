require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swager');


// Because production environment support ssl we should scheme of swaggerData to https to can load that in production
if (process.env.NODE_ENVIRONMENT === 'production') {
    swaggerDocument.schemes = ['https'];
    app.use('/api-docsdjflhdjshflsjhnsjljcmslncksncscmmcasmka', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
console.log('swaggerDocument.schemes ', swaggerDocument.schemes);


app.use('/api/v1/users', require('./routers/v1/user'));
app.use('/api/v1/getOtp', require('./routers/v1/login-register'));

app.listen(process.env.PORT, () => {
    console.log("Example app listening at http://%s:%s", process.env.PORT)
});
