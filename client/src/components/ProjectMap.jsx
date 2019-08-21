import React, { Component } from 'react'
import PropTypes from 'prop-types'

import L from 'leaflet'
import 'leaflet-draw/dist/leaflet.draw'

import API from '../utils/API'

class ProjectMap extends Component {
  constructor (props) {
    super(props)
    this.mapRef = React.createRef()
  }

  componentDidUpdate () {
    if (this.props.project && this.props.edit && this.featureGroup) {
      this.drawControl = new L.Control.Draw({
        edit: { featureGroup: this.featureGroup },
        draw: {
          polyline: { metric: false },
          polygon: { metric: false },
          rectangle: { metric: false },
          circle: { metric: false },
          marker: { metric: false },
          circlemarker: { metric: false }
        }
      })
      this.map.addControl(this.drawControl)

      const featureGroup = this.featureGroup

      this.map.on(L.Draw.Event.CREATED, function (e) {
        featureGroup.addLayer(e.layer)
      })

      this.map.on(L.Draw.Event.DELETED, function (e) {
        featureGroup.removeLayer(e.layer)
      })
    }
  }

  componentDidMount () {
    this.map = L.map(this.mapRef.current, {
      zoom: 15,
      center: [28.5383, -81.3792],
      zoomControl: this.props.controls || false,
      layers: [
        L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png', {
          attribution: '<a target="_blank" href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>',
          minZoom: 1,
          maxZoom: 19
        })
      ]
    })
    if (!this.props.controls) {
      this.map.dragging.disable()
      this.map.touchZoom.disable()
      this.map.doubleClickZoom.disable()
      this.map.scrollWheelZoom.disable()
    }
    if (this.props.project) {
      this.featureGroup = L.geoJSON(this.props.project.features).addTo(this.map)
      if (this.props.project.features) this.map.fitBounds(this.featureGroup.getBounds())
    }
  }

  updateFeatures = () => {
    API.putProject({
      id: this.props.project.id,
      features: this.featureGroup.toGeoJSON()
    })
      .then(res => this.setState({ project: res.data }))
      .catch(error => console.error(error))
      .finally(() => { alert('Project Map has been saved.') })
  }

  render () {
    return <div className='w-100' ref={this.mapRef} {...this.props} />
  }
}
ProjectMap.propTypes = {
  project: PropTypes.object,
  edit: PropTypes.string,
  controls: PropTypes.bool
}

export default ProjectMap
