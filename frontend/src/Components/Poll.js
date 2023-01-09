import React, { Component } from 'react';
import { socket } from './Header';
import swal from 'sweetalert';
import { withRouter } from "react-router-dom";

class Poll extends Component {
  constructor(props) {
    super(props);
    this.state = {
        question: '',
        options: '',
        totalVotes: 0,
        buttonText: {
          student: 'Submit',
          studentAfterSubmit: 'Waiting for new question',
          teacher: 'Create new question',
        },
        correctAns: -1,
        choosedAns: 1,
        secondsRemaining: 0,
        quesEndTime: null,
        role: this.props.role
    }
  }

  showError = ({msg}) => {
    swal("Error", msg, "error");
    console.log(msg);
  }

  newQuestion = (ques) => {
    if(this.state.role == 'teacher') return;

    console.log('NEW QUESTION : ', ques);
    this.setState({role: 'student'}, () => this.updateQuestion(ques));
    // console.log('NEW QUESTION : ', ques);
    // if(this.state.role == 'studentAfterSubmit') this.setState({role: 'student'});
    // this.updateQuestion(ques);
  }

  updateQuestion = (ques, lastAction) => {
    if(!ques.ques) return;
    console.log('UPDATE QUESTION');

    this.setState({
        question: ques.ques,
        options: [...ques.options],
        totalVotes: ques.totalVotes,
        quesEndTime: ques.quesEndTime,
        secondsRemaining: Math.floor((new Date(ques.quesEndTime) - Date.now()) / 1000),
        correctAns: ques.correctAns || this.state.correctAns,
    });

    if(this.state.role == 'student' && !this.interval) {
      console.log('CREATING INTERVAL')
      this.interval = setInterval(() => {
        this.setState({secondsRemaining: this.state.secondsRemaining - 1},() => {
          if(this.state.secondsRemaining <= 0) {
            console.log('CLEAR INTERVAL');
            clearInterval(this.interval);
            this.interval = undefined;
            this.submit();
          }
        });
      }, 1000);
    }
  }

  questionResetDone = () => {
    console.log('QUESTION RESET DONE FN()');
    if(this.state.role == 'teacher') return this.props.history.push('/ask');

    this.setState({
      question: '',
      choosedAns: 1,
      role: this.props.role,
      correctAns: -1,
      secondsRemaining: 0
    });
  }

  chooseAns = (id) => {
    this.setState({
        choosedAns: id
    });
  }

  submit = () => {
    if(this.state.role == 'teacher') socket.emit('questionReset', {roomID: this.props.roomID});
    else socket.emit('submit', {roomID: this.props.roomID, choosedAns: this.state.choosedAns});
  }

  componentDidMount() {
    socket.emit('getCurrQuestion', {roomID: this.props.roomID});
    socket.on('questionUpdated', this.updateQuestion);

    socket.on('failed', this.showError);
    socket.on('submitted', (correctAns) => {
      clearInterval(this.interval);
      this.interval = null;
      this.setState({role: 'studentAfterSubmit', correctAns: correctAns});
    });
    socket.on('questionResetDone', this.questionResetDone);
    socket.on('newQuestion', this.newQuestion);
    socket.on('teacherLeft', () => this.props.history.push('/'));
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    console.log(this.state);
    return (
     <div className='step-container'>
      {
        this.state.question == '' ? <div className='headText'>Waiting for Teacher to ask question</div> :
        <div className="step-container ask-container">
            <div className="head">
                <h1 className="headText">{this.state.question}</h1>
            </div>

            <div className="option-container">
            {
                this.state.options.map(option => (
                    <div className="input-group" key={option.id}>
                        <div className="input-group-text"><input className="form-check-input mt-0" type="radio" value="" disabled={this.state.role != 'student'} checked={this.state.choosedAns == option.id} onChange={() => this.chooseAns(option.id)}/></div>
                        <div className="form-control" onClick={() => this.state.role == 'student' && this.chooseAns(option.id)}>
                            {
                              this.state.role == 'student' ? <div className='name'>{option.text}</div> :
                              <div className="name" style={{width: `calc(${Math.floor(option.count/(this.state.totalVotes || 1) * 100)}% - 71px)`, 
                              background: Math.floor(option.count/(this.state.totalVotes || 1) * 100) == 0 ? 'none' : 
                              (this.state.correctAns == option.id ? '#d6ecd6' : '#eff1f2')}}>{option.text}</div>
                            }
                            
                            {
                              this.state.role == 'student' ? '' :
                              <div className='percentage' style={{background : this.state.correctAns == option.id ? '#d6ecd6' : '#eff1f2'}}>{Math.floor(option.count/(this.state.totalVotes || 1) * 100)} %</div>
                            }
                        </div>
                    </div>
                ))
            }
            </div>

            {
                <button className="btn submitBtn" type="button" style={{marginLeft: '0px'}} disabled={this.state.role == 'studentAfterSubmit'} onClick={this.submit}>
                    {this.state.buttonText[this.state.role]}
                </button>
            }

            {
              this.state.role == 'student' ? <div className='timer headText'>Timer : {this.state.secondsRemaining}</div> : ''
            }
        </div>
      }
     </div>
    )
  }
}

export default withRouter(Poll);
