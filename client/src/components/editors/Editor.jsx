import React, { Component } from 'react'

class Editor extends Component {
  constructor (props) {
    super(props)
    this.modal = React.createRef()
    this.form = React.createRef()
  }

  handleSave = () => {
    this.form.current.handleFormSubmit()
    this.modal.current.handleHide()
  }
}

export default Editor
