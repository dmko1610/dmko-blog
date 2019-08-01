const okta = require('@okta/okta-sdk-nodejs');


const client = new okta.Client({
    orgUrl: "https://dev-366955.okta.com",
    token: "004H3OHKdlgFEvr-T3wboGvQKLmRRgVUPDxjNVihzF"
});

module.exports = { client };