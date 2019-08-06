import React from 'react'
import PropTypes from 'prop-types'

import { Container, Row, Col, Tab, Nav } from 'react-bootstrap'
import ReactQuill from 'react-quill'

import Editor from './Editor'
import Modal from '../Modal'
import ProjectForm from '../forms/ProjectForm'
import 'react-quill/dist/quill.snow.css'

class ProjectEditor extends Editor {
  constructor (props) {
    super(props)
    this.quill = React.createRef()
  }

  state = {
    about: this.props.project ? this.props.project.about : null
  }

  render () {
    const about = this.state.about
    return (
      <Modal ref={this.modal} title='Edit Project' formSubmit={this.handleSave}>
        <Container>
          <Row>
            <Tab.Container defaultActiveKey='project-info'>
              <Col xs={4}>
                <Nav variant='pills' className='flex-column mb-4'>
                  <Nav.Item>
                    <Nav.Link eventKey='project-info'>Info</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey='project-about'>About</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col xs={8}>
                <Tab.Content>
                  <Tab.Pane eventKey='project-info'>
                    <Container>
                      <ProjectForm ref={this.form} project={this.props.project} afterUpdate={this.props.afterUpdate} />
                    </Container>
                  </Tab.Pane>
                  <Tab.Pane eventKey='project-about'>
                    <ReactQuill ref={this.quill} value={about} onChange={this.handleAboutChange} />
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Tab.Container>
          </Row>
        </Container>
      </Modal>
    )
  }
}
ProjectEditor.propTypes = {
  project: PropTypes.object,
  afterUpdate: PropTypes.func
}

export default ProjectEditor
