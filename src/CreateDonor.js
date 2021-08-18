import './App.css';
import React from 'react';

import EditDonor from './EditDonor';

function CreateDonor() {

    const [data, setData] = React.useState({});
    // handler recieves the `e` event object
    const createDonor = () => {
      
    }


    return (
      <div className="container clear-top">
        <div className="row">
          <div className="col-12">
            <div className="App container p-4">
              <div className="row">
                <div className="col-12 p4-4 pb-4 mt-4 mb-4">
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
