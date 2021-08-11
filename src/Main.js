import './App.css';
import React from 'react';
import SideBar from './SideBar';
import Dashboard from './Dashboard';
import CreateDonor from './CreateDonor';
import { Auth } from 'aws-amplify';

class Main extends React.Component {
    
    
    constructor(props) {
        super(props);

        this.formPreventDefault = this.formPreventDefault.bind(this);
        this.onClickPreventDefault = this.onClickPreventDefault.bind(this);
        
        this.state = {showNow: 'Dashboard'};
        this.sideBarLinkClick = this.sideBarLinkClick.bind(this);
    }

    // handler recieves the `e` event object
    formPreventDefault(e) {
        alert('here');
        e.preventDefault();
    }

    onClickPreventDefault(e) {
        alert('onClickPreventDefault called, form will not submit');
        e.preventDefault();
    }
    render() {
        var main = <Dashboard />;
        if (this.state.showNow == "Donor Create/Update")
            main = <CreateDonor />;
        
        return (
            
<div class="wrapper">
   <SideBar onLinkClick={this.sideBarLinkClick}/>
   <div className="main-panel">
      <nav class="navbar navbar-expand-lg navbar-dark navbar-absolute fixed-top ">
         <div class="container-fluid">
            <div class="navbar-wrapper">
               <h3>Vidyadan Sahayak Mandal</h3>
            </div>
            <button class="navbar-toggler" type="button" data-toggle="collapse" aria-controls="navigation-index" aria-expanded="false" aria-label="Toggle navigation">
            <span class="sr-only">Toggle navigation</span>
            <span class="navbar-toggler-icon icon-bar"></span>
            <span class="navbar-toggler-icon icon-bar"></span>
            <span class="navbar-toggler-icon icon-bar"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-end">
               <form class="navbar-form">
                  <div class="input-group no-border">
                     <input type="text" value="" class="form-control" placeholder="Search..." />
                     <button type="submit" class="btn btn-white btn-round btn-just-icon">
                        <i class="material-icons">search</i>
                        <div class="ripple-container"></div>
                     </button>
                  </div>
               </form>
               <ul class="navbar-nav">
                  <li class="nav-item">
                     <a class="nav-link" href="javascript:;">
                        <i class="material-icons">dashboard</i>
                        <p class="d-lg-none d-md-block">
                           Stats
                        </p>
                     </a>
                  </li>
                  <li class="nav-item dropdown">
                     <a class="nav-link" href="http://example.com" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="material-icons">notifications</i>
                        <span class="notification">5</span>
                        <p class="d-lg-none d-md-block">
                           Some Actions
                        </p>
                     </a>
                     <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
                        <a class="dropdown-item" href="#">Mike John responded to your email</a>
                        <a class="dropdown-item" href="#">You have 5 new tasks</a>
                        <a class="dropdown-item" href="#">You're now friend with Andrew</a>
                        <a class="dropdown-item" href="#">Another Notification</a>
                        <a class="dropdown-item" href="#">Another One</a>
                     </div>
                  </li>
                  <li class="nav-item dropdown">
                    <button type="button" className="btn btn-danger btn-sm m-1" onClick={() => Auth.signOut()}>Sign Out</button>
                  </li>
               </ul>
            </div>
         </div>
      </nav>
      {main}
   </div>
</div>            
        );
    }
    
    sideBarLinkClick(link) {
        console.log(link);
          this.setState({showNow: link});
    }
    
    getNavBar() {
    }
    
    
}
export default Main;
