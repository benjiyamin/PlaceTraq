import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'
import { Row, Button } from 'react-bootstrap'

import './style.css'
import API from '../../utils/API'
import { userIsMemberOfGroup } from '../../utils/auth'
import ProjectMap from '../../components/ProjectMap'

class MapPage extends Component {
  constructor (props) {
    super(props)
    this.map = React.createRef()
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

  handleSaveMap = () => {
    console.log('saving')
    this.map.current.updateFeatures()
  }

  render () {
    const user = this.props.user
    const project = this.state.project
    const group = project ? project.Group : null
    const id = project ? project.id : null
    const name = project ? project.name : null
    return (
      <div>
        <Row className='jumbotron p-2 m-0'>
          <Link className='btn btn-secondary' to={`/projects/${id}`}>
            <i className='fas fa-chevron-left' /> {name} Page
          </Link>
          {user && group && userIsMemberOfGroup(user, group) ? (
            <Button variant='primary' className='ml-2' onClick={this.handleSaveMap}>
              <i className='fas fa-save' /> Save Map
            </Button>
          ) : null}
        </Row>
        {project ? <ProjectMap ref={this.map} project={project} style={{ height: 'calc(100vh - 110px)' }} edit='true' /> : null}
      </div>
    )
  }
}
MapPage.propTypes = {
  user: PropTypes.object,
  match: PropTypes.object
}

export default MapPage
