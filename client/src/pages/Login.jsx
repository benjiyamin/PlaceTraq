import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'

import API from '../utils/API'
import LoginForm from '../components/forms/LoginForm'
import Navbar from '../components/Navbar'

class LoginPage extends Component {
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
    if (this.state.user) this.props.history.push('/profile')
    return (
      <>
        <Navbar />
        <Container className='mt-4'>
          <Row className='justify-content-center'>
            <Col lg={6}>
              <h2>Log In</h2>
              <p>Welcome back!</p>
              <hr />
              <LoginForm />
              <div className='hint-text'>Don't have an account? <Link to='/signup'>Sign Up</Link></div>
            </Col>
          </Row>
        </Container>
      </>
    )
  }
}
LoginPage.propTypes = {
  // redirect: PropTypes.string,
  history: PropTypes.object
  // loadUser: PropTypes.func
}

export default LoginPage
