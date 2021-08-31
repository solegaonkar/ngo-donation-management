import './App.css';
import React from 'react';

import EditDonor from './EditDonor';

import { API } from 'aws-amplify';
import { AmplifyAuthenticator, } from '@aws-amplify/ui-react';

const ngo = "vsm";

function UpdateDonor({ id }) {
  const [data, setData] = React.useState({});

  const loadDonor = () => {
    API.post("ngodonation", "/", {
        body: { action: "GetDonorInfo", data: { ngo, id } },
        headers: { 'Content-Type': 'application/json' }
      }).then(d => {
        setData(d);
      })
      .catch(e => { console.log(JSON.stringify(e)) });
  };

  React.useEffect(() => {
    loadDonor();
  }, []); // <-- Have to pass in [] here!

  const submit = () => {
    console.log(JSON.stringify(data));

    API.post("ngodonation", "/", {
      body: { action: "UpdateDonorInfo", data: { ngo, donor: data } },
      headers: { 'Content-Type': 'application/json' }
    }).then(r => {
      console.log(JSON.stringify(r));
    }).catch(e => { console.log(JSON.stringify(e)) });
  };

  if (data?.id) {
    console.log("data: " + JSON.stringify(data));
    return (
      <AmplifyAuthenticator>
        <div className="container clear-top">
          <div className="row">
            <div className="col-12">
              <div className="App container p-4">
                <div className="row">
                  <div className="col-12 p4-4 pb-4 mt-4 mb-4">
                    <h1>Update Donor</h1>
                  </div>
                </div>
                <EditDonor data={data} setData={(d) => {setData(d)}} submit={submit}/>
              </div>
            </div>
          </div>
        </div>
      </AmplifyAuthenticator>
    );
  }
  else {
    return (
      <AmplifyAuthenticator>
      <div className="container clear-top">
        <div className="row">
          <div className="col-12">
            <div className="App container p-4">
              <div className="row">
                <div className="col-12 p4-4 pb-4 mt-4 mb-4">
                  <h1>Loading...</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AmplifyAuthenticator>
    );

  }


}
export default UpdateDonor;
