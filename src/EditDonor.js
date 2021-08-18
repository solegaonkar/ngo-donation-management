import './App.css';
import React from 'react';

function EditDonor({data, setData, submit}) {

    // handler recieves the `e` event object
    const formSubmit = (e) => {
        e.preventDefault();
        submit();
    };

    const getUpdater = (field, type) => {
        return (e) => {
            data[field] = (type === "checkbox") ? e.target.checked : e.target.value;
            setData(data);
        };
    };
    
    return (
        <form onSubmit={formSubmit} className="form-horizontal">
          <div className="row">
            <div className="card ">
              <div className="card-header card-header-info card-header-text">
                <div className="card-text">
                  <h4 className="card-title">Personal Information</h4>
                </div>
              </div>
              <div className="card-body ">
                <div className="row">
                  <label className="col-sm-3 col-lg-1 col-form-label">First Name</label>
                  <div className="col-sm-9 col-lg-5">
                    <div className="form-group">
                      <input className="form-control" type="text" name="required" required="true" value={data.fullName} onChange={getUpdater("fullName")}/>
                    </div>
                  </div>
                  <label className="col-sm-3 col-lg-1 col-form-label" >PAN</label>
                  <div className="col-sm-3 col-lg-2">
                    <div className="form-group">
                      <input className="form-control" type="text" name="pan" required="true" value={data.pan} onChange={getUpdater("pan")}/>
                    </div>
                  </div>
                  <label className="col-sm-3 col-lg-1 col-form-label right">Birthday</label>
                  <div className="col-sm-3 col-lg-2">
                    <div className="form-group">
                      <input className="form-control" type="text" name="birthday" required="true" value={data.birthday} onChange={getUpdater("birthday")}/>
                    </div>
                  </div>
                  <label className="col-sm-3 col-lg-1 col-form-label">Profession</label>
                  <div className="col-sm-9 col-lg-5">
                    <div className="form-group">
                      <input className="form-control" type="text" name="profession" required="true" value={data.profession} onChange={getUpdater("profession")}/>
                    </div>
                  </div>
                  <div className="col-sm-6 col-lg-3 p-4 center">
                    <div className="form-check">
                      <label className="form-check-label">
                        <input className="form-check-input" type="checkbox" value={data.isVip} onChange={getUpdater("isVip", "checkbox")}/> VIP Donor
                        <span className="form-check-sign">
                          <span className="check"></span>
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="col-sm-6 col-lg-3 p-4 center">
                    <div className="form-check">
                      <label className="form-check-label">
                        <input className="form-check-input" type="checkbox" value={data.isCompany} onChange={getUpdater("isCompany", "checkbox")}/> Company
                        <span className="form-check-sign">
                          <span className="check"></span>
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer ml-auto mr-auto">
              </div>
            </div>
          </div>
          <div className="row">
            <div className="card ">
              <div className="card-header card-header-info card-header-text">
                <div className="card-text">
                  <h4 className="card-title">Contact Info</h4>
                </div>
              </div>
              <div className="card-body ">
                <div className="row">
                  <label className="col-sm-2 col-lg-1 col-form-label">Email</label>
                  <div className="col-sm-4 col-lg-3">
                    <div className="form-group">
                      <input className="form-control" type="text" name="email" email="true" required="true" />
                    </div>
                  </div>
                  <label className="col-sm-2 col-lg-1 col-form-label">Phone</label>
                  <div className="col-sm-4 col-lg-3">
                    <div className="form-group">
                      <input className="form-control" type="text" name="phone" number="true" required={() => false} />
                    </div>
                  </div>
                  <label className="col-sm-2 col-lg-1 col-form-label">Pin</label>
                  <div className="col-sm-4 col-lg-3">
                    <div className="form-group">
                      <input className="form-control" type="text" name="pin" number="true" required="true" />
                    </div>
                  </div>
                  <label className="col-sm-2 col-lg-1 col-form-label">Address</label>
                  <div className="col-sm-10 col-lg-11">
                    <div className="form-group">
                      <input className="form-control" type="text" name="address" required="true" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer ml-auto mr-auto">
              </div>
            </div>
          </div>
          <div className="row">
            <div className="card ">
              <div className="card-header card-header-info card-header-text">
                <div className="card-text">
                  <h4 className="card-title">Other Details</h4>
                </div>
              </div>
              <div className="card-body ">
                <div className="row">
                  <label className="col-sm-2 col-lg-1 col-form-label">Referral</label>
                  <div className="col-sm-4 col-lg-3">
                    <div className="form-group">
                      <input className="form-control" type="text" name="referral" required="true" />
                    </div>
                  </div>
                  <label className="col-sm-2 col-lg-1 col-form-label">Drive</label>
                  <div className="col-sm-4 col-lg-3">
                    <div className="form-group">
                      <input className="form-control" type="text" name="drive" required="true" />
                    </div>
                  </div>
                  <label className="col-sm-2 col-lg-1 col-form-label">Source</label>
                  <div className="col-sm-4 col-lg-3">
                    <div className="form-group">
                      <input className="form-control" type="text" name="source" number="true" required="true" />
                    </div>
                  </div>
                  <label className="col-sm-2 col-lg-1 col-form-label">Notes</label>
                  <div className="col-sm-10 col-lg-11">
                    <div className="form-group">
                      <input className="form-control" type="text" name="notes" required="true" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer ml-auto mr-auto">
                <button type="submit" className="btn btn-rose">Submit</button>
              </div>
            </div>
          </div>
        </form>
    );
}
export default EditDonor;
