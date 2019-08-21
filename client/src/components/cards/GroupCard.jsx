import React from 'react'
import PropTypes from 'prop-types'

import { ellipsis } from '../../utils/string'
import Card from './Card'

function GroupCard ({ group }) {
  return (
    <Card
      title={group.name}
      subtitle={`${group.Members.length.toString()} Member${group.Members.length !== 1 ? 's' : ''}`}
      text={ellipsis(group.description, 140)}
      to={`/groups/${group.id}`}
    />
  )
}
GroupCard.propTypes = {
  group: PropTypes.object.isRequired
}

export default GroupCard
