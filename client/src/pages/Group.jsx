import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Container, Row, Col, Button, Table } from 'react-bootstrap'

import API from '../utils/API'
import { userIsOwnerOfGroup } from '../utils/auth'
import ProjectCard from '../components/cards/ProjectCard'
import GroupEditor from '../components/editors/GroupEditor'
import ProjectEditor from '../components/editors/ProjectEditor'

function MemberRow ({ member }) {
  return (
    <tr>
      <td>{member.User.fullName}</td>
      <td>{member.User.email}</td>
      <td>{member.isOwner ? 'Owner' : 'Member'}</td>
    </tr>
  )
}
MemberRow.propTypes = {
  member: PropTypes.object
}

class GroupPage extends Component {
  constructor (props) {
    super(props)
    this.groupEditor = React.createRef()
    this.projectEditor = React.createRef()
  }

  state = {
    group: null
  }

  handleAddProject = () => this.projectEditor.current.modal.current.handleShow()

  handleEditGroup = () => this.groupEditor.current.modal.current.handleShow()

  componentDidMount () {
    this.loadGroup(this.props.match.params.id)
  }

  loadGroup = (id) => {
    API.getGroup(id)
      .then(res => this.setState({ group: res.data }))
      .catch(error => console.error(error))
  }

  afterGroupUpdate = () => this.loadGroup(this.state.group.id)

  render () {
    const user = this.props.user
    const group = this.state.group
    return (
      <Container className='mt-4'>
        <Row>
          <Col className='text-center'>
            <h1 className='d-inline display-4'>{group ? group.name : null}</h1>
            {user && group && userIsOwnerOfGroup(user, group) ? (
              <div className='float-right'>
                <Button variant='link' className='h4 py-0 m-0' onClick={this.handleEditGroup}>
                  <i className='fas fa-edit h3' />
                </Button>
              </div>
            ) : null}
          </Col>
        </Row>
        <Row>
          <Col md={8}>
            <div className='sticky-top bg-white py-4' style={{ top: '56px' }}>
              <h4 className='jumbotron p-2 m-0 text-center'>Members</h4>
            </div>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {group ? group.Members.map((member, i) => {
                  return <MemberRow key={i} member={member} />
                }) : null}
              </tbody>
            </Table>
          </Col>
          <Col md={4}>
            <div className='sticky-top bg-white py-4' style={{ top: '56px' }}>
              <div className='jumbotron p-2 m-0 text-center'>
                <h4 className='d-inline'>Projects</h4>
                <div className='float-right'>
                  <Button variant='link' className='h4 py-0 m-0' onClick={this.handleAddProject}>
                    <i className='fas fa-plus' />
                  </Button>
                </div>
              </div>
            </div>
            {group ? group.Projects.map((project, i) => {
              return <ProjectCard key={i} project={project} />
            }) : null}
          </Col>

        </Row>
        {group ? <GroupEditor group={group} ref={this.groupEditor} afterUpdate={this.afterGroupUpdate} /> : null}
        <ProjectEditor ref={this.projectEditor} group={group} />
      </Container>
    )
  }
}
GroupPage.propTypes = {
  user: PropTypes.object,
  match: PropTypes.object
}

export default GroupPage
