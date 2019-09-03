import React, { Component } from 'react';
import {
    Collapse, 
    Nav, 
    Navbar, 
    NavbarBrand, 
    NavbarToggler,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem} from 'reactstrap';
import { Link } from 'react-router-dom';
import api from './api';


export default class AppNavbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            isLoading: true,
            isOpen: false
        };
        this.toggle = this.toggle.bind(this);
    }
    loadData() {
        this.setState({isLoading: true});
        console.log("appNavbar GET /users");

        api.getUsers()
        .then(data => this.setState({users: data, isLoading: false}));
    }

    //Maybe should use async await
    componentDidMount() {
        this.loadData();
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    componentWillReceiveProps(nextProps){
        api.getUsers()
        .then(data => this.setState({users: data, isLoading: false}));
    }

    render() {
        const userList = this.state.users.map(user => {
            return <DropdownItem key={user.id} tag={Link} to={"/user/" + user.id}>
                    {user.firstName + " " + user.lastName}
                </DropdownItem>
        });
        let identity;
        if (this.state.isLoading) identity = "Loading";
        else if (this.props.page == "home") identity = "Choose an Identity";
        else if (this.props.page == "admin") identity = "Administrator";
        else {
            const user = [...this.state.users].filter(i => i.id == this.props.page)[0];

            identity = user.firstName + " " + user.lastName;
        }
        return (<Navbar color="dark" dark expand="md">
            <NavbarBrand tag={Link} to="/">Pomodoro Time Tracker - Web 2</NavbarBrand>
            <NavbarToggler onClick={this.toggle}/>
            <Collapse isOpen={this.state.isOpen} navbar>
                <Nav className="ml-auto" navbar>
                    <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle nav caret>
                            {identity}
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem tag={Link} to="/admin">
                                Administrator
                            </DropdownItem>
                            <DropdownItem divider />
                            {userList}
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </Nav>
            </Collapse>
        </Navbar>);
    }
}