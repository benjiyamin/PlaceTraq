/* eslint no-undef: 0 */

$(document).ready(function () {
  const map = L.map('map')

  L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png', {
    attribution: '<a target="_blank" href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>',
    minZoom: 1,
    maxZoom: 19
  }).addTo(map)

  let projectId = $('#map').data('project-id')
  let url = `/api/projects/${projectId}`
  $.get(url)
    .done(project => {
      let featureGroup = L.geoJSON(project.features).addTo(map)
      map.fitBounds(featureGroup.getBounds())

      let drawControl = new L.Control.Draw({
        edit: { featureGroup: featureGroup }
      })
      map.addControl(drawControl)

      function storeFeatures (message) {
        let features = featureGroup.toGeoJSON()
        $.ajax({
          url: '/api/projects',
          type: 'PUT',
          data: {
            id: projectId,
            features: features
          }
        })
          .done(project => { console.log(message) })
          .fail(error => { throw error })
      }

      map.on(L.Draw.Event.CREATED, function (e) {
        featureGroup.addLayer(e.layer)
        storeFeatures(`${e.layerType} feature created`)
      })

      map.on(L.Draw.Event.DELETED, function (e) {
        featureGroup.removeLayer(e.layer)
        storeFeatures(`${e.layerType} feature deleted`)
      })

      map.on(L.Draw.Event.EDITED, function (e) {
        storeFeatures(`${e.layerType} feature modified`)
      })
    })
    .fail(error => { throw error })
})
