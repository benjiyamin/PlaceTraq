import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'
import { Container, Row, Col, Tab, Button, Nav } from 'react-bootstrap'
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'

import './style.css'
import API from '../../utils/API'
import { userIsMemberOfGroup, userFollowsProject } from '../../utils/auth'
import Timeline from '../../components/Timeline'
import ProjectCard from '../../components/cards/ProjectCard'
import ProjectEditor from '../../components/editors/ProjectEditor'

function TopBar ({ user, group, handleShowProject, handleShowEvent }) {
  if (user && group && userIsMemberOfGroup(user, group)) {
    return (
      <div className='row jumbotron p-2 m-0'>
        <Button variant='primary' className='ml-2' onClick={handleShowProject}>
          <i className='fas fa-edit' /> Edit Page
        </Button>
        <Button variant='primary' className='ml-2' onClick={handleShowEvent} >
          <i className='fas fa-plus' /> Add Event
        </Button>
      </div>
    )
  }
  return (null)
}
TopBar.propTypes = {
  user: PropTypes.object,
  group: PropTypes.object,
  handleShowProject: PropTypes.func,
  handleShowEvent: PropTypes.func
}

class ProjectPage extends Component {
  constructor (props) {
    super(props)
    this.projectEditor = React.createRef()
    this.eventEditor = React.createRef()
  }

  state = {
    user: null,
    project: null,
    followed: null
  }

  componentDidMount () {
    this.loadProject(this.props.match.params.id)
    this.loadUser()
  }

  loadUser = () => {
    API.getRequestUser()
      .then(res => this.setState({ user: res.data }))
      .catch(error => console.error(error))
  }

  loadProject = id => {
    API.getProject(id)
      .then(res => this.setState({
        project: res.data,
        followed: userFollowsProject(this.state.user, res.data)
      }))
      .catch(error => console.error(error))
  }

  afterProjectUpdate = () => this.loadProject(this.state.project.id)

  handleEditProject = () => this.projectEditor.current.modal.current.handleShow()

  handleEditEvent = () => this.eventEditor.current.modal.current.handleShow()

  render () {
    const user = this.state.user
    const project = this.state.project
    const group = project ? project.Group : null
    return (
      <div>
        <TopBar user={user} group={group}
          handleShowProject={this.handleEditProject} handleShowEvent={this.handleEditEvent} />
        <Container className='project-container'>
          <Row>
            <Col md={4}>
              <div className='sticky-top mt-4' style={{ top: '56px' }}>
                {project ? <ProjectCard project={project} afterProjectUpdate={this.afterProjectUpdate} fullSize /> : null}
              </div>
            </Col>
            <Col md={8}>
              <Tab.Container defaultActiveKey='timeline'>
                <Nav variant='tabs' className='sticky-top bg-white mt-5' style={{ top: '56px' }}>
                  <Nav.Item>
                    <Nav.Link eventKey='timeline'>Timeline</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey='about'>About</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Link className='nav-link' to={project ? `/projects/${project.id}/map` : '#'}>Map</Link>
                  </Nav.Item>
                </Nav>
                <Tab.Content>
                  <Tab.Pane eventKey='timeline'>
                    {project ? <Timeline events={project.Events} start={project.start} end={project.end} /> : null}
                  </Tab.Pane>
                  <Tab.Pane eventKey='about' className='about-tab'
                    dangerouslySetInnerHTML={project && project.about ? { __html: new QuillDeltaToHtmlConverter(project.about.ops).convert() } : null}>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Col>
          </Row>

        </Container>
        {project ? <ProjectEditor project={project} ref={this.projectEditor} afterUpdate={this.afterProjectUpdate} /> : null}
      </div>
    )
  }
}
ProjectPage.propTypes = {
  match: PropTypes.object
}

export default ProjectPage
