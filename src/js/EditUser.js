import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './AppNavbar';
import api from './api';


class EditUser extends Component {
    constructor(props) {  
        var emptyItem = {
            firstName: '',
            lastName: '',
            email: ''
        };
        super(props);  
        this.state = {
            user: emptyItem
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    async componentDidMount() {
        if (this.props.match.params.id !== 'new') {
            console.log("GET /users/" + this.props.match.params.id );
            const data = await api.getSingleUser(this.props.match.params.id);
            this.setState({user: data});
        }
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let user = {...this.state.user};
        user[name] = value;
        this.setState({user});
    }

    async handleSubmit(event) {
        event.preventDefault();
        const user = this.state.user;
        if (user.id) {
            const result2 = await api.putUser(user.id, user);
            console.log("update email");
            console.log(result2.status);
            this.props.history.push('/admin');
        } 
        else {
            const result = await api.postUser(user);
            // console.log(result.status)
            if (result.status == 409) {
                alert("The email has been used. Please use a new email.");
            } else {
                this.props.history.push('/admin');
            }
        }
    }

    render() {
        const {user} = this.state;
        const title = <h2>{user.id ? 'Edit User' : 'Add User'}</h2>;
        const email = <Label for="email">{user.id ? null : 'Email'}</Label>;
        const hide = user.id ? 'none' : 'block';

        return <div name="testEditUser">
            <AppNavbar page="admin"/>
            <Container>
                {title}
                <Form onSubmit={this.handleSubmit}>
                    <div className="row">
                        <FormGroup className="col-md-4 mb-3">
                            <Label for="firstName">First Name</Label>
                            <Input type="text" name="firstName" id="firstName" value={user.firstName || ''}
                                onChange={this.handleChange} autoComplete="address-level1"/>
                        </FormGroup>
                        <FormGroup className="col-md-5 mb-3">
                            <Label for="lastName">Last Name</Label>
                            <Input type="text" name="lastName" id="lastName" value={user.lastName || ''}
                                onChange={this.handleChange} autoComplete="address-level1"/>
                        </FormGroup>
                    </div>

                    <FormGroup>
                        {email}
                        <Input style={{display: hide}} type="text" name="email" id="email" value={user.email || ''}
                            onChange={this.handleChange} autoComplete="name"/>
                    </FormGroup>

                    <FormGroup>
                        <Button color="primary" name="p" type="submit">Save</Button>{' '}
                        <Button color="secondary" name="Cancel" tag={Link} to="/admin">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }
}

export default withRouter(EditUser);
