import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './AppNavbar';
import api from './api';

class AddProject extends Component {
    constructor(props) {  
        var projectItem = {
            projectname: '',
            userId: ''
        };
        super(props);  
        this.state = {
            userID : this.props.match.params.id,
            project: projectItem
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    async componentDidMount() {
        if (this.props.match.params.projectId !== 'new') {
            console.log("GET /users/" + this.props.match.params.id + "/projects/" + this.props.match.params.projectId);
            const data = await api.getSingleProject(this.props.match.params.id, this.props.match.params.projectId);
            this.setState({project: data});
        }
    }
    // not understand handleChange, autoComplete?
    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let project = {...this.state.project};
        project[name] = value;
        this.setState({project});
    }

    async handleSubmit(event) {
        event.preventDefault();
        const {userID, project} = this.state;
        if (project.id) {
            const result2 = await api.putProject(userID, project.id, project);
            // console.log("update project name");
            // console.log(result2.status);
            // this.props.history.push("/user/" + userID);
            if (result2.status == 409) {
                alert("The project name has been used. Please use a new one.");
            } else {
                this.props.history.push("/user/" + userID);
            }
        } else {
            const result = await api.postProject(userID, project);
            //console.log(result.status)
            if (result.status == 409) {
                alert("The project name has been used. Please use a new one.");
            } else {
                this.props.history.push("/user/" + userID);
            }
        }
    }

    render() {
        const {userID, project} = this.state;
        const title = <h2>{project.id ? 'Edit Project' : 'Add Project'}</h2>;

        return <div name="testAddProject">
            <AppNavbar page= {this.state.userID}/>
            <Container>
                {title}
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>

                        <Label for="projectname">Project Name</Label>
                        <Input type="text" name="projectname" id="projectname" value={project.projectname || ''}
                            onChange={this.handleChange} autoComplete="address-level1"/>
                    </FormGroup>
                    <FormGroup>
                        <Button color="primary" name="q" type="submit">Save</Button>{' '}
                        <Button color="secondary" name="Cancel" tag={Link} to={"/user/" + userID}>Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }
}

export default withRouter(AddProject);
