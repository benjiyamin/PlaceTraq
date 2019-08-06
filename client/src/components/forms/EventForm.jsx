import React from 'react'
import PropTypes from 'prop-types'

import { Row, Form } from 'react-bootstrap'
import moment from 'moment'

import AppForm from './Form'
import API from '../../utils/API'

class EventForm extends AppForm {
  state = {
    id: this.props.event ? this.props.event.id : null,
    name: this.props.event ? this.props.event.name : null,
    description: this.props.event ? this.props.event.description : null,
    start: this.props.event ? this.props.event.start : null
  }

  handleFormSubmit = event => {
    event.preventDefault()
    const eventData = {
      name: this.state.name,
      description: this.state.description,
      start: this.state.start
    }
    if (this.state.id) eventData.id = this.state.id

    const APICall = () => this.state.id ? API.putEvent(eventData) : API.postEvent(eventData)

    APICall()
      .catch(err => console.log(err))
      .finally(() => { if (this.props.afterUpdate) this.props.afterUpdate() })
  }

  render () {
    const name = this.state.name
    const description = this.state.description
    const start = this.state.start
    return (
      <Form>
        <Form.Group as={Row}>
          <Form.Label>Event Name</Form.Label>
          <Form.Control name='name' type='text' placeholder='Enter text'
            onChange={this.handleInputChange} value={name || ''} />
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label>Description</Form.Label>
          <Form.Control as='textarea' rows='4' name='description' placeholder='Enter description'
            onChange={this.handleInputChange} value={description || ''} />
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label>Start Date</Form.Label>
          <Form.Control name='start' type='date' placeholder='Enter date'
            onChange={this.handleInputChange} value={start ? moment(start).format('YYYY-MM-DD') : ''} />
        </Form.Group>
      </Form>
    )
  }
}
EventForm.propTypes = {
  project: PropTypes.object,
  afterUpdate: PropTypes.func
}

export default EventForm
