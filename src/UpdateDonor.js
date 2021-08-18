import './App.css';
import React from 'react';

import EditDonor from './EditDonor';

import {API} from 'aws-amplify';

function UpdateDonor({id}) {
    console.log(id);
    
    const [data, setData] = React.useState({});

    const loadDonor = async () => {
      await API.post("ngodonation", "/", {
        body: {id},
        headers: {}
      });
    };
    
    loadDonor();
    
    return (
      <div className="container clear-top">
        <div className="row">
          <div className="col-12">
            <div className="App container p-4">
              <div className="row">
                <div className="col-12 p4-4 pb-4 mt-4 mb-4">
                  <h1>Update Donor</h1>
                </div>
              </div>
              <EditDonor data={data} setData={(d) => {setData(d)}} submit={() => {console.log("Submit")}}/>
            </div>
          </div>
        </div>
      </div>
    );
}
export default UpdateDonor;
