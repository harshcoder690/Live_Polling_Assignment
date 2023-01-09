import React, { Component } from 'react';
import {Link, NavLink} from 'react-router-dom';
import { withRouter } from "react-router-dom";
import { socket } from './Header';
import swal from 'sweetalert';

class Student extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomID: ''
    }
  }

  joinRoom = () => {
    socket.emit('joinRoom', {name: this.props.playerName, roomID: this.state.roomID});
  }

  roomJoined = ({roomID, playerName}) => {
    this.props.basicInfoCallBack({roomID, playerName, role:'student'});
    this.props.history.push('/poll');
  }

  showError = ({msg}) => {
    swal("Error", msg, "error");
    console.log(msg);
  }

  handleText = (e) => {
    this.setState({
      roomID: e.target.value
    })
  }

  componentDidMount() {
    socket.on('roomJoined', this.roomJoined);
    socket.on('failed', this.showError);
  }

  render() {
    return (
        <div className="step-container step-2">
            <div className="step">
                <div className="headText">Room ID</div>
                <input type="text" className="input-field joinRoom_ID" placeholder="Enter Room ID" value={this.state.roomID} onChange={this.handleText}/>
                <div className="btn-container">
                    <Link to="/"><div className="form-btn backBtn">Back</div></Link>
                    <div onClick={this.joinRoom} className="form-btn joinroom">Join</div>
                </div>
            </div>
        </div>
    )
  }
}

export default withRouter(Student);