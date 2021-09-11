import './App.css';
import React from 'react';
import SideBar from './SideBar';
import Dashboard from './Dashboard';
import CreateDonor from './CreateDonor';
import CreateDonation from './CreateDonation';
import UpdateDonor from './UpdateDonor';
import DonorSearch from './DonorSearch';
import { Auth } from 'aws-amplify';

function Main() {

    const [mainWidget, setMainWidget] = React.useState([
        <Dashboard />
    ]);

    const onClick = ({showNow, parameter}) => {
        console.log(showNow, parameter);
        if (showNow === "Donor Search")
            setMainWidget(<DonorSearch onClick={onClick}/>);
        else if (showNow === "Update Donor")
            setMainWidget(<UpdateDonor onSubmit={onClick} id={parameter} />);
        else if (showNow === "Create Donor")
            setMainWidget(<CreateDonor onSubmit={onClick} />);
        else if (showNow === "Add Donation")
            setMainWidget(<CreateDonation onSubmit={onClick} id={parameter} />);
        else 
            setMainWidget(<Dashboard />);
    }

    return (
        
        <div className="wrapper">
           <SideBar onLinkClick={onClick}/>
           <div className="main-panel">
              <nav className="navbar navbar-expand-lg navbar-dark navbar-absolute fixed-top ">
                 <div className="container-fluid">
                    <div className="navbar-wrapper">
                       <h3>Vidyadan Sahayak Mandal</h3>
                    </div>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" aria-controls="navigation-index" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="navbar-toggler-icon icon-bar"></span>
                    <span className="navbar-toggler-icon icon-bar"></span>
                    <span className="navbar-toggler-icon icon-bar"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-end">
                       <form className="navbar-form">
                          <div className="input-group no-border">
                             <input type="text" value="" className="form-control" placeholder="Search..." />
                             <button type="submit" className="btn btn-white btn-round btn-just-icon">
                                <i className="material-icons">search</i>
                                <div className="ripple-container"></div>
                             </button>
                          </div>
                       </form>
                       <ul className="navbar-nav">
                          <li className="nav-item">
                             <a className="nav-link" href="javascript:;">
                                <i className="material-icons">dashboard</i>
                                <p className="d-lg-none d-md-block">
                                   Stats
                                </p>
                             </a>
                          </li>
                          <li className="nav-item dropdown">
                             <a className="nav-link" href="http://example.com" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="material-icons">notifications</i>
                                <span className="notification">5</span>
                                <p className="d-lg-none d-md-block">
                                   Some Actions
                                </p>
                             </a>
                             <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
                                <a className="dropdown-item" href="#">Mike John responded to your email</a>
                                <a className="dropdown-item" href="#">You have 5 new tasks</a>
                                <a className="dropdown-item" href="#">You're now friend with Andrew</a>
                                <a className="dropdown-item" href="#">Another Notification</a>
                                <a className="dropdown-item" href="#">Another One</a>
                             </div>
                          </li>
                          <li className="nav-item dropdown">
                            <button type="button" className="btn btn-danger btn-sm m-1" onClick={() => Auth.signOut()}>Sign Out</button>
                          </li>
                       </ul>
                    </div>
                 </div>
              </nav>
              {mainWidget}
           </div>
        </div>            
    );
}
export default Main;
