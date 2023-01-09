import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { socket } from './Header';

class CreateRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerName: this.props.playerName,
      roomID: ''
    }
  }

  roomCreated = ({ roomID, playerName }) => {
    this.setState({
      roomID: roomID,
      playerName: playerName
    }, () => this.props.basicInfoCallBack({roomID, playerName, role: 'teacher'}));
  }

  componentDidMount() {
    socket.emit('createRoom', {name: this.state.playerName});
    socket.on('roomCreated', this.roomCreated);
    socket.on('studentsUpdated', this.studentsUpdated);
  }

  render() {
    return (
      <div className="step-container step-3">

        <div className="room-container">
            <div className="room">
              <div className="headText">Room ID</div>
              <input type="text" className="input-field roomID" disabled="disabled" value={this.state.roomID || '_____'}/>
              <div className="headText playerName">{this.state.playerName || '_____'}</div>
              <div className="btn-container">
                <div className="form-btn copyBtn" onClick={(e) => navigator.clipboard.writeText(this.state.roomID) && (e.target.innerText = 'Copied!')}>Copy</div>
              </div>
            </div>

            <div className="spinner">
              <img className="spinner" src="/waitLogo-light.svg" alt="Spinner"/>
              <img className="spinner hide" src="/waitLogo-dark.svg" alt="Spinner"/>
            </div>
        </div>

      </div>
    )
  }
}

export default withRouter(CreateRoom);