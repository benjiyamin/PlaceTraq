import React, { Component } from 'react'
import PropTypes from 'prop-types'

import L from 'leaflet'
import 'leaflet-draw/dist/leaflet.draw'

import API from '../utils/API'

class ProjectMap extends Component {
  constructor (props) {
    super(props)
    this.map = React.createRef()
  }

  componentDidMount () {
    const map = L.map(this.map.current, {
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
    /*
    if (!this.props.controls) {
      map.dragging.disable()
      map.touchZoom.disable()
      map.doubleClickZoom.disable()
      map.scrollWheelZoom.disable()
    }
    */
    if (this.props.project) {
      this.featureGroup = L.geoJSON(this.props.project.features).addTo(map)
      if (this.props.project.features) map.fitBounds(this.featureGroup.getBounds())

      if (this.props.edit && this.featureGroup) {
        console.log(this.props.edit, 'here')
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
        map.addControl(this.drawControl)

        const featureGroup = this.featureGroup

        map.on(L.Draw.Event.CREATED, function (e) {
          featureGroup.addLayer(e.layer)
        })

        map.on(L.Draw.Event.DELETED, function (e) {
          featureGroup.removeLayer(e.layer)
        })
      }
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
    return <div className='w-100' ref={this.map} {...this.props} />
  }
}
ProjectMap.propTypes = {
  project: PropTypes.object,
  edit: PropTypes.string,
  controls: PropTypes.bool
}

export default ProjectMap
