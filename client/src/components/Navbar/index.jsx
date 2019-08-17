import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'
import { Navbar, Nav } from 'react-bootstrap'

import API from '../../utils/API'
import './style.css'

class AppNavbar extends Component {
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

  logOutHandler () {
    API.logout()
      .then(() => { window.location.reload() })
      .catch(err => console.log(err))
  }

  render () {
    const user = this.state.user
    const transparent = this.props.transparent
    return (
      <>
        <Navbar bg={transparent ? 'transparent' : 'white'} expand='lg' sticky={this.props.sticky ? 'top' : null}
          fixed={this.props.sticky ? null : 'top'} variant={transparent ? 'dark' : 'light'}>
          <Navbar.Brand className='ml-5'><Link className='text-white text-decoration-none' to='/'>
            <img src={transparent ? '/images/placetrac-logo-white.svg' : '/images/placetrac-logo.svg'} className='pt-logo' />
          </Link></Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ml-auto mr-5'>
              {user
                ? (
                  <>
                    <Nav.Item><Link className='nav-link h4 m-0' to='/profile'>Profile</Link></Nav.Item>
                    <Nav.Item><Link className='nav-link h4 m-0' to='/' onClick={this.logOutHandler}>Log Out</Link></Nav.Item>
                  </>
                ) : (
                  <Nav.Item><Link className='nav-link' to='/login'>Log In</Link></Nav.Item>
                )
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        {!transparent ? <div className='w-100' style={{ height: '56px' }} /> : null}
      </>
    )
  }
}
AppNavbar.propTypes = {
  transparent: PropTypes.bool,
  sticky: PropTypes.bool
}

export default AppNavbar
