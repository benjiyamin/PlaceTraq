import React from 'react'

import { Col, Button, Form } from 'react-bootstrap'

import AppForm from './Form'
import API from '../../utils/API'

class SearchForm extends AppForm {
  state = {
    search: this.props.search || ''
  }

  componentDidMount () {
    this.loadProjects()
  }

  loadProjects = () => {
    API.getProjects(this.state.search)
      // .then(res => this.setState({ projects: res.data }))
      .then(res => this.props.setProjects(res.data))
      .catch(error => console.error(error))
  }

  handleFormSubmit = event => {
    if (event) event.preventDefault()
    this.loadProjects()
  }

  render () {
    return (
      <Form className='row no-gutters align-items-center'>
        <Col xs='auto'>
          <i className='fas fa-search h4 text-body mt-2' />
        </Col>
        <Col className='mx-3'>
          <Form.Control className='form-control-borderless mr-sm-2' type='search'
            placeholder='Search projects by location or keyword' name='search' onChange={this.handleInputChange}
            value={this.state.search} />
        </Col>
        <Col xs='auto'>
          <Button variant='outline-success' className='my-2 my-sm-0' disabled={!this.state.search} onClick={this.handleFormSubmit}>
            Search
          </Button>
        </Col>
      </Form>
    )
  }
}

export default SearchForm
