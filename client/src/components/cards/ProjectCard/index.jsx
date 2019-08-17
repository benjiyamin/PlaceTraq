import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'
import { Button, Card } from 'react-bootstrap'
import Skeleton from 'react-loading-skeleton'
import moment from 'moment'

import './style.css'
import API from '../../../utils/API'
import { ellipsis } from '../../../utils/string'
import { userFollowsProject } from '../../../utils/auth'
import ProjectMap from '../../ProjectMap'

class FollowBtn extends Component {
  followProject = id => {
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
          <Button className='float-right mt-3 mr-3' variant='secondary' size='md' onClick={this.handleUnfollowProject} active data-followed>
            Unfollow Project
          </Button>
        ) : (
          <Button className='float-right mt-3 mr-3' varient='secondary' size='md' onClick={this.handleFollowProject}>
            Follow Project
          </Button>
        )
      )
    } else {
      return (
        <Link className='btn btn-secondary float-right mt-3 mr-3' to='/login'><i className='fas fa-user-plus' /> Login to Follow</Link>
      )
    }
  }
}
FollowBtn.propTypes = {
  user: PropTypes.object,
  project: PropTypes.object,
  afterProjectUpdate: PropTypes.func
}

function CardBody ({ project, fullSize }) {
  const NameTag = fullSize ? 'h2' : 'h3'
  const descClass = fullSize ? 'project-card-desc' : 'text-muted'
  const description = fullSize ? project.description : ellipsis(project.description, 60)
  return (
    <Card.Body className='p-3'>
      <Card.Title><NameTag>{project.name || <Skeleton />}</NameTag></Card.Title>
      {fullSize && project.Users ? (
        <Card.Subtitle className='font-weight-bold mb-2'>
          {project.Users.length || <Skeleton />} <span className='text-muted'>Follower{project && project.Users.length !== 1 ? 's' : null}</span>
        </Card.Subtitle>
      ) : null}
      <Card.Text className={descClass}>
        {description || <Skeleton count={3} />}
      </Card.Text>
      <div className='d-flex justify-content-between'>
        <p className='text-muted m-0'><i className='fa fa-map-marker-alt bg-gradient' /> {project ? project.location : null}</p>
        {fullSize ? (
          <p className='text-muted m-0'><i className='fas fa-calendar-alt bg-gradient' />
            {' '}
            {project ? moment(project.start).format('MMM YYYY') : null} - {project ? moment(project.end).format('MMM YYYY') : null}
          </p>
        ) : null}
      </div>
    </Card.Body>
  )
}
CardBody.propTypes = {
  project: PropTypes.object,
  fullSize: PropTypes.bool
}

class ProjectCard extends Component {
  state = {
    user: null
  }

  componentDidMount () {
    this.loadUser()
  }

  loadUser = () => {
    API.getRequestUser()
      .then(res => this.setState({ user: res.data }))
      .catch(error => console.error(error))
  }

  render () {
    const project = this.props.project
    const user = this.state.user
    const component = (
      <Card className='mb-4'>
        <div>
          <ProjectMap project={project}
            style={{ height: this.props.fullSize ? '170px' : '73px' }} />
        </div>
        {
          this.props.fullSize ? (
            <div className='clearfix'>
              <FollowBtn user={user} project={project} afterProjectUpdate={this.props.afterProjectUpdate} />
            </div>
          ) : null
        }
        <CardBody user={user} project={project} fullSize={this.props.fullSize} />
      </Card>
    )
    if (this.props.isLink) {
      return (
        <Link className='text-decoration-none text-dark' to={`/projects/${project.id}`}>
          {component}
        </Link>
      )
    }
    return component
  }
}
ProjectCard.propTypes = {
  project: PropTypes.object.isRequired,
  afterProjectUpdate: PropTypes.func,
  fullSize: PropTypes.bool,
  isLink: PropTypes.bool
}

export default ProjectCard
