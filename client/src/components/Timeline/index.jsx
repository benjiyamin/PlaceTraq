import React from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'

import './style.css'

function EventCard ({ event, edit }) {
  return (
    <li className='event-box'>
      <span className='h6'>{event.name} {event.project ? `(${event.project.name})` : null}</span>
      <span className='h6 float-right'>{moment(event.start).format('MMM D YYYY')}</span>
      <p className='card-text text-muted mb-1'>{event.description}</p>
      {event.details ? <a href='#' className='card-link event-view-btn' data-toggle='modal' data-target='#eventModal' data-event-id={event.id}>Details</a> : null}
      {edit ? <a href='#' className='card-link event-edit-btn' data-toggle='modal' data-target='#eventEditModal' data-event-id={event.id}>Edit</a> : null}
    </li>
  )
}
EventCard.propTypes = {
  event: PropTypes.object.isRequired,
  edit: PropTypes.bool
}

function Timeline ({ events, start, end }) {
  const pastEvents = events.filter(evt => (moment().diff(evt.start) > 0))
  const futureEvents = events.filter(evt => (moment().diff(evt.start) < 0))
  return (
    <ul className='timeline'>
      {end ? <li><h4 className='jumbotron p-2 text-center'>Project End - {moment(end).format('MMMM DD, YYYY')}</h4></li> : null}
      {futureEvents.map((evt, i) => {
        return <EventCard key={i} event={evt} />
      })}
      <li><h4 className='jumbotron p-2 text-center'>Today - {moment().format('MMMM DD, YYYY')}</h4></li>
      {pastEvents.map((evt, i) => {
        return <EventCard key={i} event={evt} />
      })}
      {start ? <li><h4 className='jumbotron p-2 text-center'>Project Start - {moment(start).format('MMMM DD, YYYY')}</h4></li> : null}
    </ul>
  )
}
Timeline.propTypes = {
  events: PropTypes.array,
  start: PropTypes.string,
  end: PropTypes.string
}

export default Timeline
