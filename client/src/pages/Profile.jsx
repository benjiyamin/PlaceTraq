import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import _ from 'lodash'

import API from '../utils/API'
import Timeline from '../components/Timeline'
import ProjectCard from '../components/cards/ProjectCard'
import GroupCard from '../components/cards/GroupCard'
import GroupEditor from '../components/editors/GroupEditor'

class ProfilePage extends Component {
  constructor (props) {
    super(props)
    this.groupEditor = React.createRef()
  }

  state = {
    redirectToLogin: false,
    projects: [],
    groups: [],
    events: []
  }

  componentDidMount () {
    this.loadGroups()
    this.loadProjects()
    this.loadEvents()
  }

  handleRedirect = () => this.setState({ redirectToLogin: true })

  loadGroups = () => {
    API.getGroups()
      .then(res => this.setState({ groups: res.data }))
      // .then(() => this.loadProjects())
      .catch(error => console.error(error))
  }

  loadProjects = () => {
    API.getRequestUser()
      // .then(res => res.data)
      .then(res => API.getProjects({ userId: res.data.id }))
      .then(res => this.setState({ projects: res.data }))
      // .then(() => this.loadEvents())
      .catch(error => console.error(error))
  }

  loadEvents = () => {
    API.getRequestUser()
      // .then(res => res.data)
      .then(res => API.getEvents({ userId: res.data.id }))
      .then(res => {
        const events = res.data
        _.sortBy(events, ['start']).reverse()
        this.setState({ events: events })
      })
      .catch(error => console.error(error))
  }

  handleAddGroup = () => this.groupEditor.current.modal.current.handleShow()

  render () {
    if (this.props.redirect) this.props.history.push(this.props.redirect)
    return (
      <Container>
        <Row>
          <Col md={8}>
            <div className='sticky-top bg-white py-3' style={{ top: '56px' }}>
              <h4 className='jumbotron p-2 m-0 text-center'>Timeline</h4>
            </div>
            {this.state.events ? <Timeline events={this.state.events} /> : null}
          </Col>
          <Col md={4}>
            <div>
              <div className='sticky-top bg-white py-3' style={{ top: '56px' }}>
                <h4 className='jumbotron p-2 m-0 text-center'>Projects</h4>
              </div>
              <Row className='justify-content-center align-items-center mb-4'>
                <Col className='pr-1'>
                  <Form.Control className='form-control-borderless mr-sm-2' type='search'
                    placeholder='Find more projects' />
                </Col>
                <Col xs='auto' className='pl-1'>
                  <Button variant='outline-success' className='my-2 my-sm-0'>
                    Search
                  </Button>
                </Col>
              </Row>
              {this.state.projects ? this.state.projects.map((project, i) => {
                return <ProjectCard key={i} project={project} />
              }) : null}
            </div>
            <div>
              <div className='sticky-top bg-white py-3' style={{ top: '56px' }}>
                <div className='jumbotron p-2 m-0 text-center'>
                  <h4 className='d-inline'>Groups</h4>
                  <div className='float-right'>
                    <Button variant='link' className='h4 py-0 m-0' onClick={this.handleAddGroup}>
                      <i className='fas fa-plus' />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            {this.state.groups ? this.state.groups.map((group, i) => {
              return <GroupCard key={i} group={group} />
            }) : null}
          </Col>
        </Row>

        <GroupEditor ref={this.groupEditor} />
      </Container>
    )
  }
}
ProfilePage.propTypes = {
  redirect: PropTypes.string,
  history: PropTypes.object
}

export default ProfilePage
