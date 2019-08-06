import React from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'

function Header ({ signUp }) {
  return (
    <header className='bg-secondary py-5 mb-5'>
      <Container className='h-100'>
        <Row className='h-100 align-items-center'>
          <Col>
            <h1 className='display-4 text-white mt-5'>Follow local projects</h1>
            <p className='lead mb-5 text-white-50'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Non possimus ab
          labore provident mollitia. Id assumenda voluptate earum corporis facere quibusdam quisquam iste ipsa cumque
          unde nisi, totam quas ipsam.</p>
            <Link className='btn btn-primary btn-lg' to='/projects'>Find Nearby Projects</Link>
            {signUp ? <Link className='btn btn-primary btn-lg ml-2' to='/signup'>Sign Up</Link> : null}
          </Col>
        </Row>
      </Container>
    </header>
  )
}
Header.propTypes = {
  signUp: PropTypes.bool
}

function Section ({ headline, description, imgSrc, mirror }) {
  return (
    <Row as='section' className='py-4'>
      <Col xs={12} lg={mirror ? { span: 6, order: 1 } : 6} className='px-4'>
        <h1 className='display-4'>{headline}</h1>
        <p className='lead'>{description}</p>
      </Col>
      <Col xs={12} lg={6} className='px-4'>
        <img src={imgSrc} className='img-fluid' alt='' />
      </Col>
    </Row>
  )
}
Section.propTypes = {
  headline: PropTypes.string,
  description: PropTypes.string,
  imgSrc: PropTypes.string,
  mirror: PropTypes.bool
}

function Footer () {
  return (
    <footer className='py-5 bg-dark'>
      <Container>
        <p className='m-0 text-center text-white'>Copyright © Your Website 2019</p>
      </Container>
    </footer>
  )
}

function LandingPage ({ signUp }) {
  return (
    <div>
      <Header signUp={signUp} />
      <Container>
        <Section
          headline='Know how your community is changing'
          description='Lorem ipsum dolor sit amet, consectetur adipisicing elit. Non possimus ab
        labore provident mollitia. Id assumenda voluptate earum corporis facere quibusdam quisquam iste ipsa cumque
        unde nisi, totam quas ipsam.'
          imgSrc='/images/undraw_best_place_r685.svg'
        />
        <Section
          headline='Keep up with local development'
          description='Lorem ipsum dolor sit amet, consectetur adipisicing elit. Non possimus ab
        labore provident mollitia. Id assumenda voluptate earum corporis facere quibusdam quisquam iste ipsa cumque
        unde nisi, totam quas ipsam.'
          imgSrc='/images/undraw_knowledge_g5gf.svg'
          mirror
        />
        <Section
          headline='Make your commute better'
          description='Lorem ipsum dolor sit amet, consectetur adipisicing elit. Non possimus ab
        labore provident mollitia. Id assumenda voluptate earum corporis facere quibusdam quisquam iste ipsa cumque
        unde nisi, totam quas ipsam.'
          imgSrc='/images/undraw_off_road_9oae.svg'
        />
      </Container>
      <Footer />
    </div>
  )
}
LandingPage.propTypes = {
  signUp: PropTypes.bool
}

export default LandingPage
