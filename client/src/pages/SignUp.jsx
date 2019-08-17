import React from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'

import SignUpForm from '../components/forms/SignUpForm'
import Navbar from '../components/Navbar'

function SignUpPage ({ redirect, history }) {
  if (redirect) history.push(redirect)
  return (
    <>
      <Navbar />
      <Container className='mt-4'>
        <Row className='justify-content-center'>
          <Col lg={6}>
            <h2>Sign Up</h2>
            <p>Please fill in this form to create an account!</p>
            <hr />
            <SignUpForm />
            <div className='hint-text'>Already have an account? <Link to='/login'>Log In</Link></div>
          </Col>
        </Row>
      </Container>
    </>
  )
}
SignUpPage.propTypes = {
  redirect: PropTypes.string,
  history: PropTypes.object
  // loadUser: PropTypes.func
}

export default SignUpPage
