import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class newUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
    }
    this.props.basicInfoCallBack({playerName: '', role:'', roomID: ''});
  }

  handleText = (e) => {
    this.setState({
      name: e.target.value
    }, () => this.props.basicInfoCallBack({playerName: this.state.name}))
  }

  render() {
    return (
        <div className="step-container step-1">
            <div className="step">
                <div className="headText">Name</div>
                <input type="text" className="input-field name" placeholder="Enter your name" value={this.state.name} onChange={this.handleText}/>
                <div className="btn-container">
                  <Link to="/join"><div className="form-btn enterroom">Student</div></Link>
                  <Link to="/create" state={{ playerName: this.state.name }}><div className="form-btn createroom">Teacher</div></Link>
                </div>
            </div>
        </div>
    )
  }
}
