import React, { Component } from 'react';
import '../css/App.css';
import { BrowserRouter as Router, Route, Switch, HashRouter } from 'react-router-dom';
import Home from './Home';
import Admin from './Admin';
import EditUser from './EditUser';
import User from './User';
import Report from './Report';
import AddProject from './AddProject';
import Associate from './Associate';
import Pomodoro from './Pomodoro';
import ReportResult from './ReportResult';

class App extends Component {
    render() {
        return (
            <HashRouter>
                <div>
                    <Route exact path='/'  component={Home}/>
                    <Route exact path='/admin' component={Admin}/>
                    <Route exact path='/admin/edit/:id' component={EditUser}/>
                    <Route exact path='/user/:id' component={User}/>
                    <Route exact path='/user/:id/report' component={Report}/>
                    <Route exact path='/users/:id/project/:projectId' component={AddProject}/>
                    <Route exact path='/users/:id/pomodoro/selection' component={Associate}/>
                    <Route exact path='/users/:id/projects/:pid/sessions/' component={Pomodoro}/>
                    <Route exact path='/users/:id/projects/:pid/report/from/:time1/to/:time2/pomonum/:p/hours/:h' component={ReportResult}/>
                </div>
            </HashRouter>
        );
    }
}

export default App;
