import './App.css';
import React from 'react';

class SideBar extends React.Component {


    constructor(props) {
        super(props);

        
        this.formPreventDefault = this.formPreventDefault.bind(this);
        this.onClickPreventDefault = this.onClickPreventDefault.bind(this);
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
    /*
        Tip 1: You can change the color of the sidebar using: data-color="purple | azure | green | orange | danger"
        Tip 2: you can also add an image using data-image tag
    */
    render() {
        return (
<div className="sidebar" data-color="azure" data-background-color="black" data-image="URL('/assets/img/sidebar-1.jpg')">
   <div className="logo">
      <a href="https://vsmthane.org" className="simple-text logo-mini">
        
      </a>
      <a href="https://vsmthane.org" className="simple-text logo-normal">
        
      </a>
   </div>
   <div className="sidebar-wrapper">
        <div className="user">
          <div className="photo">
            <img src="/assets/img/faces/avatar.jpg" alt=""/>
          </div>
          <div className="user-info">
            <a data-toggle="collapse" href="#collapseExample" className="username">
              <span>
                Vikas Solegaonkar
                <b className="caret"></b>
              </span>
            </a>
            <div className="collapse" id="collapseExample">
              <ul className="nav">
                <li className="nav-item">
                  <a className="nav-link" >
                    <span className="sidebar-mini">  </span>
                    <span className="sidebar-normal"> My Profile </span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" >
                    <span className="sidebar-mini"> </span>
                    <span className="sidebar-normal"> Settings </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <ul className="nav">
         <li className="nav-item active ">
            <a className="nav-link" onClick={() => {this.props.onLinkClick("Dashboard")}}>
               <i className="material-icons">dashboard</i>
               <p> Dashboard </p>
            </a>
         </li>
         <li className="nav-item ">
            <a className="nav-link" data-toggle="collapse" href="#activitySidebar">
               <i className="material-icons">laptop</i>
               <p> Activity
                  <b className="caret"></b>
               </p>
            </a>
            <div className="collapse" id="activitySidebar">
               <ul className="nav">
                  <li className="nav-item ">
                     <a className="nav-link" onClick={() => {this.props.onLinkClick("Donor Create/Update")}}>
                     <span className="sidebar-mini"> &nbsp; </span>
                     <span className="sidebar-normal"> Donor Create/Update </span>
                     </a>
                  </li>
                  <li className="nav-item ">
                     <a className="nav-link" onClick={() => {this.props.onLinkClick("Receive Donation")}}>
                     <span className="sidebar-mini"> &nbsp; </span>
                     <span className="sidebar-normal"> Receive Donation </span>
                     </a>
                  </li>
                  <li className="nav-item ">
                     <a className="nav-link" onClick={() => {this.props.onLinkClick("Donation Drive")}}>
                     <span className="sidebar-mini"> &nbsp; </span>
                     <span className="sidebar-normal"> Donation Drive </span>
                     </a>
                  </li>
               </ul>
            </div>
         </li>
         <li className="nav-item ">
            <a className="nav-link" data-toggle="collapse" href="#donorReportSidebar">
               <i className="material-icons">timeline</i>
               <p> Donor Reports
                  <b className="caret"></b>
               </p>
            </a>
            <div className="collapse" id="donorReportSidebar">
               <ul className="nav">
                  <li className="nav-item ">
                     <a className="nav-link" onClick={() => {this.props.onLinkClick("Donor Acquisition")}}>
                     <span className="sidebar-mini"> &nbsp; </span>
                     <span className="sidebar-normal"> Donor Acquisition </span>
                     </a>
                  </li>
                  <li className="nav-item ">
                     <a className="nav-link" onClick={() => {this.props.onLinkClick("Donor Impact")}}>
                     <span className="sidebar-mini"> &nbsp; </span>
                     <span className="sidebar-normal"> Donor Impact </span>
                     </a>
                  </li>
                  <li className="nav-item ">
                     <a className="nav-link" onClick={() => {this.props.onLinkClick("Donor Origin")}}>
                     <span className="sidebar-mini"> &nbsp; </span>
                     <span className="sidebar-normal"> Donor Origin </span>
                     </a>
                  </li>
                  <li className="nav-item ">
                     <a className="nav-link" onClick={() => {this.props.onLinkClick("Donor Analysis")}}>
                     <span className="sidebar-mini"> &nbsp; </span>
                     <span className="sidebar-normal"> Donor Analysis </span>
                     </a>
                  </li>
               </ul>
            </div>
         </li>
         <li className="nav-item ">
            <a className="nav-link" data-toggle="collapse" href="#donationReportSidebar">
               <i className="material-icons">timeline</i>
               <p> Donation Reports
                  <b className="caret"></b>
               </p>
            </a>
            <div className="collapse" id="donationReportSidebar">
               <ul className="nav">
                  <li className="nav-item ">
                     <a className="nav-link" onClick={() => {this.props.onLinkClick("Drive Impact")}}>
                     <span className="sidebar-mini"> &nbsp; </span>
                     <span className="sidebar-normal"> Drive Impact </span>
                     </a>
                  </li>
                  <li className="nav-item ">
                     <a className="nav-link" onClick={() => {this.props.onLinkClick("Donation Trend")}}>
                     <span className="sidebar-mini"> &nbsp; </span>
                     <span className="sidebar-normal"> Donation Trend </span>
                     </a>
                  </li>
                  <li className="nav-item ">
                     <a className="nav-link" onClick={() => {this.props.onLinkClick("Donation Origin")}}>
                     <span className="sidebar-mini"> &nbsp; </span>
                     <span className="sidebar-normal"> Donation Origin </span>
                     </a>
                  </li>
                  <li className="nav-item ">
                     <a className="nav-link" onClick={() => {this.props.onLinkClick("Donation Analysis")}}>
                     <span className="sidebar-mini"> &nbsp; </span>
                     <span className="sidebar-normal"> Donation Analysis </span>
                     </a>
                  </li>
               </ul>
            </div>
         </li>
         <li className="nav-item ">
            <a className="nav-link" data-toggle="collapse" href="#donorEngagementSidebar">
               <i className="material-icons">email</i>
               <p> Donor Engagement
                  <b className="caret"></b>
               </p>
            </a>
            <div className="collapse" id="donorEngagementSidebar">
               <ul className="nav">
                  <li className="nav-item ">
                     <a className="nav-link" onClick={() => {this.props.onLinkClick("Newsletter")}}>
                     <span className="sidebar-mini"> &nbsp; </span>
                     <span className="sidebar-normal"> Newsletter </span>
                     </a>
                  </li>
                  <li className="nav-item ">
                     <a className="nav-link" onClick={() => {this.props.onLinkClick("Communication")}}>
                     <span className="sidebar-mini"> &nbsp; </span>
                     <span className="sidebar-normal"> Donor Communication </span>
                     </a>
                  </li>
                  <li className="nav-item ">
                     <a className="nav-link" onClick={() => {this.props.onLinkClick("Soft Reminders")}}>
                     <span className="sidebar-mini"> &nbsp; </span>
                     <span className="sidebar-normal"> Donation Origin </span>
                     </a>
                  </li>
                  <li className="nav-item ">
                     <a className="nav-link" onClick={() => {this.props.onLinkClick("Opportunities")}}>
                     <span className="sidebar-mini"> &nbsp; </span>
                     <span className="sidebar-normal"> Donation Analysis </span>
                     </a>
                  </li>
               </ul>
            </div>
         </li>
      </ul>
   </div>
   <div className="sidebar-background"></div>
</div>
        );
    }
}
export default SideBar;
