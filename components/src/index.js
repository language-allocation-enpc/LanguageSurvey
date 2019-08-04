import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { AppBar, Typography } from '@material-ui/core';

import './index.css';
import Login from './survey/LoginPage'
import Admin from './admin/Admin'
import AdminLogin from './admin/AdminLogin'
import CourseEditing from './admin/components/CourseEditing'
import GetAffect from './admin/components/getAffect'
import ManageStudents from './admin/components/studentManagement'
import ChangeStudents from './admin/components/changeStudent'
import ResultPage from './admin/components/resultPage.js'
import Page404 from './404.js'
import Questionnaire from "./survey/Questionnaire";

const routing = (
  <Router>
    <AppBar
      color='primary'>
      <Typography align='center' variant='h4' style={{color: 'white', padding:'0.5em'}}> Questionnaire Langues </Typography>
      </AppBar>

    <Switch>
      <Route exact path="/form" component={Questionnaire} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/admin" component={Admin} />
      <Route exact path="/admin/login" component={AdminLogin} />
      <Route exact path="/admin/manage-courses" component={CourseEditing} />
      <Route exact path="/admin/get-affect" component={ResultPage} />
      <Route exact path="/admin/manage-students" component={ManageStudents} />
      <Route exact path="/admin/change-students" component={ChangeStudents} />
      <Route component={Page404} />
    </Switch>
  </Router>
)
ReactDOM.render(routing, document.getElementById('root'));
