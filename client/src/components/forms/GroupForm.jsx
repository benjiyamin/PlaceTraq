import React from 'react'
import PropTypes from 'prop-types'

import { Row, Col, Form } from 'react-bootstrap'

import AppForm from './Form'
import API from '../../utils/API'
import 'react-quill/dist/quill.snow.css'

class GroupForm extends AppForm {
  state = {
    id: this.props.group ? this.props.group.id : null,
    name: this.props.group ? this.props.group.name : null,
    description: this.props.group ? this.props.group.description : null
  }

  handleFormSubmit = event => {
    if (event) event.preventDefault()
    const groupData = {
      name: this.state.name,
      description: this.state.description
    }
    if (this.state.id) groupData.id = this.state.id

    const APICall = () => this.state.id ? API.putGroup(groupData) : API.postGroup(groupData)

    APICall()
      .catch(err => console.log(err))
      .finally(() => { if (this.props.afterUpdate) this.props.afterUpdate() })
  }

  render () {
    const name = this.state.name
    const description = this.state.description
    return (
      <Form>
        <Form.Group as={Row}>
          <Form.Label column sm='2'>Group Name</Form.Label>
          <Col sm='10'>
            <Form.Control name='name' type='text' placeholder='Enter text' onChange={this.handleInputChange} value={name || ''} />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm='2'>Description</Form.Label>
          <Col sm='10'>
            <Form.Control as='textarea' rows='4' name='description' placeholder='Enter description' onChange={this.handleInputChange} value={description || ''} />
          </Col>
        </Form.Group>
      </Form>
    )
  }
}
GroupForm.propTypes = {
  group: PropTypes.object,
  afterUpdate: PropTypes.func
}

export default GroupForm
