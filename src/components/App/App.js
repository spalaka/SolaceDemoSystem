import React, { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './App.css';
import Dashboard from '../Dashboard/Dashboard';
import Header from '../Layout/Header';
import Login from '../Login/Login';
import Preferences from '../Preferences/Preferences';
import VOCT from '../Maps/VOCT';
import useToken from './useToken';
import SolaceConnection from '../Solace/SolPubSubUtility';
import Button from '@material-ui/core/Button'
import solace from 'solclientjs'
import ToggleSwitch from "react-switch";

function setToken(userToken) {
  sessionStorage.setItem('token', JSON.stringify(userToken));
}

function getToken() {
  const tokenString = sessionStorage.getItem('token');
  const userToken = JSON.parse(tokenString);
  return userToken?.token
}

// function loadShipments(){
//   alert("Test")
//   //var solace = require('solclientjs').debug; // logging supported
//   var factoryProps = new solace.SolclientFactoryProperties();
//   factoryProps.profile = solace.SolclientFactoryProfiles.version10;
//   solace.SolclientFactory.init(factoryProps);
//   // enable logging to JavaScript console at WARN level
//   // NOTICE: works only with ('solclientjs').debug
//   solace.SolclientFactory.setLogLevel(solace.LogLevel.WARN);

//   // create the consumer, specifying the name of the queue
//   var consumer = new QueueConsumer(solace, 'Q_Test');
//   alert(process.argv)
//   // subscribe to messages on Solace message router
//   consumer.run(process.argv);

//   consumer.log("Press Ctrl-C to exit");
//   //process.stdin.resume();

//   process.on('SIGINT', function () {
//     'use strict';
//     consumer.exit();
// });
// }








function App() {
 
  // const { token, setToken } = useToken();
  const { token, setToken } = useState();
 
  // if(!token) {
  //   return <Login setToken={setToken} />
  // }

  return (
    <div className="wrapper">
      {/* <h1>VOCT</h1> */}
      {/* <ToggleSwitch onChange={this.handleChange} checked={this.state.checked} /> */}
      {/* <Button variant="contained" color="secondary" onClick={loadShipments} >Load Shipments</Button> */}
      <BrowserRouter>
        <Switch>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/preferences">
            <Preferences />
          </Route>
          <Route path="/voct">
            <VOCT />
          </Route>
          <Route path="/Header">
            <Header />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;