import React from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'
import { Row, Col } from 'react-bootstrap'

import './style.css'

function EventRow ({ children, date }) {
  return (
    <li>
      <Row noGutters>
        <Col xs={4} sm={3} xl={2}>
          {date ? <span className='h4 float-right date'>{date}</span> : null}
        </Col>
        <Col xs={8} sm={9} xl={10}>
          {children}
        </Col>
      </Row>
    </li>
  )
}
EventRow.propTypes = {
  children: PropTypes.object,
  date: PropTypes.string
}

function EventBlock ({ event, edit, past }) {
  let eventCardClass = 'box event-box'
  eventCardClass += past ? ' bg-purple' : ' dashed'

  return (
    <div className={eventCardClass}>
      <span className='h4'>{event.name} {event.project ? `(${event.project.name})` : null}</span>
      <p className='card-text text-muted mb-1'>{event.description}</p>
      {event.details ? <a href='#' className='card-link event-view-btn' data-toggle='modal' data-target='#eventModal' data-event-id={event.id}>Details</a> : null}
      {edit ? <a href='#' className='card-link event-edit-btn' data-toggle='modal' data-target='#eventEditModal' data-event-id={event.id}>Edit</a> : null}
    </div>
  )
}
EventBlock.propTypes = {
  event: PropTypes.object.isRequired,
  edit: PropTypes.bool,
  past: PropTypes.bool
}

function DateBlock () {
  return (
    <div className='box date-wrapper dashed'>
      <div className='date-box'>
        <h3>Today</h3>
        <p className='text-muted'>{moment().format('MMMM DD, YYYY')}</p>
      </div>
    </div>
  )
}

function Timeline ({ events, start, end }) {
  const pastEvents = events.filter(evt => (moment().diff(evt.start) > 0))
  const futureEvents = events.filter(evt => (moment().diff(evt.start) < 0))
  return (
    <>
      {end ? <>
        <h2>Project End</h2>
        <p className='text-muted'>{moment(end).format('MMMM DD, YYYY')}</p>
      </> : null}
      <ul className='timeline'>
        {futureEvents.map((evt, i) => {
          return (
            <EventRow key={i} date={moment(evt.start).format('MMM D YYYY')}>
              <EventBlock event={evt} />
            </EventRow>
          )
        })}
        <EventRow>
          <DateBlock />
        </EventRow>
        {pastEvents.map((evt, i) => {
          return (
            <EventRow key={i} date={moment(evt.start).format('MMM D YYYY')}>
              <EventBlock event={evt} past />
            </EventRow>
          )
        })}
      </ul>
      {start ? <>
        <h2>Project Start</h2>
        <p className='text-muted'>{moment(start).format('MMMM DD, YYYY')}</p>
      </> : null}
    </>
  )
}
Timeline.propTypes = {
  events: PropTypes.array,
  start: PropTypes.string,
  end: PropTypes.string
}

export default Timeline
