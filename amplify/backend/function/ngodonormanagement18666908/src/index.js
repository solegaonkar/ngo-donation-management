const AWS = require('aws-sdk');

const util = require('./util');
const Donation = require('./donation');
const Donor = require('./donor');

const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async(event) => {
    console.log(JSON.stringify(event));
    if (event.httpMethod === "POST" && event.path === "/") {
        var body = JSON.parse(event.body);

        // You might want to change this in prod - to unconditionally take current time.
        if (!body.now) 
            body.now = Date.now() / 1000;

        if (body.action === "GetDonorInfo") {
            return await new Donor({ddb, now: body.now}).getDonorInfo(body);
        }
        else if (body.action === "UpdateDonorInfo") {
            return await new Donor({ddb, now: body.now}).updateDonor(body);
        }
        else if (body.action === "CreateNewDonor") {
            return await new Donor({ddb, now: body.now}).createDonor(body);
        }
        else if (body.action === "CreateNewDonation") {
            return await new Donation({ddb, now: body.now}).processDonation(body);
        }
    }

    return util.errorResponse({ error: "Invalid Request" });
};
