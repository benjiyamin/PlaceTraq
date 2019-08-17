import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
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
          <Button className='float-right m-3' variant='secondary' size='md' onClick={this.handleUnfollowProject} active data-followed>
            Unfollow Project
          </Button>
        ) : (
          <Button className='float-right  m-3' varient='secondary' size='md' onClick={this.handleFollowProject}>
            Follow Project
          </Button>
        )
      )
    } else {
      return (
        <Link className='btn btn-secondary float-right m-3' to='/login'><i className='fas fa-user-plus' /> Login to Follow</Link>
      )
    }
  }
}
FollowBtn.propTypes = {
  user: PropTypes.object,
  project: PropTypes.object,
  afterProjectUpdate: PropTypes.func
}

function InfoBlock ({ project, fullSize }) {
  const NameTag = fullSize ? 'h2' : 'h3'
  const descClass = fullSize ? 'project-card-desc' : 'text-muted'
  const description = fullSize ? project.description : ellipsis(project.description, 60)
  return (
    <div className='px-4'>
      <NameTag>{project.name || <Skeleton />}</NameTag>
      {fullSize && project.Users ? (
        <p className='font-weight-bold'>
          {project.Users.length || <Skeleton />}
          <span className='text-muted'>Follower{project && project.Users.length !== 1 ? 's' : null}</span>
        </p>
      ) : null}
      <p className={descClass}>
        {description || <Skeleton count={3} />}
      </p>
      <div className='d-flex justify-content-between'>
        <p className='text-muted'><i className='fa fa-map-marker-alt bg-gradient' /> {project ? project.location : null}</p>
        {fullSize ? (
          <p className='text-muted'><i className='fas fa-calendar-alt bg-gradient' />
            {' '}
            {project ? moment(project.start).format('MMM YYYY') : null} - {project ? moment(project.end).format('MMM YYYY') : null}
          </p>
        ) : null}
      </div>
    </div>
  )
}
InfoBlock.propTypes = {
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
      <div className='project-card-info-block'>
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
        <InfoBlock user={user} project={project} fullSize={this.props.fullSize} />
      </div>
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
