import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import MainPage from './pages/MainPage'
import GlobalVoting from './pages/GlobalVoting'
import GlobalVotingPhotos from './pages/GlobalVotingPhotos'
import GlobalVotingMap from './pages/GlobalVotingMap'
import ClassificationVoting from './pages/ClassificationVoting'
import ClassificationVotingPhotos from './pages/ClassificationVotingPhotos'
import ClassificationVotingMap from './pages/ClassificationVotingMap'
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Menu from './pages/Menu';

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <MainPage />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/login-posmo">
          <Login posmo />
        </Route>
        <Route path="/forgot-password">
          <ForgotPassword />
        </Route>
        <Route path="/reset-password">
          <ResetPassword />
        </Route>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route path="/menu">
          <Menu />
        </Route>
        <Route path="/general-rating">
          <GlobalVoting />
        </Route>
        <Route path="/general-rating-photos">
          <GlobalVotingPhotos />
        </Route>
        <Route path="/general-rating-map">
          <GlobalVotingMap />
        </Route>
        <Route path="/classification-rating">
          <ClassificationVoting />
        </Route>
        <Route path="/classification-rating-photos">
          <ClassificationVotingPhotos />
        </Route>
        <Route path="/classification-rating-map">
          <ClassificationVotingMap />
        </Route>
        <Route path="/dashboard">
          <Dashboard />
        </Route>
      </Switch>
    </Router>
  );
}

// just testing

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
    </div>
  );
}
