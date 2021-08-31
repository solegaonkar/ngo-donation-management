import './App.css';
import React from 'react';

import EditDonor from './EditDonor';

import { API } from 'aws-amplify';
import { AmplifyAuthenticator, } from '@aws-amplify/ui-react';
import { nanoid } from 'nanoid';

const ngo = "vsm";

const emptyDonor = { info: {}, contact: { phone: [], email: [] }, origin: {} };

function CreateDonor({onSubmit}) {
    const [data, setData] = React.useState({ info: {}, contact: { phone: [], email: [] }, origin: {} });

    const createDonor = () => {
        var donor = JSON.parse(JSON.stringify(data));

        donor.context = `${ngo} donor`;
        donor.id = nanoid();

        API.post("ngodonation", "/", {
            body: { action: "CreateNewDonor", data: { ngo, donor } },
            headers: { 'Content-Type': 'application/json' }
        }).then(r => {
            console.log("Success");
            onSubmit({showNow: "Add Donation", parameter: donor.id});
        }).catch(e => { console.log(JSON.stringify(e)) });
    };

    return (
        <div className="container clear-top">
            <div className="row">
                <div className="col-12">
                    <div className="App container p-4">
                        <div className="row">
                            <div className="col-12 pt-4 pb-4 mt-4 mb-4">
                                <h1>Create Donor</h1>
                            </div>
                        </div>
                        <EditDonor data={data} setData={(d) => {setData(d)}} submit={createDonor}/>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default CreateDonor;
