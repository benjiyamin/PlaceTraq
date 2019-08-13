import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Button, Modal } from 'react-bootstrap'

class AppModal extends Component {
  state = {
    show: false
  }

  handleShow = () => this.setState({ show: true })

  handleHide = () => this.setState({ show: false })

  render () {
    return (
      <Modal size='lg' show={this.state.show} onHide={this.handleHide}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.props.children}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={this.handleHide}>
            Close
          </Button>
          <Button variant='primary' onClick={this.props.formSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
AppModal.propTypes = {
  children: PropTypes.object,
  title: PropTypes.string,
  formSubmit: PropTypes.func
}

export default AppModal
