require('dotenv').config();

const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;
const SERVICE_URL = process.env.SERVICE_URL;

module.exports = {
    secret: 'TEST_SECRET',
    db_uri: MONGODB_CONNECTION_STRING,
    CASValidateURL: 'https://idp.rice.edu/idp/profile/cas/serviceValidate',
    thisServiceURL: SERVICE_URL,
    frontendURL: 'http://localhost:8080'
};