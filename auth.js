import { Client } from "@okta/okta-sdk-nodejs";

const client = new Client({
    orgUrl: "https://dev-366955.okta.com",
    token: "004H3OHKdlgFEvr-T3wboGvQKLmRRgVUPDxjNVihzF"
});

export default { client };