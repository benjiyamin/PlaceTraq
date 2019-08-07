import React from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'

import LoginForm from '../components/forms/LoginForm'

function LoginPage ({ redirect, history }) {
  if (redirect) history.push(redirect)
  return (
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
  )
}
LoginPage.propTypes = {
  redirect: PropTypes.string,
  history: PropTypes.object
  // loadUser: PropTypes.func
}

export default LoginPage
