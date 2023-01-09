import React, { Component } from 'react';
import axios from 'axios';
import { socket } from './Header';
import swal from 'sweetalert';
import { withRouter } from 'react-router';

class Teacher extends Component {
  constructor() {
    super();
    this.state = {
        quesText: '',
        ques: [{text: '', id: 1}, {text: '', id: 2}],
        correctAns: 1,
        alert: ['', ''],
        timer: 20,
    }
  }  

  showError = ({msg}) => {
    swal("Error", msg, "error");
    console.log(msg);
  }

  handleText = (e) => {
    this.setState({
        quesText: e.target.value
    })
  }

  handleQuesText = (e, id) => {
    this.setState({
        ques: this.state.ques.map(ques => ques.id === id ? ({text: e.target.value, id}) : ques)
    })
  }

  addQuestion = () => {
    this.setState({
        ques: [...this.state.ques, {text: '', id: this.state.ques.length+1}]
    })
  }

  deleteQuestion = (id) => {
    const newQues = this.state.ques.filter(ques => ques.id !== id);

    this.setState({
        ques: newQues.map((obj , i) => {return {...obj, id: i+1}}),
        correctAns: this.state.correctAns === id ? -1 : this.state.correctAns
    })
  }

  setCorrectAns = (id) => {
    this.setState({
        correctAns: id
    })
  }

  askQues = () => {
    socket.emit('uploadQuestion', {
        roomID: this.props.roomID,
        ques: this.state.quesText,
        options: [...this.state.ques],
        correctAns: this.state.correctAns,
        quesEndTime: Date.now() + this.state.timer * 1000
    })
  }

  copyCode = (e) => {
    navigator.clipboard.writeText(this.state.alert[1]);
    e.target.innerText = 'Copied!';
  }

  componentDidMount() {
    socket.on('failed', this.showError);
    socket.on('newQuestion', () => this.props.history.push('/poll'))
  }

  render() {
    return (
      <div>
        <div className="step-container ask-container step-3">

            <div className="head">
                <h1 className="headText" style={{fontSize: '40px', paddingBottom: '50px'}}>What do you want to ask ? <p style={{fontSize: '15px'}}>{this.state.timer} seconds to answer</p></h1>
                {
                    this.state.alert[0] === 'error' ? 
                    <div className="alert alert-danger" role="alert">{this.state.alert[1]}</div> : 
                    this.state.alert[0] === 'success' ? 
                    <div className="alert alert-success successPoll" role="alert">
                        <p className="successMsg">{this.state.alert[1]}</p>
                        <button className="copyLinkBtn" onClick={this.copyCode}>Copy Code</button>
                    </div> : ''
                }
            </div>

            <div className="questionArea form-floating mb-3">
                <input className="form-control" value={this.state.quesText} id="floatingInput" type="text" placeholder="Enter your question" onChange={this.handleText}/>
                <label htmlFor="floatingInput">Question</label>
            </div>

            <div className="option-container">
                {
                    this.state.ques.map(ques => (
                        <div className="input-group input-group-lg" key={ques.id}>
                            <span className="input-group-text option-text" id="inputGroup-sizing-default">Option {ques.id}</span>
                            <input className="form-control" type="text" value={ques.text} onChange={(e) => this.handleQuesText(e, ques.id)} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
                            <span className="input-group-text delete" id="inputGroup-sizing-default" onClick={() => this.deleteQuestion(ques.id)}>-</span>

                            <div className="input-group-text">
                                <input className="form-check-input mt-0" type="checkbox" checked={this.state.correctAns === ques.id} onChange={() => this.setCorrectAns(ques.id)} aria-label="Checkbox for following text input"/>
                            </div>
                        </div>
                    ))
                }
            </div>

            <div className="action-container">
                <i className="fa fa-plus-circle" onClick={this.addQuestion}></i>
                <button className="btn askBtn" type="button" onClick={this.askQues}>Ask</button>
            </div>
        </div>

        <input type='range' className='timerInput' value={this.state.timer} onChange={(e) => this.setState({timer: e.target.value})}></input>
      </div>
    )
  }
}

export default withRouter(Teacher)