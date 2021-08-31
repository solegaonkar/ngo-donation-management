const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

const TABLE = "DonationManagement";

const successResponse = (r) => {
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify(r),
    };
};

const errorResponse = (e) => {
    console.log(JSON.stringify(e));
    return {
        statusCode: 500,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify({ error: "What did you do?" }),
    };
};

exports.handler = async(event) => {
    console.log(JSON.stringify(event));
    if (event.httpMethod === "POST" && event.path === "/") {
        var body = JSON.parse(event.body);
        console.log(event.body);
        if (body.action === "GetDonorInfo") {
            var response = await ddb.get({
                    TableName: TABLE,
                    Key: {
                        context: `${body.data.ngo} donor`,
                        id: body.data.id
                    }
                }).promise()
                .then(r => {
                    return successResponse(r.Item);
                })
                .catch(e => errorResponse(e));
            console.log(JSON.stringify(response));
            return response;
        }
        else if (body.action === "UpdateDonorInfo") {
            var updateParams = {
                TableName: TABLE,
                Key: {
                    context: `${body.data.ngo} donor`,
                    id: body.data.donor.id
                },
                UpdateExpression: "set info = :info, contact = :contact, notes = :notes, origin = :origin",
                ExpressionAttributeValues: {
                    ":info": body.data.donor.info,
                    ":contact": body.data.donor.contact,
                    ":notes": body.data.donor.notes,
                    ":origin": body.data.donor.origin || { referral: "", drive: "", month: "" }
                }
            };
            var response = await ddb.update(updateParams).promise()
                .then(r => {
                    return successResponse(r);
                })
                .catch(e => errorResponse(e));
            return response;
        }
        else if (body.action === "CreateNewDonor") {
            console.log(body.data.id);
            var createParams = {
                TableName: TABLE,
                Item: body.data.donor
            };
            var response = await ddb.put(createParams).promise()
                .then(r => {
                    return successResponse(r);
                })
                .catch(e => errorResponse(e));
            return response;
        }
    }

    return errorResponse({ error: "Invalid Request" });
};
