import React, { Component } from 'react';
import '../css/App.css';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';

class Home extends Component {
  render() {
    return (
      <div>
        <AppNavbar page="home"/>
        <Container fluid>
          <Button color="link" name="p"><Link to="/admin">Go to Admin Page</Link></Button>
        </Container>
      </div>
    );
  }
}

export default Home;
