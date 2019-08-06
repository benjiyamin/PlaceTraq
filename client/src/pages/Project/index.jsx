import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'
import { Container, Row, Col, Tab, Button, Nav } from 'react-bootstrap'
import moment from 'moment'
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'

import './style.css'
import API from '../../utils/API'
import { userIsMemberOfGroup, userFollowsProject } from '../../utils/auth'
import Timeline from '../../components/Timeline'
import ProjectMap from '../../components/ProjectMap'
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

function FollowBtn ({ user, project }) {
  if (user && project) {
    return (
      userFollowsProject(user, project) ? (
        <Button variant='primary' size='lg' active block data-followed>
          <i className='fas fa-user-minus' /> Unfollow this Project
        </Button>
      ) : (
        <Button varient='primary' size='lg' block>
          <i className='fas fa-user-plus' /> Follow this Project
        </Button>
      )
    )
  } else {
    return (
      <Link className='btn btn-primary btn-lg btn-block' to='/login'><i className='fas fa-user-plus' /> Login to Follow</Link>
    )
  }
}

function InfoBlock ({ user, project }) {
  return (
    <div className='sticky-top pt-3' style={{ top: '56px' }}>
      <div>
        <h1 className='display-4'>{project ? project.name : null}</h1>
      </div>
      <div>
        <p className='lead'>
          {project ? project.description : null}
        </p>
      </div>
      <div>
        <p className='text-muted'><i className='fa fa-map-marker-alt' /> {project ? project.location : null}</p>
        <p className='text-muted'><i className='fas fa-calendar-alt' />
          {' '}
          {project ? moment(project.start).format('MMMM YYYY') : null} - {project ? moment(project.end).format('MMMM YYYY') : null}
        </p>
      </div>
      <p className='text-muted'><i className='fas fa-users' /> {project ? project.Users.length : null}
        Follower{project && project.Users.length !== 1 ? 's' : null}</p>
      <FollowBtn user={user} project={project} />
    </div>
  )
}
InfoBlock.propTypes = {
  user: PropTypes.object,
  project: PropTypes.object
}

class ProjectPage extends Component {
  constructor (props) {
    super(props)
    this.projectEditor = React.createRef()
    this.eventEditor = React.createRef()
  }

  state = {
    project: null
  }

  componentDidMount () {
    this.loadProject(this.props.match.params.id)
  }

  loadProject = (id) => {
    API.getProject(id)
      .then(res => this.setState({ project: res.data }))
      .catch(error => console.error(error))
  }

  afterProjectUpdate = () => this.loadProject(this.state.project.id)

  handleEditProject = () => this.projectEditor.current.modal.current.handleShow()

  handleEditEvent = () => this.eventEditor.current.modal.current.handleShow()

  render () {
    const user = this.props.user
    const project = this.state.project
    const group = project ? project.Group : null
    return (
      <div>
        <TopBar user={user} group={group}
          handleShowProject={this.handleEditProject} handleShowEvent={this.handleEditEvent} />
        {project ? <ProjectMap project={project} style={{ height: '33vh' }} /> : null}
        <Container>
          <Row>
            <Col md={4}>
              {project ? <InfoBlock user={user} project={project} /> : null}
            </Col>
            <Col md={8}>
              <Tab.Container defaultActiveKey='timeline'>
                <Nav variant='pills' className='nav-fill py-3 sticky-top bg-white' style={{ top: '56px' }}>
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
                    dangerouslySetInnerHTML={project ? { __html: new QuillDeltaToHtmlConverter(project.about.ops).convert() } : null}>
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
  user: PropTypes.object,
  match: PropTypes.object
}

export default ProjectPage
