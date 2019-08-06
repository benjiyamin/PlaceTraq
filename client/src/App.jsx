import React, { Component } from 'react'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import API from './utils/API'
import Navbar from './components/Navbar'
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

class App extends Component {
  state = {
    user: null
  }

  componentDidMount () {
    this.loadUser()
  }

  loadUser = () => {
    API.getRequestUser()
      .then(res => this.setState({ user: res.data }))
      .catch(error => console.error(error))
  }

  render () {
    return (
      <Router>
        <div>
          <Navbar user={this.state.user} />
          <div className='w-100' style={{ height: '56px' }} />
          <Switch>
            <Route exact path='/' render={props => <LandingPage {...props}
              signUp={!this.state.user} />} />
            <Route exact path='/groups/:id' render={props => <GroupPage {...props}
              user={this.state.user} />} />
            <Route exact path='/profile' render={props => <ProfilePage {...props}
              user={this.state.user} redirect={!this.state.user ? '/login' : null} />} />
            <Route exact path='/projects/:id' render={props => <ProjectPage {...props}
              user={this.state.user} />} />
            <Route exact path='/projects/:id/map' render={props => <MapPage {...props}
              user={this.state.user} />} />
            <Route exact path='/projects' component={SearchPage} />
            <Route exact path='/signup' render={props => <SignUpPage {...props}
              redirect={this.state.user ? '/profile' : null} loadUser={this.loadUser} />} />
            <Route exact path='/login' render={props => <LoginPage {...props}
              redirect={this.state.user ? '/profile' : null} loadUser={this.loadUser} />} />
            <Route component={StatusPage} />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App
