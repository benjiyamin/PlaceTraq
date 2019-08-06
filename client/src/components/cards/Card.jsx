import React from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'

function GroupCard ({ title, subtitle, text, to }) {
  return (
    <Link className='text-decoration-none' to={to}>
      <Card className='text-dark mb-4'>
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Subtitle className='mb-2 text-muted'>
            {subtitle}
          </Card.Subtitle>
          <Card.Text>{text}</Card.Text>
        </Card.Body>
      </Card>
    </Link>
  )
}
GroupCard.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  text: PropTypes.string,
  to: PropTypes.string
}

export default GroupCard
