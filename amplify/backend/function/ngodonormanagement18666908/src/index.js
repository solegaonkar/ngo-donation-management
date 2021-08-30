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
        body: JSON.stringify({error: "What did you do?"}),
    };
};

exports.handler = async(event) => {
    console.log(JSON.stringify(event));
    if (event.httpMethod === "POST" && event.path === "/") {
        var body = JSON.parse(event.body);
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
    }

    return errorResponse({ error: "Invalid Request" });
};
