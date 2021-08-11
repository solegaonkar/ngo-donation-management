import './App.css';
import React from 'react';

class CreateDonor extends React.Component {
    
    
    constructor(props) {
        super(props);

        this.formPreventDefault = this.formPreventDefault.bind(this);
    }

    // handler recieves the `e` event object
    formPreventDefault(e) {
        e.preventDefault();
    }

    render() {
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
              <form onSubmit={this.formPreventDefault} className="form-horizontal">
                <div className="row">
                  <div className="card ">
                    <div className="card-header card-header-info card-header-text">
                      <div className="card-text">
                        <h4 className="card-title">Personal Information</h4>
                      </div>
                    </div>
                    <div className="card-body ">
                      <div className="row">
                        <label className="col-sm-2 col-lg-1 col-form-label">First Name</label>
                        <div className="col-sm-4 col-lg-3">
                          <div className="form-group">
                            <input className="form-control" type="text" name="required" required="true" />
                          </div>
                        </div>
                        <label className="col-sm-2 col-lg-1 col-form-label">Last Name</label>
                        <div className="col-sm-4 col-lg-3">
                          <div className="form-group">
                            <input className="form-control" type="text" name="required" required="true" />
                          </div>
                        </div>
                        <label className="col-sm-2 col-lg-1 col-form-label">PAN</label>
                        <div className="col-sm-4 col-lg-3">
                          <div className="form-group">
                            <input className="form-control" type="text" name="pan" required="true" />
                          </div>
                        </div>
                        <label className="col-sm-2 col-lg-1 col-form-label">Birthday</label>
                        <div className="col-sm-4 col-lg-3">
                          <div className="form-group">
                            <input className="form-control" type="text" name="birthday" required="true" />
                          </div>
                        </div>
                        <label className="col-sm-2 col-lg-1 col-form-label">Profession</label>
                        <div className="col-sm-4 col-lg-3">
                          <div className="form-group">
                            <input className="form-control" type="text" name="profession" required="true" />
                          </div>
                        </div>
                      </div>
                        
                        
                        

                        
                      <div className="row">
                        <div className="col-sm-6 p-4 center">
                          <div class="form-check">
                            <label class="form-check-label">
                              <input class="form-check-input" type="checkbox" value="" /> VIP - Corporate
                              <span class="form-check-sign">
                                <span class="check"></span>
                              </span>
                            </label>
                          </div>
                        </div>
                        <div className="col-sm-6 p-4 center">
                          <div class="form-check">
                            <label class="form-check-label">
                              <input class="form-check-input" type="checkbox" value="" /> VIP - Political
                              <span class="form-check-sign">
                                <span class="check"></span>
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
            </div>
          </div>
        </div>
      </div>
        );
    }
}
export default CreateDonor;
