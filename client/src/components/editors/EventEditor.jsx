import React from 'react'
import PropTypes from 'prop-types'

import { Container, Row, Col, Tab, Nav } from 'react-bootstrap'
import ReactQuill from 'react-quill'

import Editor from './Editor'
import Modal from '../Modal'
import EventForm from '../forms/EventForm'
import 'react-quill/dist/quill.snow.css'

class EventEditor extends Editor {
  constructor (props) {
    super(props)
    this.quill = React.createRef()
  }

  state = {
    detail: this.props.event ? this.props.event.detail : null
  }

  handleAboutChange = value => {
    const quill = this.quill.current.getEditor()
    const detail = quill.getText().trim().length ? JSON.parse(JSON.stringify(quill.getContents())) : null
    this.setState({ detail: detail })
  }

  render () {
    const detail = this.state.detail
    return (
      <Modal ref={this.modal} title='Edit Event' formSubmit={this.handleSave}>
        <Container>
          <Row>
            <Tab.Container defaultActiveKey='event-info'>
              <Col xs={4}>
                <Nav variant='pills' className='flex-column mb-4'>
                  <Nav.Item>
                    <Nav.Link eventKey='event-info'>Info</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey='event-detail'>About</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col xs={8}>
                <Tab.Content>
                  <Tab.Pane eventKey='event-info'>
                    <Container>
                      <EventForm ref={this.form} event={this.props.event} afterUpdate={this.props.afterUpdate} />
                    </Container>
                  </Tab.Pane>
                  <Tab.Pane eventKey='event-detail'>
                    <ReactQuill ref={this.quill} value={detail} onChange={this.handleAboutChange} />
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
EventEditor.propTypes = {
  event: PropTypes.object,
  afterUpdate: PropTypes.func
}

export default EventEditor
