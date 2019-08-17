import React from 'react'
import PropTypes from 'prop-types'

import { Form, Button } from 'react-bootstrap'

import AppForm from './Form'
import API from '../../utils/API'

class LoginForm extends AppForm {
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
        .then(() => { window.location.reload() })
        .catch(err => console.log(err))
        // .finally(() => { if (this.props.afterUpdate) this.props.afterUpdate() })
    }

    render () {
      return (
        <Form>
          <Form.Group>
            <Form.Control type='email' placeholder='Email' required='required' name='email' onChange={this.handleInputChange} />
          </Form.Group>
          <Form.Group>
            <Form.Control type='password' placeholder='Password' required='required' name='password' onChange={this.handleInputChange} />
          </Form.Group>
          <Form.Group>
            <Button variant='primary' size='lg' type='submit' onClick={this.handleFormSubmit}>
              Log In
            </Button>
          </Form.Group>
        </Form>
      )
    }
}
LoginForm.propTypes = {
  afterUpdate: PropTypes.func
}

export default LoginForm
