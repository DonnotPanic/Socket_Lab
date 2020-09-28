import React from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';
import App from '../App'
import Login from '../login/login'
import Register from '../login/register'

const BasicRoute = () => (
    <HashRouter>
        <Switch>
            <Route exact path="/" component={App} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
        </Switch>
    </HashRouter>
);

export default BasicRoute;