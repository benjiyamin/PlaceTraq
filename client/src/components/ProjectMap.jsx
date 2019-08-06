import React, { Component } from 'react'
import PropTypes from 'prop-types'

import L from 'leaflet'
import 'leaflet-draw/dist/leaflet.draw'

class ProjectMap extends Component {
  componentDidMount () {
    const map = L.map('map', {
      layers: [
        L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png', {
          attribution: '<a target="_blank" href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>',
          minZoom: 1,
          maxZoom: 19
        })
      ]
    })
    if (this.props.project) {
      const featureGroup = L.geoJSON(this.props.project.features).addTo(map)
      map.fitBounds(featureGroup.getBounds())

      if (this.props.edit) {
        this.drawControl = new L.Control.Draw({
          edit: { featureGroup: featureGroup },
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

        map.on(L.Draw.Event.CREATED, function (e) {
          featureGroup.addLayer(e.layer)
        })

        map.on(L.Draw.Event.DELETED, function (e) {
          featureGroup.removeLayer(e.layer)
        })
      }
    }
  }

  render () {
    return <div className='w-100' id='map' {...this.props} />
  }
}
ProjectMap.propTypes = {
  project: PropTypes.object,
  edit: PropTypes.string
}

export default ProjectMap
