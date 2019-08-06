import React from 'react'
import PropTypes from 'prop-types'

import { Col, Form, Button } from 'react-bootstrap'

import AppForm from './Form'
import API from '../../utils/API'

class SignUpForm extends AppForm {
    state = {
      email: '',
      password: ''
    }

    handleFormSubmit = event => {
      event.preventDefault()
      API.login({
        email: this.state.email,
        password: this.state.password
      })
        .catch(err => console.log(err))
        .finally(() => { if (this.props.afterUpdate) this.props.afterUpdate() })
    }

    render () {
      return (
        <Form>
          <Form.Group className='form-row'>
            <Col><Form.Control type='text' placeholder='First name' name='first_name' onChange={this.handleInputChange} /></Col>
            <Col><Form.Control type='text' placeholder='Last name' name='last_name' onChange={this.handleInputChange} /></Col>
          </Form.Group>
          <Form.Group>
            <Form.Control type='email' placeholder='Email' required='required' name='email' onChange={this.handleInputChange} />
          </Form.Group>
          <Form.Group>
            <Form.Control type='password' placeholder='Password' required='required' name='password' onChange={this.handleInputChange} />
          </Form.Group>
          <Form.Group>
            <Form.Control type='password' placeholder='Confirm Password' required='required' name='confirm_password' onChange={this.handleInputChange} />
          </Form.Group>
          <Form.Group>
            <Form.Check type='checkbox' inline />
                I accept the <a href='#'>Terms of Use</a> &amp; <a href='#'>Privacy Policy</a>
          </Form.Group>
          <Form.Group>
            <Button variant='primary' type='submit' className='btn-lg' onClick={this.handleFormSubmit}>
                  Sign Up
            </Button>
          </Form.Group>
        </Form>
      )
    }
}
SignUpForm.propTypes = {
  afterUpdate: PropTypes.func
}

export default SignUpForm
