import './App.css';
import React from 'react';

// Same code for create and update. If the data has an id, then it is update.
// In that case mark some fields as readonly.
function EditDonor({ data, setData, submit }) {

    // handler recieves the `e` event object
    const formSubmit = (e) => {
        e.preventDefault();
        submit();
    };

    // {,"notes":"From my friend","source":"","donation":{"amount":8600,"firstDonationDate":1463443200000,"ids":["20160517 QeFhIh5g3ozBTD3H67HVZ","20160122 U_NOXNIFM2qazSjMEKaHw","20200622 A6d4vDE9GbvBByF0-yrgN"],"lastDonationDate":1592784000000},"id":"8-TIB-ozDyHc1TtiQSc5D"}
    const getUpdater = (field, type) => {
        return (e) => {
            var d = JSON.parse(JSON.stringify(data));
            if (["fullName", "birthday", "pan", "isVolunteer", "isCompany", "isVip", "profession"].includes(field)) {
                d.info[field] = (type === "checkbox") ? e.target.checked : e.target.value;
            }
            else if (["address"].includes(field)) {
                d.contact[field] = e.target.value;
            }
            else if (["pin"].includes(field)) {
                d.contact[field] = e.target.value;
                loadPinInfo(e.target.value);
            }
            else if (["email", "phone"].includes(field)) {
                if (!data.contact[field] || !d.contact[field][0]) {
                    d.contact[field][0] = e.target.void;
                } else {
                    d.contact[field][type] = e.target.value;
                }
            }
            else if (["referral", "drive"].includes(field)) {
                d.origin[field] = e.target.value;
            } else {
                d[field] = e.target.value;
            }
            setData(d);
        };
    };

    const [pinDetails, setPinDetails] = React.useState({});
    const loadPinInfo = (pin) => {
        if (pin && pin.length==6)
            fetch(`https://api.krazyminds.com/postalpincode/india/${pin}`).then(r => r.json()).then(r => {
                console.log(r);
                setPinDetails(r);
            });
    };

    //React.useEffect(() => loadPinInfo());
    React.useEffect(() => {
        loadPinInfo(data?.contact?.pin);
    }, []); // <-- Have to pass in [] here!

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
                        <InputField field={data?.info?.fullName} updater={getUpdater("fullName")}  />
                    </div>
                  </div>
                  <label className="col-sm-3 col-lg-1 col-form-label" >PAN</label>
                  <div className="col-sm-3 col-lg-2">
                    <div className="form-group">
                        <InputField field={data?.info?.pan} updater={getUpdater("pan")}  />
                    </div>
                  </div>
                  <label className="col-sm-3 col-lg-1 col-form-label right">Birthday</label>
                  <div className="col-sm-3 col-lg-2">
                    <div className="form-group"> 
                        <InputField field={data?.info?.birthday} type="date" updater={getUpdater("birthday")}  />
                    </div>
                  </div>
                  <label className="col-sm-3 col-lg-1 col-form-label">Profession</label>
                  <div className="col-sm-9 col-lg-5">
                    <div className="form-group">
                        <InputField field={data?.info?.profession} type="date" updater={getUpdater("profession")}  />
                    </div>
                  </div>
                  <div className="col-sm-4 col-lg-3 p-4 center">
                    <div className="form-check">
                      <label className="form-check-label">
                        <input className="form-check-input" type="checkbox" defaultChecked={data?.info?.isVolunteer} onChange={getUpdater("isVolunteer", "checkbox")}/> Volunteer
                        <span className="form-check-sign">
                          <span className="check"></span>
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="col-sm-4 col-lg-3 p-4 center">
                    <div className="form-check">
                      <label className="form-check-label">
                        <input className="form-check-input" type="checkbox" defaultChecked={data?.info?.isVip} onChange={getUpdater("isVip", "checkbox")}/> VIP Donor
                        <span className="form-check-sign">
                          <span className="check"></span>
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="col-sm-4 col-lg-3 p-4 center">
                    <div className="form-check">
                      <label className="form-check-label">
                        <input className="form-check-input" type="checkbox" defaultChecked={data?.info?.isCompany} onChange={getUpdater("isCompany", "checkbox")}/> Company
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
                  <div className="col-sm-4 col-lg-5">
                    <div className="form-group">
                      <input className="form-control" type="text" email="true" required="true" value={data?.contact?.email[0]} onChange={getUpdater("email", 0)}/>
                    </div>
                  </div>
                  <label className="col-sm-2 col-lg-1 col-form-label">Email</label>
                  <div className="col-sm-4 col-lg-5">
                    <div className="form-group">
                      <input className="form-control" type="text" email="true" required="true" value={data?.contact?.email[1]} onChange={getUpdater("email", 1)}/>
                    </div>
                  </div>
                  <label className="col-sm-2 col-lg-1 col-form-label">Phone</label>
                  <div className="col-sm-4 col-lg-5">
                    <div className="form-group">
                      <input className="form-control" type="text" phone="true" required="true" value={data?.contact?.phone[0]} onChange={getUpdater("phone", 0)}/>
                    </div>
                  </div>
                  <label className="col-sm-2 col-lg-1 col-form-label">Phone</label>
                  <div className="col-sm-4 col-lg-5">
                    <div className="form-group">
                      <input className="form-control" type="text" phone="true" required="true" value={data?.contact?.phone[1]} onChange={getUpdater("phone", 1)}/>
                    </div>
                  </div>
                  <label className="col-sm-2 col-lg-1 col-form-label">Pin</label>
                  <div className="col-sm-4 col-lg-3">
                    <div className="form-group">
                        <InputField field={data?.contact?.pin} type="date" updater={getUpdater("pin")}  />
                    </div>
                  </div>
                  <div className="col-sm-6 col-lg-8">
                    <div className="form-group">
                      
                    </div>
                  </div>
                  <label className="col-sm-2 col-lg-1 col-form-label">Address</label>
                  <div className="col-sm-10 col-lg-11">
                    <div className="form-group">
                        <InputField field={data?.contact?.address} type="date" updater={getUpdater("address")}  />
                    </div>
                  </div>
                  <div className="col-12 text right">
                    <label className="col-form-label"> Sub District: </label>: {pinDetails.subDistrict}, &nbsp;
                    <label className="col-form-label"> District: </label>: {pinDetails.district},  &nbsp;
                    <label className="col-form-label"> State: </label>: {pinDetails.state} 
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
                  <h4 className="card-title">Origin</h4>
                </div>
              </div>
              <div className="card-body ">
                <div className="row">
                  <label className="col-sm-2 col-lg-1 col-form-label">Referral</label>
                  <div className="col-sm-4 col-lg-3">
                    <div className="form-group">
                        <InputField field={data?.origin?.referral} updater={getUpdater("referral")} readonly={data.id} />
                    </div>
                  </div>
                  <label className="col-sm-2 col-lg-1 col-form-label">Drive</label>
                  <div className="col-sm-4 col-lg-3">
                    <div className="form-group">
                        <InputField field={data?.origin?.drive} updater={getUpdater("drive")} readonly={data.id} />
                    </div>
                  </div>
                  <label className="col-sm-2 col-lg-1 col-form-label">Month</label>
                  <div className="col-sm-4 col-lg-3">
                    <div className="form-group">
                        <InputField field={data?.origin?.month} updater={getUpdater("month")} readonly={true} />
                    </div>
                  </div>
                  <label className="col-sm-2 col-lg-1 col-form-label">Notes</label>
                  <div className="col-sm-10 col-lg-11">
                    <div className="form-group">
                        <InputField field={data?.notes} updater={getUpdater("notes")} />
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

function InputField({ field, type, updater, readonly }) {
    type = !type ? "text" : type;
    if (readonly) {
        return (
            <input className="form-control" type="{type}" required="true" readonly="true" value={field} onChange={updater}/>
        );
    } else {
        return (
            <input className="form-control" type="{type}" required="true" value={field} onChange={updater}/>
        );
    }
}

export default EditDonor;
