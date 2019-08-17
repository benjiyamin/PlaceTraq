import React from 'react'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import GroupPage from './pages/Group'
import LandingPage from './pages/Landing'
import LoginPage from './pages/Login'
import MapPage from './pages/Map'
import ProjectPage from './pages/Project'
import SearchPage from './pages/Search'
import SignUpPage from './pages/SignUp'
import StatusPage from './pages/Status'
import ProfilePage from './pages/Profile'
import './App.css'

function App () {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path='/' component={LandingPage} />
          <Route exact path='/groups/:id' component={GroupPage} />
          <Route exact path='/profile' component={ProfilePage} />
          <Route exact path='/projects/:id' component={ProjectPage} />
          <Route exact path='/projects/:id/map' component={MapPage} />
          <Route exact path='/projects' component={SearchPage} />
          <Route exact path='/signup' component={SignUpPage} />
          <Route exact path='/login' component={LoginPage} />
          <Route component={StatusPage} />
        </Switch>
      </div>
    </Router>
  )
}

export default App
