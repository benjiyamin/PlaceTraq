import React from 'react'
import PropTypes from 'prop-types'

import { Row, Form } from 'react-bootstrap'
import moment from 'moment'

import AppForm from './Form'
import API from '../../utils/API'

class ProjectForm extends AppForm {
  state = {
    id: this.props.project ? this.props.project.id : null,
    name: this.props.project ? this.props.project.name : null,
    description: this.props.project ? this.props.project.description : null,
    location: this.props.project ? this.props.project.location : null,
    start: this.props.project ? this.props.project.start : null,
    end: this.props.project ? this.props.project.end : null
  }

  handleFormSubmit = event => {
    if (event) event.preventDefault()
    const projectData = {
      name: this.state.name,
      description: this.state.description,
      location: this.state.location,
      start: this.state.start,
      end: this.state.end,
      about: this.state.about
    }
    if (this.state.id) projectData.id = this.state.id

    const APICall = () => this.state.id ? API.putProject(projectData) : API.postProject(projectData)

    APICall()
      .catch(err => console.log(err))
      .finally(() => { if (this.props.afterUpdate) this.props.afterUpdate() })
  }

  render () {
    const name = this.state.name
    const description = this.state.description
    const location = this.state.location
    const start = this.state.start
    const end = this.state.end
    return (
      <Form>
        <Form.Group as={Row}>
          <Form.Label>Project Name</Form.Label>
          <Form.Control name='name' type='text' placeholder='Enter text'
            onChange={this.handleInputChange} value={name || ''} />
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label>Description</Form.Label>
          <Form.Control as='textarea' rows='4' name='description' placeholder='Enter description'
            onChange={this.handleInputChange} value={description || ''} />
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label>Location</Form.Label>
          <Form.Control name='location' type='text' placeholder='Enter text'
            onChange={this.handleInputChange} value={location || ''} />
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label>Start Date</Form.Label>
          <Form.Control name='start' type='date' placeholder='Enter date'
            onChange={this.handleInputChange} value={start ? moment(start).format('YYYY-MM-DD') : ''} />
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label>End Date</Form.Label>
          <Form.Control name='end' type='date' placeholder='Enter date'
            onChange={this.handleInputChange} value={end ? moment(end).format('YYYY-MM-DD') : ''} />
        </Form.Group>
      </Form>
    )
  }
}
ProjectForm.propTypes = {
  project: PropTypes.object,
  afterUpdate: PropTypes.func
}

export default ProjectForm
