import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import _ from 'lodash'

import API from '../utils/API'
import Timeline from '../components/Timeline'
import ProjectCard from '../components/cards/ProjectCard'
import GroupCard from '../components/cards/GroupCard'
import GroupEditor from '../components/editors/GroupEditor'
import Navbar from '../components/Navbar'

class ProfilePage extends Component {
  constructor (props) {
    super(props)
    this.groupEditor = React.createRef()
  }

  state = {
    user: null,
    projects: [],
    groups: [],
    events: []
  }

  componentDidMount () {
    API.getRequestUser()
      .then(res => {
        const user = res.data
        this.setState({ user: user })
        if (user) {
          this.loadGroups()
          this.loadProjects()
          this.loadEvents()
        } else {
          this.props.history.push('/login')
        }
      })
      .catch(error => console.error(error))
  }

  loadGroups = () => {
    API.getGroups()
      .then(res => this.setState({ groups: res.data }))
      .catch(error => console.error(error))
  }

  loadProjects = () => {
    API.getProjects({ userId: this.state.user.id })
      .then(res => this.setState({ projects: res.data }))
      .catch(error => console.error(error))
  }

  loadEvents = () => {
    API.getEvents({ userId: this.state.user.id })
      .then(res => {
        const events = res.data
        _.sortBy(events, ['start']).reverse()
        this.setState({ events: events })
      })
      .catch(error => console.error(error))
  }

  handleAddGroup = () => this.groupEditor.current.modal.current.handleShow()

  render () {
    return (
      <>
        <Navbar />
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
                    <Link className='btn btn-outline-success btn-sm' to='/projects'>Search</Link>
                  </Col>
                </Row>
                {this.state.projects ? this.state.projects.map((project, i) => {
                  return <ProjectCard key={i} project={project} isLink />
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
      </>
    )
  }
}
ProfilePage.propTypes = {
  history: PropTypes.object
}

export default ProfilePage
