import React from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'

import Skeleton from 'react-loading-skeleton'

function AppCard ({ title, subtitle, text, to }) {
  return (
    <Link className='text-decoration-none' to={to}>
      <Card className='text-dark mb-4'>
        <Card.Body>
          <Card.Title>{title || <Skeleton />}</Card.Title>
          <Card.Subtitle className='mb-2 text-muted'>
            {subtitle || <Skeleton />}
          </Card.Subtitle>
          <Card.Text>{text || <Skeleton count={3} />}</Card.Text>
        </Card.Body>
      </Card>
    </Link>
  )
}
AppCard.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  text: PropTypes.string,
  to: PropTypes.string
}

export default AppCard
