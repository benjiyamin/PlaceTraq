import React from 'react'

class AppForm extends React.Component {
  handleInputChange = event => {
    const { name, value } = event.target
    this.setState({
      [name]: value
    })
  }
}

export default AppForm
