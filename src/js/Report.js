import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import { Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import Modal from 'react-awesome-modal';
import AppNavbar from './AppNavbar';
import api from './api';

class Report extends Component {

	constructor(props) {
        var formContentItem = {
            projectId: '',
            startDatetime: '',
            endDatetime: '',
            showPomoNum: true,
            showTotalHours: true
        };
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
        	userId: "",
            user: {},
        	projects: [],
        	isLoading: true,
            dropdownOpen: false,
            formContent: formContentItem
        };
    }

    async loadData() {
        this.setState({isLoading: true});

        const user = await api.getSingleUser(this.props.match.params.id);
        const projects = await api.getProjects(this.props.match.params.id);
        console.log('projects');
        console.log(projects);


        this.setState({
            userId: this.props.match.params.id,
            user: user,
            projects: projects,
            isLoading: false
        });

        console.log(this.state);
    }

    componentDidMount() {
        this.loadData();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.match.params.id != prevProps.match.params.id) {
            this.loadData();
        }
    }

    /////////////////////////////////////////////////////
    // Dropdown
    /////////////////////////////////////////////////////

    toggle() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    getSelectOptionsProjects() {
        return this.state.projects.map(project => {
            return <option value={project.id}>{project.projectname}</option>
        });
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        let formContent = {...this.state.formContent};
        formContent[name] = value;
        this.setState({formContent});
    }

    async handleSubmit(event) {
        event.preventDefault();
        this.props.history.push('/users/' + this.state.userId + '/projects/' + this.state.formContent.projectId + '/report/from/' + this.state.formContent.startDatetime + '/to/' + this.state.formContent.endDatetime + '/pomonum/' + this.state.formContent.showPomoNum + '/hours/' + this.state.formContent.showTotalHours);
        // alert('/users/' + this.state.userId + '/projects/' + this.state.formContent.projectId + '/report/from/' + this.state.formContent.startDatetime + '/to/' + this.state.formContent.endDatetime + '/pomonum/' + this.state.formContent.showPomoNum + '/hours/' + this.state.formContent.showTotalHours);
    }

    render() {

        if (this.state.isLoading) {
            return <p>Loading...</p>;
        }

        return <div>
            <AppNavbar page={this.state.user.id}/>
            <Container>
                <h2>Generate Report</h2>
                <Form onSubmit={this.handleSubmit}>

                    <FormGroup>
                    <Label for="projectId">Select Project</Label>
                    <Input type="select" name="projectId" id="projectId" onChange={this.handleChange}>
                        <option value=""></option>
                        {this.getSelectOptionsProjects()}
                    </Input>
                    </FormGroup>

                    <FormGroup>
                    <Label for="startDatetime">Start Datetime</Label>
                    <Input type="text" name="startDatetime" id="startDatetime" placeholder="Start Datetime" onChange={this.handleChange} />
                    </FormGroup>

                    <FormGroup>
                    <Label for="endDatetime">End Datetime</Label>
                    <Input type="text" name="endDatetime" id="endDatetime" placeholder="End Datetime" onChange={this.handleChange} />
                    </FormGroup>

                    <FormGroup check inline>
                    <label>
                      Include Count
                      <input
                        name="showPomoNum"
                        type="checkbox"
                        checked={this.state.formContent.showPomoNum}
                        onChange={this.handleChange} />
                    </label>
                    </FormGroup>

                    <FormGroup check inline>
                    <label>
                      Include Time
                      <input
                        name="showTotalHours"
                        type="checkbox"
                        checked={this.state.formContent.showTotalHours}
                        onChange={this.handleChange} />
                    </label>
                    </FormGroup>

                    <FormGroup>
                        <Button name="p">Submit</Button>
                    </FormGroup>
                </Form>
             </Container>
        </div>
    }
}

export default withRouter(Report);
