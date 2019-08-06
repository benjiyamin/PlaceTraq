import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import _ from 'lodash'

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
    redirectToLogin: false
  }

  handleRedirect = () => this.setState({ redirectToLogin: true })

  getEvents = () => {
    const events = []
    this.props.user.Projects.forEach(project => {
      project.Events.forEach(event => {
        events.push(event)
      })
    })
    return _.sortBy(events, ['start']).reverse()
  }

  handleAddGroup = () => this.groupEditor.current.modal.current.handleShow()

  render () {
    if (this.props.redirect) this.props.history.push(this.props.redirect)
    const user = this.props.user
    return (
      <Container>
        <Row>
          <Col md={8}>
            <div className='sticky-top bg-white py-3' style={{ top: '56px' }}>
              <h4 className='jumbotron p-2 m-0 text-center'>Timeline</h4>
            </div>
            {user ? <Timeline events={this.getEvents()} /> : null}
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
              {user ? user.Projects.map((project, i) => {
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
            {user ? user.Members.map((member, i) => {
              return <GroupCard key={i} group={member.Group} />
            }) : null}
          </Col>
        </Row>

        <GroupEditor ref={this.groupEditor} />
      </Container>
    )
  }
}
ProfilePage.propTypes = {
  user: PropTypes.object,
  redirect: PropTypes.string,
  history: PropTypes.object
}

export default ProfilePage
