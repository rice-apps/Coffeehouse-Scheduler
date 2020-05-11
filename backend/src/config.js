require('dotenv').config();

/**
 * dotenv is a dependency that parses for a locally stored .env file 
 * and stores the variables to be accessed via process.env.
 * You need to set up a local .env file which contains the following 
 * environment variables:
      secret: 
      db_uri: 
      CASValidateURL: 
      thisServiceURL: 
      frontendURL: 
 */

const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;
const SERVICE_URL = process.env.SERVICE_URL;

module.exports = {
    secret: 'TEST_SECRET',
    MONGODB_CONNECTION_STRING: MONGODB_CONNECTION_STRING,
    CASValidateURL: 'https://idp.rice.edu/idp/profile/cas/serviceValidate',
    thisServiceURL: SERVICE_URL,
    frontendURL: 'http://localhost:8080'
};