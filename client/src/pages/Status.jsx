import React from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'

import { statusMessage } from '../utils/status'

function StatusPage ({ code }) {
  function description () {
    switch (code) {
      case 500:
        return 'An internal server error has occured.'

      default: // Default is 404 page
        return 'The page you are looking for was not found.'
    }
  }

  return (
    <Container className='mt-4'>
      <Row>
        <Col className='text-center'>
          <h1 className='display-3'>Oops!</h1>
          <p className='display-4'>{code} {statusMessage(code)}</p>
          <p className='lead'>
            {description()}
          </p>
          <Link className='btn btn-primary btn-lg' to='/'>Take Me Home</Link>
        </Col>
      </Row>
    </Container>
  )
}
StatusPage.propTypes = {
  code: PropTypes.number
}

export default StatusPage
