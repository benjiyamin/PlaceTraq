import React from 'react'
import PropTypes from 'prop-types'

import { Link, Redirect } from 'react-router-dom'
import { Navbar, Nav } from 'react-bootstrap'

import API from '../utils/API'

function AppNavbar ({ user }) {
  function logOutHandler () {
    API.logout()
      .then(() => { return <Redirect to='/' /> })
  }

  return (
    <Navbar bg='dark' expand='lg' fixed='top' variant='dark'>
      <Navbar.Brand><Link className='text-white text-decoration-none' to='/'>PlaceTraq</Link></Navbar.Brand>
      <Navbar.Toggle aria-controls='basic-navbar-nav' />
      <Navbar.Collapse id='basic-navbar-nav'>
        {user
          ? (
            <Nav className='ml-auto'>
              <Nav.Item><Link className='nav-link' to='/profile'>Profile</Link></Nav.Item>
              <Nav.Item><Link className='nav-link' to='/' onClick={logOutHandler}>Log Out</Link></Nav.Item>
            </Nav>
          ) : (
            <Nav className='ml-auto'>
              <Nav.Item><Link className='nav-link' to='/login'>Log In</Link></Nav.Item>
            </Nav>
          )
        }
      </Navbar.Collapse>
    </Navbar>
  )
}
AppNavbar.propTypes = {
  user: PropTypes.object
}

export default AppNavbar
