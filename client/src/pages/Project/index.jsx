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

class FollowBtn extends Component {
  // state = {
  //   userFollowsProject: null
  // }

  followProject = id => {
    // const APICall = () => userFollowsProject(this.props.user, this.state.project)
    //   ? API.unfollowProject(id) : API.followProject(id)

    API.followProject(id)
      .then(res => this.props.afterProjectUpdate())
      .catch(error => console.error(error))
  }

  unfollowProject = id => {
    API.unfollowProject(id)
      .then(res => this.props.afterProjectUpdate())
      .catch(error => console.error(error))
  }

  handleFollowProject = evt => { this.followProject(this.props.project.id) }

  handleUnfollowProject = evt => {
    this.unfollowProject(this.props.project.id)
  }

  render () {
    const user = this.props.user
    const project = this.props.project
    if (user && project) {
      return (
        userFollowsProject(user, project) ? (
          <Button variant='primary' size='lg' onClick={this.handleUnfollowProject} active block data-followed>
            <i className='fas fa-user-minus' /> Unfollow this Project
          </Button>
        ) : (
          <Button varient='primary' size='lg' onClick={this.handleFollowProject} block>
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
}
FollowBtn.propTypes = {
  user: PropTypes.object,
  project: PropTypes.object,
  afterProjectUpdate: PropTypes.func
}

function InfoBlock ({ user, project, afterProjectUpdate }) {
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
      <FollowBtn user={user} project={project} afterProjectUpdate={afterProjectUpdate} />
    </div>
  )
}
InfoBlock.propTypes = {
  user: PropTypes.object,
  project: PropTypes.object,
  afterProjectUpdate: PropTypes.func
}

class ProjectPage extends Component {
  constructor (props) {
    super(props)
    this.projectEditor = React.createRef()
    this.eventEditor = React.createRef()
  }

  state = {
    project: null,
    followed: null
  }

  componentDidMount () {
    this.loadProject(this.props.match.params.id)
  }

  loadProject = id => {
    API.getProject(id)
      .then(res => this.setState({
        project: res.data,
        followed: userFollowsProject(this.props.user, res.data)
      }))
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
              {project ? <InfoBlock user={user} project={project} afterProjectUpdate={this.afterProjectUpdate} /> : null}
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
