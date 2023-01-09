import Header from './Header';
import NewUser from './NewUser';
import JoinRoom from './JoinRoom';
import Teacher from './Teacher';
import Poll from './Poll';
import CreateRoom from './CreateRoom';
import React, { Component } from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

export default class slide extends Component {
  constructor() {
    super();
    this.state = {
      playerName: '',
      roomID: '',
      role: ''
    }
  }

  basicInfoCallBack = ({playerName, roomID, role}, fn) => {
    this.setState({
      playerName: playerName,
      role: role,
      roomID: roomID
    }, fn || (() => {}));
  }

  render() {
    console.log(this.state);
    return (
      <Router>
        <Header playerName={this.state.playerName} roomID={this.state.roomID} role={this.state.role}/>
        <Switch>
          <Route path='/' exact render={(props) => (
            <NewUser basicInfoCallBack={this.basicInfoCallBack}/>
          )}/>
          <Route path='/join' exact render={(props) => (
            <JoinRoom playerName={this.state.playerName} basicInfoCallBack={this.basicInfoCallBack}/>
          )}/>
          <Route path='/create' exact render={(props) => (
            <CreateRoom playerName={this.state.playerName} basicInfoCallBack={this.basicInfoCallBack}/>
          )}/>
          <Route path='/ask' exact render={(props) => (
            <Teacher roomID={this.state.roomID}/>
          )}/>
          <Route path='/poll' exact render={(props) => (
            <Poll role={this.state.role} roomID={this.state.roomID}/>
          )}/>
        </Switch>
      </Router>
    )
  }
}
