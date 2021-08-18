const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

const util = require('util');
const execFile = util.promisify(require('child_process').execFile);

const { nanoid } = require('nanoid');
const fs = require('fs');

const TABLE = "DonationManagement";

const INDEX_CONTEXT = "vsm donor index";
const VSM_DONOR_CONTEXT = "vsm donor";
const VSM_DONATION_CONTEXT = "vsm donation";
const VSM_MASTER_STATS = "vsm master stats";

const log = (s) => {
    console.log(s);
};

var donorIdMap = {};

/**
 * Clear the phone number remove any non numeric characters,. 
 * Remove leading zeros.
 * */
const cleanPhoneNumber = (p) => {
    // Remove special characters
    p = p.replace(/[^0-9]/g, " ");
    p = p.replace(/\s+/g, " ").trim();

    // If leading 0, remove the ISD code
    if (p[0] == "0") {
        var a = p.split(" ");
        if (a.length > 1) {
            a.shift();
            p = a.join("");
        }
        else {
            p = p.substring(1);
        }
    }
    // Remove spaces
    return p.replace(/\s+/g, "");
};


const sortFilterIds = (idList, minCount) => {
    var countMap = {};
    idList.forEach(e => {
        countMap[e] = countMap[e] ? countMap[e] + 1 : 1;
    });
    return Object.keys(countMap).filter(key => countMap[key] >= minCount).sort((a, b) => countMap[a] - countMap[b]);
};


const getBestMatch = (idList, minCount) => {
    idList = sortFilterIds(idList, minCount);
    return idList.length > 0 ? idList[0] : "";
};

/**
 * Add the index entry for the given key and donor id.
 * Check if an entry exists for that key, if so, append to the array.
 * Does not check for duplicate id's . That should be ok for a small data load.
 * */
const addIndexEntry = async(key, donorId) => {
    if (!key || key.length < 3)
        return;
    key = key.toLowerCase().replace(/[^a-z0-9\@]/, "");
    var response = await ddb.get({ TableName: TABLE, Key: { "context": INDEX_CONTEXT, "id": key } }).promise();
    if (response["Item"]) {
        await ddb.update({
            TableName: TABLE,
            Key: {
                context: INDEX_CONTEXT,
                id: key
            },
            UpdateExpression: "set donorIds = list_append(donorIds, :id)",
            ExpressionAttributeValues: {
                ":id": [donorId]
            }
        }).promise();
    }
    else {
        await ddb.put({
            TableName: TABLE,
            Item: {
                context: INDEX_CONTEXT,
                id: key,
                donorIds: [donorId]
            }
        }).promise();
    }
};

const searchByIndexList = async(list) => {
    log("Searching: " + JSON.stringify(list));
    var promiseList = [];
    var idList = [];
    list.forEach(s => {
        if (s.length > 2) {
            s = s.toLowerCase().replace(/[^a-z0-9\@]/, "");
            var p = ddb.get({
                TableName: TABLE,
                Key: {
                    context: INDEX_CONTEXT,
                    id: s
                }
            }).promise().then(response => {
                if (response.Item)
                    idList.push(...response.Item.donorIds);
            });
            promiseList.push(p);
        }
    });
    await Promise.all(promiseList);
    return idList;
};

/**
 * Get the ID of source - based on names
 * Build promise list of all searches. Then update the data.
 * */
const getSourceId = async(source) => {
    source = source.toLowerCase().replace(/[^a-z0-9\s]/, "");
    var idList = await searchByIndexList(source.split(" "));
    return getBestMatch(idList, 2);
};


/**
 *  Add donor id to the influencer
 * */
const addToSourceRecord = async(source, id) => {
    if (source.length > 2) {
        log("Updating Influence: " + source + ":" + id);
        await ddb.update({
            TableName: TABLE,
            Key: {
                context: VSM_DONOR_CONTEXT,
                id: source
            },
            UpdateExpression: "set influence.ids = list_append(influence.ids, :id)",
            ExpressionAttributeValues: {
                ":id": [id]
            }
        }).promise();
    }
};

const getDonorRecord = async(id) => {
    return ddb.get({
        TableName: TABLE,
        Key: {
            context: VSM_DONOR_CONTEXT,
            id: id
        }
    }).promise().then(r => r.Item);
};
/** 
 * Add donor to the DB
 * */
const addDonor = async(d) => {
    // Check if the donor exists in DB - based  on the email / phone. If so.. return the donor id.
    // If not.. add a new one
    var promiseList = [];
    var idList = await searchByIndexList([...d.contact.email, ...d.contact.phone], 2);
    var idFound = getBestMatch(idList, 2);

    if (idFound) {
        var oldDonor = await getDonorRecord(idFound);

        console.log("!!!!!!!!!!!!!!!!!!!!! Merging Records !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        console.log("ID: " + idFound);
        if (d.info.pan) {
            oldDonor.info.pan = d.info.pan;
            await addIndexEntry(d.info.pan, d.id);
        }
        if (d.info.isVip) {
            oldDonor.info.isVip = d.info.isVip;
        }
        if (d.info.isCompany) {
            oldDonor.info.isCompany = d.info.isCompany;
        }
        await ddb.put({
            TableName: TABLE,
            Item: oldDonor
        }).promise();
        return idFound;
    }
    else {
        d["id"] = nanoid();
        d["context"] = VSM_DONOR_CONTEXT;
    }
    // Check the source donor.. based on the name in the notes.. if so.. set the source id 
    // Also update the influence record in the source donor
    promiseList = [];
    if (d.source) {
        d.source = await getSourceId(d["source"]);
        promiseList.push(addToSourceRecord(d.source, d.id));
    }


    promiseList.push(ddb.put({ TableName: TABLE, Item: d }).promise());

    d.contact.email.forEach(e => {
        promiseList.push(addIndexEntry(e, d.id));
    });
    d.contact.phone.forEach(e => {
        promiseList.push(addIndexEntry(e, d.id));
    });
    d.info.name.split(" ").forEach(e => {
        promiseList.push(addIndexEntry(e, d.id));
    });
    if (d.info.pan) {
        promiseList.push(addIndexEntry(d.info.pan, d.id));
    }
    await Promise.all(promiseList);

    return d.id;
};


const processContact = (x) => {
    var contact = {};
    var address = "";
    if (x["address1"])
        address = address + x["address1"];
    if (x["address2"])
        address = address + x["address2"];
    if (x["address3"])
        address = address + x["address3"];
    contact["address"] = address;

    var pinf = address.match(/\d\d\d\d\d\d/);
    if (pinf) {
        contact["pin"] = pinf[0];
    }
    else {
        if (x["district"])
            contact["district"] = x["district"];
        if (x["city"])
            contact["city"] = x["city"];
    }
    contact["email"] = [];
    if (x["email"])
        contact.email.push(x["email"]);
    contact["phone"] = [];
    if (x["mobile"])
        contact["phone"].push(cleanPhoneNumber(x["mobile"]));
    if (x["altnumber"])
        contact["phone"].push(cleanPhoneNumber(x["altnumber"]));
    if (x["landline"])
        contact["phone"].push(cleanPhoneNumber(x["landline"]));
    return contact;
};

const processDonor = async(x) => {
    var j = {};

    j["donation"] = { "amount": 0, "ids": [] };
    j["influence"] = { "amount": 0, "ids": [] };

    var info = {};

    info["name"] = `${x["fname"]} ${x["mname"]} ${x["lname"]}`;
    info["name"] = info["name"].replace(/\s+/g, " ");

    if (x.pancard) {
        const { stdout } = await execFile("/home/ec2-user/environment/vsmdata/decrypt.php", [x.pancard]);
        info.pan = stdout;
    }
    if (x["iscompany"] == "yes")
        info["isCompany"] = true;
    if (x["isvip"] == "yes")
        info["isVip"] = true;

    j["contact"] = processContact(x);
    j["source"] = x["details"];
    j["notes"] = x["details"];

    j["info"] = info;
    if (x["createdon"]) {
        j["createDate"] = x["createdon"].split(" ")[0];
        j["createDate"] = Date.parse(j["createDate"]);
    }
    var id = await addDonor(j);
    return id;
};


const extractVolunteer = async(x) => {
    var j = {};
    j["context"] = VSM_DONOR_CONTEXT;
    j["id"] = nanoid();
    var i = {};
    i["name"] = `${x["fstnm"]} ${x["mdlnm"]} ${x["lstnm"]}`;
    i["name"] = i["name"].replace(/\s+/g, " ");
    if (x["birth_dt"])
        i["birthday"] = x["birth_dt"];
    i["isVolunteer"] = true;
    j["info"] = i;
    var c = {};
    c["address"] = `${x["addr1"]} ${x["addr2"]} ${x["addr3"]}`;
    c["address"] = c["address"].replace(/\s+/g, " ").trim();
    if (x.pincode && x.pincode !== "0") {
        c["pin"] = x["pincode"];
    }
    else {
        var pinf = c.address.match(/\d\d\d\d\d\d/);
        if (pinf) {
            c["pin"] = pinf[0];
        }
    }
    c["email"] = [];
    if (x["email"])
        c["email"].push(x["email"]);
    if (x["aemail"])
        c["email"].push(x["aemail"]);
    c["phone"] = [];
    if (x["mblno"])
        c["phone"].push(cleanPhoneNumber(x["mblno"]));
    if (x["amblno"])
        c["phone"].push(cleanPhoneNumber(x["amblno"]));
    j["contact"] = c;
    j["source"] = await getSourceId(x["referalname"]);
    j["notes"] = x["referalname"];
    j["donation"] = { "amount": 0, "ids": [] };
    j["influence"] = { "amount": 0, "ids": [] };
    return j;
};


const extractDonation = (x) => {
    var j = {};
    j["context"] = VSM_DONATION_CONTEXT;
    j["id"] = x["tdate"].replace(/\-/g, "") + " " + nanoid();
    j["mode"] = x["modeofpay"];
    j["amount"] = parseInt(x["amount"]);
    j["time"] = Date.parse(x["tdate"]);
    j["receipt"] = x["receipt"];
    j["notes"] = `${x["reference"]} ${x["kname"]} ${x["reason"]} ${x["otherreason"]} ${x["remarks"]}`;
    j["notes"] = j["notes"].replace(/\s+/g, " ");
    j["corpus"] = x["donationtype"] == "Corpus";
    j["donor"] = donorIdMap[x["did"]];
    return j;
};

const updateInfluencer = async(source, amount) => {
    if (source) {
        log("Updating influencer: " + source + ":" + amount);
        var response = await ddb.update({
            TableName: TABLE,
            Key: {
                context: VSM_DONOR_CONTEXT,
                id: source
            },
            UpdateExpression: "set influence.amount = influence.amount + :a",
            ExpressionAttributeValues: {
                ":a": amount
            },
            ReturnValues: "ALL_NEW"
        }).promise();

        // Enable this if you want to measure cascading influence. 
        // Else that can be calculated on the fly. Not too many reads.
        // But If you do this, there is no way to get back the immediate individual influence.
        // So disabled it for now.
        // await updateInfluencer(response.Attributes.source);
    }
};

const updateDonor = async(d) => {
    if (d.donor) {
        var response = await ddb.update({
            TableName: TABLE,
            Key: {
                context: VSM_DONOR_CONTEXT,
                id: d.donor
            },
            UpdateExpression: "set donation.amount = donation.amount + :a, donation.ids = list_append(donation.ids, :id), donation.last = :time",
            ExpressionAttributeValues: {
                ":a": d.amount,
                ":id": [d.id],
                ":time": d.time
            },
            ReturnValues: "ALL_NEW"
        }).promise();
        var source = response.Attributes.source;
        if (!response.Attributes.donation.first) {
            await ddb.update({
                TableName: TABLE,
                Key: {
                    context: VSM_DONOR_CONTEXT,
                    id: d.donor
                },
                UpdateExpression: "set donation.first = :time",
                ExpressionAttributeValues: {
                    ":time": d.time
                },
                ReturnValues: "ALL_NEW"
            }).promise();
        }
        await updateInfluencer(source, d.amount);
    }
    else {
        log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        log("Donation without Donor!!");
        log(JSON.stringify(d));
        log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n");
    }
};

const createDonationStatistics = async(masterStats) => {
    var promiseList = [];
    Object.keys(masterStats).forEach(m => {
        var month = {};
        month.context = VSM_MASTER_STATS;
        month.id = m;
        month.stats = masterStats[m];
        var p = ddb.put({
            TableName: TABLE,
            Item: month
        }).promise();
        promiseList.push(p);
    });
    await Promise.all(promiseList);
};

const loadDonations = async() => {
    var masterStats = {};
    var content = fs.readFileSync("donations.json", "utf8");
    content = JSON.parse(content);
    for (var c of content) {
        var d = extractDonation(c);
        // Update Donor
        await updateDonor(d);
        // Add Donation Record
        await ddb.put({
            TableName: TABLE,
            Item: d
        }).promise();
        // Update Master Statistics
        var day = c["tdate"].replace(/\-/g, "");
        var month = c["tdate"].replace(/\-/g, "").substring(0, 6);
        if (!masterStats[month])
            masterStats[month] = {};
        if (!masterStats[month][day.substring(6)]) {
            masterStats[month][day.substring(6)] = { count: 0, amount: 0 };
        }
        masterStats[month][day.substring(6)].amount = masterStats[month][day.substring(6)].amount + d.amount;
        masterStats[month][day.substring(6)].count = masterStats[month][day.substring(6)].count + 1;
    }
    await createDonationStatistics(masterStats);
};

const loadVolunteers = async() => {
    var content = fs.readFileSync("volunteers.json", "utf8");
    content = JSON.parse(content);
    for (var c of content) {
        var v = await extractVolunteer(c);
        if (v.source) {
            await addToSourceRecord(v.source, v.id);
        }
        await addDonor(v);
    }
};

const loadDonors = async() => {
    var content = fs.readFileSync("donors.json", "utf8");
    content = JSON.parse(content);
    for (var c of content) {
        var id = await processDonor(c);
        donorIdMap[c.did] = id;
    }
    fs.writeFileSync("donorMap.json", JSON.stringify(donorIdMap));
};


const deleteRecords = async(context) => {
    var promiseList = [];
    await ddb.query({
        TableName: TABLE,
        KeyConditionExpression: 'context = :c',
        ExpressionAttributeValues: {
            ':c': context
        },
        ProjectionExpression: "id",
    }).promise().then(response => {
        //console.log(JSON.stringify(response));
        response.Items.forEach(item => {
            var p = ddb.delete({
                TableName: TABLE,
                Key: {
                    context: context,
                    id: item.id
                }
            }).promise();
            promiseList.push(p);
        });
    });
    await Promise.all(promiseList);
};

const deleteAll = async() => {
    await deleteRecords(VSM_DONATION_CONTEXT);
    log(VSM_DONATION_CONTEXT);
    await deleteRecords(VSM_DONOR_CONTEXT);
    log(VSM_DONOR_CONTEXT);
    await deleteRecords(INDEX_CONTEXT);
    log(INDEX_CONTEXT);
    await deleteRecords(VSM_MASTER_STATS);
    log(VSM_MASTER_STATS);
};


log("Starting...");


const loadAll = async() => {
    await deleteAll();
    await loadVolunteers();
    log("Volunteers loaded");
    await loadDonors();
    log("Donors loaded");
    await loadDonations();
};

loadAll();

// var v = { "vid": "3", "finyr": "2018-19", "centcd": "C01", "vsmtp": "MEN", "fstnm": "Varsha", "mdlnm": "Shekhar", "lstnm": "Bhoite", "gender": "", "addr1": "Rishiraj house,Apt no 7,6th flr,Bhavani Shankar Rd,Dadar west,Mumbai 400028", "addr2": "", "addr3": "", "district": "D17", "pincode": "0", "qualcd": "", "oqualcd": "B com", "email": "varshabhoite1@gmail.com", "aemail": "varsha.bhoite@licindia.com", "mblno": "9869657909", "amblno": "", "active": "", "birth_dt": "1969-11-29", "splzncd": "B com", "servcd": "SRV04", "prvexpc": "0", "dprvexpc": "", "intrsum": "", "referal": "REF02", "referalname": "", "otherinfo": "Right now won't be able to take any responsibility except KP", "crtedby": "massupload", "crtedon": "2019-08-05 17:51:59", "updby": null, "updon": null, "status": "1", "statuschangedate": "2019-01-01 01:01:01" };
// var id = processVolunteer(v);

// var x = { "did": "2", "fname": "Abhijit", "mname": "Vasudeo", "lname": "Mulay", "address1": "1803, Vidisha, Dosti Vihar,", "address2": "Off Pokharan Rd 1, Vartak Nagar, Thane (W) 400606 ", "address3": "", "district": "Thane", "city": "", "mobile": "8879565231", "landline": "2225882715", "altnumber": "", "email": "abhimulay2000@yahoo.com", "pancard": "ags1foDCYZow9g==", "iscompany": "no", "isvip": "no", "donorcat": "One Time", "details": "Ref Rajita Sawant;", "createdby": "massupload", "createdon": null, "changedby": "bprasad", "changedon": "2017-08-04 16:39:06" };
// var id = processDonor(x);
