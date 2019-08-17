import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'

import API from '../utils/API'
import SignUpForm from '../components/forms/SignUpForm'
import Navbar from '../components/Navbar'

class SignUpPage extends Component {
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
}
SignUpPage.propTypes = {
  // redirect: PropTypes.string,
  history: PropTypes.object
  // loadUser: PropTypes.func
}

export default SignUpPage
