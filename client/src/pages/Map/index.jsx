import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'
import { Row, Button } from 'react-bootstrap'

import './style.css'
import API from '../../utils/API'
import { userIsMemberOfGroup } from '../../utils/auth'
import ProjectMap from '../../components/ProjectMap'

function SaveButton () {
  return (
    <Button variant='primary' className='ml-2'>
      <i className='fas fa-save' /> Save Map
    </Button>
  )
}

function TopBar ({ user, group, id, name }) {
  return (
    <Row className='jumbotron p-2 m-0'>
      <Link className='btn btn-secondary' to={`/projects/${id}`}>
        <i className='fas fa-chevron-left' /> {name} Page
      </Link>
      {user && group && userIsMemberOfGroup(user, group) ? <SaveButton /> : null}
    </Row>
  )
}
TopBar.propTypes = {
  user: PropTypes.object.isRequired,
  group: PropTypes.object.isRequired,
  id: PropTypes.number,
  name: PropTypes.string
}

class MapPage extends Component {
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

  render () {
    const user = this.props.user
    const project = this.state.project
    const group = project ? project.Group : null
    const id = project ? project.id : null
    const name = project ? project.name : null
    return (
      <div>
        <TopBar user={user} group={group} id={id} name={name} />
        {project ? <ProjectMap project={project} style={{ height: 'calc(100vh - 110px)' }} edit='true' /> : null}
      </div>
    )
  }
}
MapPage.propTypes = {
  user: PropTypes.object,
  match: PropTypes.object
}

export default MapPage
