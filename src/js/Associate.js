import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import api from './api';

class Associate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userId: "",
            projectId: "",
            projects: [],
            isLoading: true
        };
    }

    async loadData() {
        this.setState({isLoading: true});
        const projects = await api.getProjects(this.props.match.params.id);
        this.setState({
            userId: this.props.match.params.id,
            projectId: this.props.match.params.pid,
            projects: projects,
            isLoading: false
        });
    }

    componentDidMount() {
        this.loadData();
    }

    handleStartClick(project) {
        console.log(project);
        console.log("POST /users/" + this.state.userId + "/projects/" + project.id + "/sessions");
        console.log("Take the response session id route to pomodoro page.");
    }

    render() {
        const {userId, projectId, projects, isLoading} = this.state;
        console.log(projectId);

        if (isLoading) {
            return <p>Loading...</p>;
        }

        const projectList = projects.map(project => {
            return <tr key={project.id}>
                <td style={{whiteSpace: 'nowrap'}}>{project.projectname}</td>
                <td style={{textAlign:"right"}}>
                    <ButtonGroup>
                        <Button size="sm" color="primary" name="StartPomodoro" tag={Link} to={"/users/" + userId + "/projects/" + project.id + "/sessions/"}>Start</Button>
                    </ButtonGroup>
                </td>
            </tr>
        });

        return (
            <div name="Associate">
                <AppNavbar page={this.state.userId}/>
                <Container fluid>

                    <h3>Associate Project</h3>
                    <Table className="mt-4">
                        <thead>
                            <tr>
                                <th width="20%">Project Name</th>
                                <th style={{textAlign:"right"}} width="10%">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projectList}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }
}

export default Associate;