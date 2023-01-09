import React, { Component } from 'react';
import {Link, withRouter} from 'react-router-dom';
import socketIOClient from "socket.io-client";
let socket;

class Header extends Component {
  constructor() {
    super();
    this.state = {
      endpoint: 'https://polling-live.onrender.com/',
      persons: 0
    }
    socket = socketIOClient(this.state.endpoint);
  }

  componentDidMount() {
    socket.emit('getPersonCount', {roomID: this.props.roomID});
    socket.on('personUpdated', (count) => {
      this.setState({persons: count});
      if(this.props.role == 'teacher') this.props.history.push(count == 0 ? '/create' : '/ask');
    })
  }

  render() {
    return (
      <div className='nav'>
        <div className='header'>
          <Link to="/"><i className="fa fa-home homeBtn"></i></Link>
          <h1 className='headText'>{this.props.playerName || 'Unknown'} {this.props.role || ''} {this.props.roomID ? '| ' + this.props.roomID : ''}</h1>
          <i className="fa-solid fa-user">{this.props.roomID ? ' '+this.state.persons : ''}</i>
        </div>
      </div>
    )
  }
}

export default withRouter(Header);
export {socket};
