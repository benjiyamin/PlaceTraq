import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Container, Row, Col, Card } from 'react-bootstrap'
import queryString from 'query-string'

import SearchForm from '../../components/forms/SearchForm'
import ProjectCard from '../../components/cards/ProjectCard'
import Navbar from '../../components/Navbar'
import './style.css'

function SearchResults ({ projects }) {
  return (
    <Row>
      {
        projects.map((project, i) => {
          return (
            <Col key={i} xs={12} sm={6} lg={3}>
              <ProjectCard project={project} isLink />
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
      <>
        <Navbar />
        <header className='bg-secondary search-hero-image hero-image py-5'>
          <Container className='h-100'>
            <Row className='h-100 align-items-center text-center'>
              <Col>
                <img src='/images/location.svg' alt='' />
                <h1 className='display-4 text-white my-2'>Find projects in your area</h1>
                <p className='lead mb-5 text-white-50'>Which places need tracking?</p>
              </Col>
            </Row>
          </Container>
        </header>
        <Container>
          <Row className='d-flex justify-content-center mb-4 transform-y-50'>
            <Card className='search-card'>
              <Card.Body>
                <SearchForm ref={this.form} setProjects={this.setProjects}
                  search={search ? queryString.parse(search).search : null} />
              </Card.Body>
            </Card>
          </Row>
          <SearchResults projects={this.state.projects} />
        </Container>
      </>
    )
  }
}
SearchPage.propTypes = {
  location: PropTypes.object
}

export default SearchPage
