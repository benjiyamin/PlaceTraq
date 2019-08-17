import React from 'react'
import PropTypes from 'prop-types'

import { Container } from 'react-bootstrap'

import Editor from './Editor'
import Modal from '../Modal'
import GroupForm from '../forms/GroupForm'

class GroupEditor extends Editor {
  render () {
    const group = this.props.group
    return (
      <Modal ref={this.modal} title='Edit Group' formSubmit={this.handleSave}>
        <Container>
          <GroupForm ref={this.form} group={group} afterUpdate={this.props.afterUpdate} />
        </Container>
      </Modal>
    )
  }
}
GroupEditor.propTypes = {
  group: PropTypes.object,
  afterUpdate: PropTypes.func
}

export default GroupEditor
