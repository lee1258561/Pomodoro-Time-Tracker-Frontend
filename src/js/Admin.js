import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import Modal from 'react-awesome-modal';
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
                <p>{props.user.firstName + " " + props.user.lastName} has project(s) associated to him (her). Do you still want to delete?</p>
                <Button color="danger" name="ConfirmDelete" onClick={props.deleteUser}>Delete</Button>{' '}
                <Button color="secondary" name="Cancel" onClick={props.hidePopup}>Cancel</Button>
                
            </div>
        </Modal>

    );
}

class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [], 
            isLoading: true,
            showPopup: false,
            popupUser: {}
        };
        this.remove = this.remove.bind(this);
    }

    componentDidMount() {
        this.setState({isLoading: true});
        console.log("GET /users");

        // used to add fake users
        api.getUsers()
            .then(data => this.setState({users: data, isLoading: false}));
    }

    hidePopup() {
        this.setState({showPopup: false});
    }
    deleteUser() {
        this.hidePopup();
        this.remove(this.state.popupUser.id);
        
    }

    async remove(id) {
        await api.deleteUser(id)
            .then(() => {
                let updatedUsers = [...this.state.users].filter(i => i.id !== id);
                this.setState({users: updatedUsers});
        });
    }


    // To call project api later
    async handleClick(user) {
        // TODO: Replace with api.js
        await api.getProjects(user.id)
            .then((userProjects) => {

                if (userProjects.length != 0) {
                    this.setState({
                        showPopup: true,
                        popupUser: user
                    });
                }else {
                    this.remove(user.id);
                }
        });
         console.log("GET /users/" + user.id + "/projects");
         // this.forceUpdate();
        
    }

    render() {
        const {users, isLoading} = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        const userList = users.map(user => {
            //const address = `${group.address || ''} ${group.city || ''} ${group.stateOrProvince || ''}`;
            return <tr key={user.id}>
                <td style={{whiteSpace: 'nowrap'}}>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" name="EditUsers" tag={Link} to={"/admin/edit/" + user.id}>Edit</Button>
                        <Button size="sm" color="danger" name="DeleteUsers" onClick={() => this.handleClick(user)}>Delete</Button>
                    </ButtonGroup>
                </td>
            </tr>
        });
        let popup = (<div></div>);
        if (this.state.showPopup) {
            popup = (<DeletePopup user={this.state.popupUser} deleteUser={() => this.deleteUser()} hidePopup={() => this.hidePopup()}/>);
        }

        return (
            <div name="Admin">
                <AppNavbar page="admin"/>
                <Container fluid>
                    <div className="float-right">
                        <Button color="success" name="AddUser" tag={Link} to="/admin/edit/new">Add User</Button>
                    </div>
                    <h3>PPT Users</h3>
                    <Table className="mt-4">
                        <thead>
                            <tr>
                                <th width="20%">First Name</th>
                                <th width="20%">Last Name</th>
                                <th>Email</th>
                                <th width="10%">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userList}
                        </tbody>
                    </Table>
                </Container>
                {popup}
            </div>
        );
    }
}

export default Admin;
