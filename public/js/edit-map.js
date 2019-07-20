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

      $('#saveMapBtn').click(function () {
        let features = featureGroup.toGeoJSON()
        $.ajax({
          url: '/api/projects',
          type: 'PUT',
          data: {
            id: projectId,
            features: features
          }
        })
          .done(project => { console.log(project) })
          .fail(error => { throw error })
      })

      map.on(L.Draw.Event.CREATED, function (e) {
        featureGroup.addLayer(e.layer)
      })

      map.on(L.Draw.Event.DELETED, function (e) {
        featureGroup.removeLayer(e.layer)
      })
    })
    .fail(error => { throw error })
})
