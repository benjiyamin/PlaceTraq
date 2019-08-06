import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Container, Row, Col, Card } from 'react-bootstrap'
import queryString from 'query-string'

import SearchForm from '../components/forms/SearchForm'

import ProjectCard from '../components/cards/ProjectCard'

function SearchResults ({ projects }) {
  return (
    <Row>
      {
        projects.map((project, i) => {
          return (
            <Col key={i} xs={12} sm={6} lg={4}>
              <ProjectCard project={project} />
            </Col>
          )
        })
      }
    </Row>
  )
}
SearchResults.propTypes = {
  projects: PropTypes.array
}

class SearchPage extends Component {
  constructor (props) {
    super(props)
    this.form = React.createRef()
  }

  state = {
    projects: []
  }

  setProjects = projects => this.setState({ projects: projects })

  render () {
    const search = this.props.location.search
    return (
      <Container>
        <Row className='justify-content-center my-4'>
          <Col>
            <Card>
              <Card.Body>
                <SearchForm ref={this.form} setProjects={this.setProjects}
                  search={search ? queryString.parse(search).search : null} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <SearchResults projects={this.state.projects} />
      </Container>
    )
  }
}
SearchPage.propTypes = {
  location: PropTypes.object
}

export default SearchPage
