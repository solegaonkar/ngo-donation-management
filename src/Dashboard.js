import './App.css';
import React from 'react';

class Dashboard extends React.Component {
    
    


    render() {
        return (
    
      <div className="content">
        <div className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <h3>Donations</h3>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="card card-stats">
                  <div className="card-header card-header-warning card-header-icon">
                    <div className="card-icon">
                      <i className="material-icons">weekend</i>
                    </div>
                    <p className="card-category">Donations YTD</p>
                    <h3 className="card-title">0.00</h3>
                  </div>
                  <div className="card-footer">
                    <div className="stats">
                      <i className="material-icons text-danger">local_offer</i>
                      <a href="#pablo">Details</a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="card card-stats">
                  <div className="card-header card-header-rose card-header-icon">
                    <div className="card-icon">
                      <i className="material-icons">equalizer</i>
                    </div>
                    <p className="card-category">Donations MTD</p>
                    <h3 className="card-title">0.00</h3>
                  </div>
                  <div className="card-footer">
                    <div className="stats">
                      <i className="material-icons">local_offer</i> Acknowledged
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="card card-stats">
                  <div className="card-header card-header-warning card-header-icon">
                    <div className="card-icon">
                      <i className="material-icons">weekend</i>
                    </div>
                    <p className="card-category">Budget</p>
                    <h3 className="card-title">0.00</h3>
                  </div>
                  <div className="card-footer">
                    <div className="stats">
                      <i className="material-icons text-danger">local_offer</i>
                      <a href="#pablo"></a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="card card-stats">
                  <div className="card-header card-header-rose card-header-icon">
                    <div className="card-icon">
                      <i className="material-icons">equalizer</i>
                    </div>
                    <p className="card-category">Required</p>
                    <h3 className="card-title">0.00</h3>
                  </div>
                  <div className="card-footer">
                    <div className="stats">
                      <i className="material-icons">local_offer</i> Acknowledged
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <h3>Donors</h3>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="card card-stats">
                  <div className="card-header card-header-warning card-header-icon">
                    <div className="card-icon">
                      <i className="material-icons">weekend</i>
                    </div>
                    <p className="card-category">Total</p>
                    <h3 className="card-title">0</h3>
                  </div>
                  <div className="card-footer">
                    <div className="stats">
                      <i className="material-icons text-danger">local_offer</i>
                      <a href="#pablo"></a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="card card-stats">
                  <div className="card-header card-header-rose card-header-icon">
                    <div className="card-icon">
                      <i className="material-icons">equalizer</i>
                    </div>
                    <p className="card-category">Active</p>
                    <h3 className="card-title">0</h3>
                  </div>
                  <div className="card-footer">
                    <div className="stats">
                      <i className="material-icons">local_offer</i> Acknowledged
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="card card-stats">
                  <div className="card-header card-header-warning card-header-icon">
                    <div className="card-icon">
                      <i className="material-icons">weekend</i>
                    </div>
                    <p className="card-category">Regular</p>
                    <h3 className="card-title">0</h3>
                  </div>
                  <div className="card-footer">
                    <div className="stats">
                      <i className="material-icons text-danger">local_offer</i>
                      <a href="#pablo"></a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="card card-stats">
                  <div className="card-header card-header-rose card-header-icon">
                    <div className="card-icon">
                      <i className="material-icons">equalizer</i>
                    </div>
                    <p className="card-category">Edge</p>
                    <h3 className="card-title">0</h3>
                  </div>
                  <div className="card-footer">
                    <div className="stats">
                      <i className="material-icons">local_offer</i> Acknowledged
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  );
    }
}
export default Dashboard;
