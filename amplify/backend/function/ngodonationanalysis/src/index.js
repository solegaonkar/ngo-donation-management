const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient();

// VSM hardcoded For now. Later pick this from the event.
const org = "vsm";
const TABLE = "DonationManagement";
const EDGE_THRESHOLD = 350 * 86400 * 1000;
const ARCHIVE_THRESHOLD = 380 * 86400 * 1000;
const CONTEXT = `${org} donor`;

const NOW = Date.now();

const donors = {};

const loadDonors = async() => {
    var p1 = await ddb.get({
        TableName: TABLE,
        Key: { context: CONTEXT, id: "active" }
    }).promise().then(response => {
        donors.active = response.Item.donorList;
    });
    var p2 = await ddb.get({
        TableName: TABLE,
        Key: { context: CONTEXT, id: "edge" }
    }).promise().then(response => {
        donors.edge = response.Item.donorList;
    });
    await Promise.all([p1, p2]);
    donors.newActive = [];
    donors.newEdge = [];
};

const processEdgeDonor = async(id) => {
    // Check the last donation date, total donation, previous trend, response to reminders... to classify if this donor is stale
    var response = await ddb.get({
        TableName: TABLE,
        Key: { context: CONTEXT, id: id }
    }).promise();
    var donor = response.Item;
    if (donor) {
        // Check last activity - 
        var lastDonationDate = donor.influence.lastDonationDate;
        if (donor.donation.lastDonationDate > lastDonationDate) {
            lastDonationDate = donor.donation.lastDonationDate;
        }
        if (NOW - lastDonationDate > ARCHIVE_THRESHOLD) {
            // Remove from the edge list and forget about it.
            donor.edge = donor.edge.filter(a => a!=id);
        }
    }
};

const processActiveDonor = async(id) => {
    // Based on the time since last donation and previous trend.. classify as monthly, quarterly, biannual, annual, or edge
    var response = await ddb.get({
        TableName: TABLE,
        Key: { context: CONTEXT, id: id }
    }).promise();
    var donor = response.Item;
    if (donor) {
        // Check last activity - 
        var lastDonationDate = donor.influence.lastDonationDate;
        if (donor.donation.lastDonationDate > lastDonationDate) {
            lastDonationDate = donor.donation.lastDonationDate;
        }
        if (NOW - lastDonationDate > ARCHIVE_THRESHOLD) {
            // Remove from the edge list and forget about it.
            donor.edge = donor.edge.filter(a => a!=id);
        }
    }
};

const updateDbStats = async() => {
    // Collate the edge, new edge, active and new active.. and put them back to DB.
    donors.edge = donors.edge.push(...donors.newEdge);
    donors.active = donors.active.push(...donors.active);

    var p1 = ddb.update({
        TableName: TABLE,
        Key: { context: CONTEXT, id: "edge" },
        UpdateExpression: "set donorList = :l",
        ExpressionAttributeValues: {
            ":l": donors.edge
        }
    }).promise();
    var p2 = ddb.update({
        TableName: TABLE,
        Key: { context: CONTEXT, id: "active" },
        UpdateExpression: "set donorList = :l",
        ExpressionAttributeValues: {
            ":l": donors.active
        }
    }).promise();
    await Promise.all([p1, p2]);
};

const processEdge = async() => {
    var promiseList = [];
    donors.edge.forEach(id => {
        promiseList.push(processEdgeDonor(id));
    });
    await Promise.all(promiseList);
};

const processActive = async() => {
    var promiseList = [];
    donors.edge.forEach(id => {
        promiseList.push(processActiveDonor(id));
    });
    await Promise.all(promiseList);
};

const handleError = async(e) => {

};

exports.handler = async(event) => {
    var success = true;
    var error = null;
    await loadDonors().catch(e => {
        error = e;
        success = false;
    });
    if (!success) {
        return handleError("loadDonors", error);
    }

    // Process Edge and Active cannot be concurrent.
    // Process Active will create edge records - that 
    // will interfere with edge processing.
    // It is good to pull out both in the begining 
    // so we do not process the same record twice.
    var p1 = processEdge().catch(e => {
        error = e;
        success = false;
        handleError("processEdge", error);
    });

    var p2 = processActive().catch(e => {
        error = e;
        success = false;
        handleError("processActive", error);
    });
    
    await Promise.all([p1, p2]);
    await updateDbStats();

    return {
        statusCode: 200,
        body: JSON.stringify('Success')
    };
};
