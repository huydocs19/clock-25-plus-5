import React, { Component } from 'react'

const defaultState = {
    breakLength: 5,
    sessionLength: 25,
    sessionTimeLeft: 1500,
    breakTimeLeft: 300,
    isRunning: false,
    isSessionRunning: true
  }
export default class Clock extends Component {
    constructor(props) {
        super(props); 
        this.state = {
          breakLength: 5,
          sessionLength: 25,
          sessionTimeLeft: 1500,
          breakTimeLeft: 300,
          isRunning: false,
          isSessionRunning: true
          
        }
        this.timer = 0
        this.gettMMSS = this.getMMSS.bind(this);
        this.reset = this.reset.bind(this);
        this.updateBreakLength = this.updateBreakLength.bind(this);
        this.updateSessionLength = this.updateSessionLength.bind(this);
        this.startStop = this.startStop.bind(this);
        this.updateSessionTimer = this.updateSessionTimer.bind(this);
        this.updateBreakTimer = this.updateBreakTimer.bind(this);
      }
      updateSessionTimer() {
        this.setState({sessionTimeLeft: this.state.sessionTimeLeft - 1})
        if (this.state.sessionTimeLeft < 0)
            {
              this.setState({sessionTimeLeft: this.state.sessionLength * 60, isSessionRunning: false});
              let audio = document.getElementById('beep');
              audio.play();
              setTimeout(() => {
                audio.pause();
                audio.currentTime = 0;
              }, 8000)
              clearInterval(this.timer);
              this.timer = setInterval(this.updateBreakTimer, 1000); 
               return;
            }
      }
      updateBreakTimer() {
        this.setState({breakTimeLeft: this.state.breakTimeLeft - 1})
        if (this.state.breakTimeLeft < 0)
            {
               this.setState({breakTimeLeft: this.state.breakLength * 60, isSessionRunning: true});
               let audio = document.getElementById('beep');
               audio.play();
               audio.play();
              setTimeout(() => {
                audio.pause();
                audio.currentTime = 0;
              }, 8000)
               clearInterval(this.timer);
               this.timer = setInterval(this.updateSessionTimer, 1000); 
               return;
            }
      }
      startStop() {
        if (!this.state.isRunning) {
          this.setState({isRunning: true});
          if (this.state.isSessionRunning) {
             this.timer = setInterval(this.updateSessionTimer, 1000); 
          } else {
            this.timer = setInterval(this.updateBreakTimer, 1000); 
            
          }
          
        } else {
          this.setState({isRunning: false});
          clearInterval(this.timer);
        }
      }
      updateBreakLength(value) {
        if (!this.state.isRunning && this.state.breakLength > 1 && this.state.breakLength < 60) {
          let newBreakLength = this.state.breakLength + value
          this.setState({breakLength: newBreakLength, breakTimeLeft: newBreakLength * 60});
         };
      }
      updateSessionLength(value) {
        if (!this.state.isRunning && this.state.sessionLength > 1 && this.state.sessionLength < 60) {
          let newSessionLength = this.state.sessionLength + value
          this.setState({sessionLength: newSessionLength, sessionTimeLeft: newSessionLength * 60});
        };
      }
      reset() {
        let audio = document.getElementById('beep');
        audio.pause();
        audio.currentTime = 0;
        clearInterval(this.timer);
        this.setState(defaultState);
      }
      getMMSS() {
        let timeLeft = 0;
        
        if (this.state.isSessionRunning) {
          timeLeft = this.state.sessionTimeLeft;      
        } else {
          timeLeft = this.state.breakTimeLeft;  
        } 
        console.log("time left", timeLeft);
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft - (minutes * 60);
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        return minutes+':'+seconds;
      }
      render() { 
        let startOrStop = this.state.isRunning? <i class="fas fa-pause"></i>: <i class="fas fa-play"></i>;
        let timerColor = this.state.sessionTimeLeft < 60 || this.state.breakTimeLeft < 60?{color: "#a50d0d"} : {color: "white"};
        return (
          <div>
            <h1 class="project-title">25 + 5 Clock</h1>
            <div class="user-input">
                <div class="break">
                    <h2 id="break-label">Break Length</h2>
                    <div class="length-input">
                        <div id="break-decrement" onClick={() => this.updateBreakLength(-1)}><i class="fas fa-arrow-down"></i></div>
                        <p id="break-length">{this.state.breakLength}</p>
                        <div id="break-increment" onClick={() => this.updateBreakLength(1)}><i class="fas fa-arrow-up"></i></div>
                    </div>
                </div>
                <div class="session">
                    <h2 id="session-label">Session Length</h2>
                    <div class="length-input">
                        <div id="session-decrement" onClick={() => this.updateSessionLength(-1)}><i class="fas fa-arrow-down"></i></div>
                        <p id="session-length">{this.state.sessionLength}</p>
                        <div id="session-increment" onClick={() => this.updateSessionLength(1)}><i class="fas fa-arrow-up"></i></div>
                    </div>
                </div>
            </div>
            
            <div class="timer" style={timerColor}>
                <h2 id="timer-label">{this.state.isSessionRunning?"Session": "Break"}</h2>
                <p id="time-left">{this.getMMSS()}</p>
            </div>
            <div class="timer-control"> 
                <div id="start_stop" onClick={this.startStop}>{startOrStop}</div>
                <div id="reset" onClick={this.reset}><i class="fas fa-sync"></i></div>
                <audio id="beep" loop>
                <source src=
        "https://orangefreesounds.com/wp-content/uploads/2021/04/Bank-machine-card-warning-beeps.mp3?_=1" 
                type="audio/mpeg" />
            </audio>
            </div>
            
          </div>
    
        );
      }
}
