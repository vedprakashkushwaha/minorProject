import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LayoutFile from "./components/layoutFile";
import AddRecord from "./components/trash/NOT-NEEDEDaddRecord";
import AdminHome from "./components/adminHome";
import FetchOrgInfo from "./components/fetchOrgInfo";
import OrgList from "./components/orgAutoSearch";
import Loading from "./components/loading";
import NewRecordInfo from "./components/addRecordMid";
import Graph from "./components/graph";
// import AboutUs from "./components/aboutUs";
import ErrorPage from "./components/errorPage";
// import ContactUs from "./components/contactUs";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={LayoutFile} />
        <Route path="/home" component={LayoutFile} />
        <Route path="/orgInfo" component={FetchOrgInfo} />
        {/* <Route path="/login" component={Login} /> */}
        <Route path="/proceed" component={AddRecord} />
        <Route path="/godMode" component={AdminHome} />
        <Route path="/admin" component={AdminHome} />
        <Route path="/getOrgs" component={OrgList} />
        <Route path="/loading" component={Loading} />
        <Route path="/newRec" component={NewRecordInfo} />
        <Route path="/graph" component={Graph} />
        {/* <Route path="/aboutUs" component={AboutUs} /> */}
        <Route path="/error" component={ErrorPage} />
        {/* <Route path="/contactUs" component={ContactUs} /> */}
        <Route component={ErrorPage} />
      </Switch>
    </Router>
  );
}

export default App;
