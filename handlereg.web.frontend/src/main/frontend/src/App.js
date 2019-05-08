import React, { Component } from 'react';
import { Switch, Route, BrowserRouter as Router, NavLink } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Home from './components/Home';
import NyButikk from './components/NyButikk';
import Login from './components/Login';

class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/handlereg/" component={Home} />
                    <Route exact path="/handlereg/nybutikk" component={NyButikk} />
                    <Route exact path="/handlereg/login" component={Login} />
                </Switch>
            </Router>
        );
    }
}

export default App;