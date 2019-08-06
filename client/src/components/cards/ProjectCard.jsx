import React from 'react'
import PropTypes from 'prop-types'

import { ellipsis } from '../../utils/string'
import Card from './Card'

function ProjectCard ({ project }) {
  return (
    <Card
      title={project.name}
      subtitle={project.location}
      text={ellipsis(project.description, 140)}
      to={`/projects/${project.id}`}
    />
  )
}
ProjectCard.propTypes = {
  project: PropTypes.object.isRequired
}

export default ProjectCard
