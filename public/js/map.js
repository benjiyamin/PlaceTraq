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
    })
    .fail(error => { throw error })
})
