import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'

import Navbar from '../../components/Navbar'
import API from '../../utils/API'
import './style.css'

function Header ({ signUp, sections }) {
  const handleArrowClick = () => window.scrollTo(0, sections.current.offsetTop)

  return (
    <header className='bg-secondary landing-hero-image hero-image'>
      <Navbar transparent sticky />
      <Container className='h-100 py-5' style={{ transform: 'translateY(-56px)' }}>
        <Row className='h-100 align-items-center text-center'>
          <Col>
            <img src='/images/bubbles.svg' alt='' className='mt-5' />
            <h1 className='display-4 text-white font-weight-bold my-3'>Follow Local Projects</h1>
            <p className='lead mb-5 text-white'>PlaceTraq keeps you updated on infrastructure
              in your area. </p>
            <div className='mx-auto'>
              <Link className='btn btn-primary btn-lg mb-2' to='/projects'>Find Nearby Projects</Link>
              {signUp ? <Link className='btn btn-outline-light btn-lg mb-2 ml-2' to='/signup'>Sign Up</Link> : null}
            </div>
          </Col>
        </Row>
        <Row className='text-white d-flex justify-content-center'>
          <h1 className='cursor-pointer' onClick={handleArrowClick}><i className='fas fa-arrow-down' /></h1>
        </Row>
      </Container>
    </header>
  )
}
Header.propTypes = {
  signUp: PropTypes.bool,
  sections: PropTypes.object
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
        <p className='m-0 text-center text-white'>Copyright © PlaceTraq 2019</p>
      </Container>
    </footer>
  )
}

class LandingPage extends Component {
  constructor (props) {
    super(props)
    this.sections = React.createRef()
  }

  state = {
    user: null
  }

  componentDidMount () {
    this.loadUser()
  }

  loadUser = () => {
    API.getRequestUser()
      .then(res => this.setState({ user: res.data }))
      .catch(error => console.error(error))
  }

  render () {
    return (
      <>
        <Header signUp={!this.state.user} sections={this.sections} />
        <Container ref={this.sections}>
          <Section
            headline='Know how your community is changing'
            description="Stay current with your city and take pride in how it's
              constantly growing."
            imgSrc='/images/undraw_best_place_r685.svg'
          />
          <Section
            headline='Keep up with local development'
            description='Gain new insight in how construction around you will
            impact your life and affect the nearby properties.'
            imgSrc='/images/undraw_knowledge_g5gf.svg'
            mirror
          />
          <Section
            headline='Make your commute better'
            description='Receive up-to-date alerts to avoid getting
              stuck in traffic. Know where and when detours are happening helps
              you save time and headaches.'
            imgSrc='/images/undraw_off_road_9oae.svg'
          />
        </Container>
        <Footer />
      </>
    )
  }
}
/*
LandingPage.propTypes = {
  signUp: PropTypes.bool
}
*/

export default LandingPage
