import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import Modal from 'react-awesome-modal';
import AppNavbar from './AppNavbar';
import api from './api';
import '../css/timer.css';


function TerminatePopup(props) {
    return (
        <Modal 
            visible={true}
            width="400"
            height="300"
            effect="fadeInUp"
            onClickAway={() => props.hidePopup()}
        >
            <div style={{padding: "20px"}}>
                <h1>Warning</h1>
                <p>Do you want to log this partial Pomodoro into your project? Note that we will not log one-time pomodoro.</p> 
                <Button color="danger" name="ConfirmPut" onClick={props.confirmPut}>Yes</Button>{' '}
                <Button color="secondary" name="NoPut" onClick={props.refreshWindow}>No</Button>{' '}
                <Button color="secondary" name="Cancel" onClick={props.hidePopup}>Cancel</Button>{' '}
                
            </div>
        </Modal>

    );
}
//
function ContinuePopup(props) {
    return (
        <Modal 
            visible={true}
            width="400"
            height="300"
            effect="fadeInUp"
            // onClickAway={() => props.hidePopup()}
        >
            <div style={{padding: "20px"}}>
                <h1>Pomodoro Ended</h1>
                <p>Do you want to immediately start a new pomodoro on this project?</p> 
                <Button color="success" name="Continue" onClick={props.Continue}>Yes</Button>{' '}
                <Button color="secondary" name="NoPut" onClick={props.refreshWindow}>No</Button>{' '}
                
            </div>
        </Modal>

    );
}

// 

class Pomodoro extends Component {

    constructor(props) {
        super(props);

        this.pomoLength = 1500
        this.breakLength = 300

        this.state = {
            userId: this.props.match.params.id,
            projectId: this.props.match.params.pid,
            sessionId: "",
            project: {},
            isLoading: false,
            showPopup: false,
            continuePopup:false,
            Iscounting: false,
            isBreak: false,
            isOneTime: (this.props.match.params.pid == "one-time") ? true : false,
            time: {}, 
            seconds: this.pomoLength + this.breakLength,
            PomoCounter: 0,
            StartTime:""
        };
        this.timer = 0;
        this.startTimer = this.startTimer.bind(this);
        this.countDown = this.countDown.bind(this);
    }

    componentDidMount() {
        this.setTime(this.state.seconds);
        if (!this.state.isOneTime) this.loadData();
    }

    async loadData() {
        this.setState({isLoading: true});
        const project = await api.getSingleProject(this.state.userId, this.state.projectId);
        this.setState({
            project: project,
            isLoading: false
        });
    }

    async startTimer() {//click the start button of time tarcker
        if (!this.state.isOneTime) await this.createOrUpdateSession(true);
        this.setState({Iscounting : true});
        console.log(this.state.sessionId)

        if (this.timer == 0 && this.state.seconds > 0) {
          this.timer = setInterval(this.countDown, 1000);
        }
    }

    async countDown() {
        // Remove one second, set state so a re-render happens.
        this.setTime(this.state.seconds - 1);

        // Check if we're at zero.
        if (this.state.seconds == 0) {
            clearInterval(this.timer);
            if (!this.state.isOneTime) await this.createOrUpdateSession(false);
            console.log("Session : " + this.state.sessionId + "Updated")
            this.setState({continuePopup : true})

        }
    }


    createOrUpdateSession(isPost) {
        // x = new Date();
        // let hoursDiff = x.getHours() - x.getTimezoneOffset() / 60;
        // let minutesDiff = (x.getHours() - x.getTimezoneOffset()) % 60;
        // x.setHours(hoursDiff);
        // x.setMinutes(minutesDiff);
        let curTime = JSON.stringify(new Date()).replace(/\"/g, "");
        const SessionItem = {
            id: isPost ? 0 : this.state.sessionId,
            startTime: isPost ? curTime : this.state.StartTime,
            endTime: curTime,
            counter: isPost ? 0 : this.state.PomoCounter + 1
        }

        let requestPromise;
        if (isPost) requestPromise = api.postSession(this.state.userId, this.state.projectId, SessionItem)
        else requestPromise = api.putSession(this.state.userId, this.state.projectId, this.state.sessionId, SessionItem)
        
        return requestPromise.then(response => response.json())
        .then((data) => {
            this.setState({
                sessionId : data.id,
                PomoCounter : data.counter,
                StartTime : data.startTime,
            })
        });
    }

    setTime(seconds) {
        if (seconds > this.breakLength) {
            this.setState({
                time: this.secondsToTime(seconds - this.breakLength),
                isBreak: false,
                seconds: seconds,
            });
        }else {
            this.setState({
                time: this.secondsToTime(seconds),
                isBreak: true,
                seconds: seconds,
            });
        }
    }

    secondsToTime(secs){
        let hours = Math.floor(secs / (60 * 60));

        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);

        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);

        let obj = {
            "h": hours,
            "m": minutes,
            "s": seconds
        };
        return obj;
    }

    Continue(){
        this.setState({
            continuePopup: false,
            Iscounting : true
        })
        this.setTime(this.pomoLength + this.breakLength);
        this.timer = 0

        console.log(this.state.seconds);
        this.timer = setInterval(this.countDown, 1000);
    }

    handleClick() {
        this.setState({showPopup : true})
    }

    async confirmPut(){
        clearInterval(this.timer);
        if (!this.state.isOneTime) await this.createOrUpdateSession(false);

        console.log("Session : " + this.state.sessionId + "Updated")
        this.refreshWindow();
    }

    hidePopup() {
        this.setState({
            showPopup: false,
            continuePopup: false
        });
    }
    refreshWindow(){
        this.props.history.push("/user/" + this.state.userId);
    }

    render() {
        const {userId, projectId, sessionId, isLoading} = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }


        let popup = (<div></div>);
        if (this.state.showPopup) {
            popup = (<TerminatePopup confirmPut={() => this.confirmPut()} refreshWindow={() => this.refreshWindow()} hidePopup={() => this.hidePopup()}/>);
        }
        let TerminateButton = (<div></div>);
        let StartButton = (<div></div>);
        if (this.state.Iscounting){
            TerminateButton = (<Button color="danger" name="TerminatePomo" onClick={() => this.handleClick()}>Terminate</Button>);
        }else{
            StartButton = (<div style={{left: "50%"}}><Button name="StartPomo" color="success" onClick={this.startTimer}>Start</Button></div>);
        }
        let continuePopup = (<div></div>);
        if (this.state.continuePopup){
            continuePopup = (<ContinuePopup Continue={() => this.Continue()} refreshWindow={() => this.refreshWindow()} hidePopup={() => this.hidePopup()}/>);
        }
        let projectName = "One Time Pomodoro";
        if (!this.state.isOneTime) projectName = this.state.project.projectname;
        return (
            <div name="Pomodoro">
                <AppNavbar page={this.state.userId}/>
                <Container fluid>
                    <div className="float-right">
                        {StartButton}
                        {TerminateButton}
                    </div>
                    <h3>{projectName}</h3>
                    <h1 style={{textAlign: "center"}}> {this.state.isBreak ? "Break Time ends in:" : "Pomodoro ends in:"} </h1>
                    <div>
                        <div className="time-sec">
                            <h3 className="main-time">{this.state.time.m}</h3>
                            <p className="time-label">Min</p>
                        </div>
                        <div className="time-sec">
                            <h3 className="main-time">{this.state.time.s}</h3>
                            <p className="time-label">Sec</p>
                        </div>
                    </div>
                </Container>
                {popup}
                {continuePopup}
            </div>
        );
    }
}

export default Pomodoro;