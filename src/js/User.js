import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import Modal from 'react-awesome-modal';
import AppNavbar from './AppNavbar';
import api from './api';

function DeletePopup(props) {
    return (
        <Modal 
            visible={true}
            width="400"
            height="300"
            effect="fadeInUp"
            onClickAway={() => props.hidePopup()}
        >
            <div style={{padding: "20px"}} name="DeletePopup">
                <h1>Warning</h1>
                <p>{props.project.projectname} has time associated to it. Do you still want to delete?</p> 
                <Button color="danger" name="ConfirmDelete" onClick={props.confirmDeleteProject}>Delete</Button>{' '}
                <Button color="secondary" name="Cancel" onClick={props.hidePopup}>Cancel</Button>
                
            </div>
        </Modal>

    );
}

function PomodoroPopup(props) {
    return (
        <Modal 
            visible={true}
            width="400"
            height="300"
            effect="fadeInUp"
            onClickAway={() => props.hidePopup()}
        >
            <div style={{padding: "20px"}} name="PomodoroPopup">
                <h1>Wanna associate a project?</h1>
                <Button color="success" name="ConfirmAssociate" tag={Link} to={"/users/" + props.userId + "/pomodoro/selection"}>Associate</Button>{' '}
                <Button color="success" name="noAssociate" tag={Link} to={"/users/" + props.userId + "/projects/one-time/sessions"}>One-time</Button>{' '}
                <Button color="secondary" name="Cancel" onClick={props.hidePopup}>Cancel</Button>
            </div>
        </Modal>

    );
}

class User extends Component {

	constructor(props) {
        super(props);
        this.state = {
        	userId: "",
            user: {},
        	projects: [],
            popupProject: {},
        	isLoading: true,
            showPopup: false,
            showPomoPopup: false
        };
    }

    async loadData() {
        this.setState({isLoading: true});

        console.log("GET /users/" + this.props.match.params.id);
        console.log("GET /users/" + this.props.match.params.id + "/projects");

        const user = await api.getSingleUser(this.props.match.params.id);
        const projects = await api.getProjects(this.props.match.params.id);


        this.setState({
            userId: this.props.match.params.id,
            user: user,
            projects: projects,
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

    hidePopup() {
        this.setState({
            showPopup: false,
            showPomoPopup: false
        });
    }
    confirmDeleteProject() {
        this.remove(this.state.popupProject.id);
        this.hidePopup();
    }

    async remove(id) {
        console.log("DELETE /users/" + this.state.user.id + "/projects/" + id);
        await api.deleteProject(this.state.user.id, id)
        .then(() => {
            let updatedProjects = [...this.state.projects].filter(i => i.id !== id);
            this.setState({projects: updatedProjects});
        });
    }

    async handleDeleteClick(project) {
        console.log("GET /users/" + this.state.user.id + "/projects/" + project.id + "/session");
        let sessions = await api.getReport(this.state.user.id, project.id, "2019-01-01T00:00Z", "2020-01-01T00:00Z", true, true);
        console.log(sessions);
        if (sessions.sessions.length == 0 || sessions.completedPomodoros == 0){
            this.remove(project.id);
        }else {
            this.setState({
                showPopup: true,
                popupProject: project
            });
        }

    }

    handlePomoClick() {
        this.setState({
            showPomoPopup: true
        });
    }

    render() {
        const {userId, user, projects, isLoading} = this.state;


        if (isLoading) {
            return <p>Loading...</p>;
        }

        const projectList = projects.map(project => {
            return <tr key={project.id}>
                <td style={{whiteSpace: 'nowrap'}}>{project.projectname}</td>
                <td style={{textAlign:"right"}}>
                    <ButtonGroup>
                        <Button size="sm" color="primary" name="EditProject" tag={Link} to={"/users/" + userId + "/project/" + project.id}>Edit</Button>
                        <Button size="sm" color="danger" name="DeleteProject" onClick={() => this.handleDeleteClick(project)}>Delete</Button>
                    </ButtonGroup>
                </td>
            </tr>
        });
        let popup = (<div></div>);
        if (this.state.showPopup) {
            popup = (<DeletePopup project={this.state.popupProject} confirmDeleteProject={() => this.confirmDeleteProject()} hidePopup={() => this.hidePopup()}/>);
        } else if (this.state.showPomoPopup) {
            popup = (<PomodoroPopup userId={this.state.userId} hidePopup={() => this.hidePopup()}/>);
        }

        return (
            <div name="User">
                <AppNavbar page={this.state.user.id}/>
                <Container fluid>

                    <div className="float-right">
                        <Button color="success" name="AddPomodoro" onClick={() => this.handlePomoClick()}>Start a Pomodoro</Button>{'  '}
                        <Button color="success" name="AddProject" tag={Link} to={"/users/" + userId + "/project/new"}>Add a project</Button>{' '}
                        <Button color="success" name="GenerateReport" tag={Link} to={"/user/" + userId + "/report"}>Generate Report</Button>
                    </div>

                    <h3>PPT Projects</h3>
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
                {popup}
            </div>
        );
    }
}

export default User;
