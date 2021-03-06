import React from 'react';
import classes from './App.module.css';
import Layout from "./hoc/Layout/Layout";
import {connect} from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import store from './store/store';
import {loadCurrentUser} from './store/actions/auth';
import {Provider as AlertProvider} from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import Alert from "./containers/Alert/Alert";
import asyncComponent from "./hoc/asyncComponent/asyncComponent";
import UnauthorizedWrapper from "./hoc/UnauthorizedWrapper/UnauthorizedWrapper";


const UnauthorizedUserMainPage = asyncComponent(() => {
    return import("./containers/UnauthorizedUserMainPage/UnauthorizedUserMainPage");
});

const UserPage = asyncComponent(() => {
    return import("./containers/UserPage/UserPage");
});

const Comments = asyncComponent(() => {
    return import("./containers/Comments/Comments");
})


const alertOptions = {
    timeout: 3000,
    position: 'top center',
}


class App extends React.Component {
    componentDidMount() {
        store.dispatch(loadCurrentUser());
    }

    render() {
        let routers = (
            <Switch>
                <Route path="/user/:username" exact render={() => (
                    <UnauthorizedWrapper>
                        <UserPage />
                    </UnauthorizedWrapper>)} />
                <Route path="/tweet/:postUuid" exact render={() => (
                    <UnauthorizedWrapper>
                        <Comments />
                    </UnauthorizedWrapper>
                )} />
                <Redirect from="/logout" to="/" />
                <Route path="/" component={UnauthorizedUserMainPage} />
                <Redirect from="*" to="/" />
            </Switch>
        );
        if(this.props.isAuthenticated){
            routers = (
                <Switch>
                    <Redirect from="/:url*(/+)" to="/" />
                    <Route path="/" component={Layout} />
                    <Redirect from="*" to="/" />
                </Switch>
            );
        }

        return (
            <AlertProvider
                template={AlertTemplate}
                {...alertOptions} >
                <Alert />
                    <div className={classes.App}>
                        {routers}
                    </div>
            </AlertProvider>
  )}
}

const mapStateToProps = state => (
    {
        isAuthenticated: state.auth.token !== null,
    }
);


export default connect(mapStateToProps)(App);
