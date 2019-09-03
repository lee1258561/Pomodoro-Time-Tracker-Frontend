import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import Modal from 'react-awesome-modal';
import AppNavbar from './AppNavbar';
import api from './api';

class ReportResult extends Component {

	constructor(props) {
        var reportItem = {
            sessions: [],
            completedPomodoros: '',
            totalHoursWorkedOnProject: ''
        };
        super(props);
        this.state = {
            isLoading: true,
            userId: this.props.match.params.id,
            projectId: this.props.match.params.pid,
            startDatetime: this.props.match.params.time1,
            endDatetime: this.props.match.params.time2,
            showPomoNum: this.props.match.params.p,
            showTotalHours: this.props.match.params.h,
            report: reportItem
        };
    }

    async loadData() {
        this.setState({isLoading: true});
        // TODO: fix the api or the parameters passed in
        const reportData = await api.getReport(this.state.userId, this.state.projectId, this.state.startDatetime, this.state.endDatetime, this.state.showPomoNum, this.state.showTotalHours)

        this.setState({
            report: reportData,
            isLoading: false
        });
    }

    componentDidMount() {
        this.loadData();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.match.params.id != prevProps.match.params.id) {
            this.loadData();
        }
    }

    render() {
        const {userId, report, isLoading} = this.state;


        if (isLoading) {
            return <p>Loading...</p>;
        }

        const sessionList = report.sessions.map(reportSession => {
            return <tr key={reportSession.startingTime}>
                <td style={{whiteSpace: 'nowrap'}}>{reportSession.startingTime}</td>
                <td style={{whiteSpace: 'nowrap'}}>{reportSession.endingTime}</td>
                <td style={{whiteSpace: 'nowrap'}}>{reportSession.hoursWorked}</td>

            </tr>
        });

        return (
            <div name="User">
                <AppNavbar page={this.state.userId}/>
                <Container fluid>
                    <h3>PPT Report</h3>
                    <Table className="mt-4">
                        <thead>
                            <tr>
                                <th width="20%">The number of Pomodoros: {report.completedPomodoros}</th>
                            </tr>
                            <tr>
                                <th width="20%">The total number of hours: {report.totalHoursWorkedOnProject}</th>
                            </tr>
                            <tr>
                                <th width="20%">Sessions</th>
                            </tr>
                            <tr>
                                <th width="20%">Starting Time</th>
                                <th width="20%">Ending Time</th>
                                <th width="20%">Work Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessionList}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }
}

export default ReportResult;
