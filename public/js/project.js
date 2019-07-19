/* eslint no-undef: 0 */

$(document).ready(function () {
  $('#followBtn').click(function () {
    let followed = $(this).data('followed')
    let projectId = parseInt(window.location.pathname.replace('/projects/', ''))
    let url = `/api/follow/${projectId}`
    if (typeof followed !== typeof undefined && followed !== false) {
      url += '?unfollow=true'
    }
    $.ajax({
      url: url,
      type: 'PUT'
    })
      .done(project => document.location.reload())
      .fail(error => { throw error })
  })

  var map = L.map('map')

  L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png', {
    attribution: '<a target="_blank" href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>',
    minZoom: 1,
    maxZoom: 19
  }).addTo(map)

  /*
  L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
  }).addTo(map)
  */

  /*
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)
  */

  let projectId = parseInt(window.location.pathname.replace('/projects/', ''))
  let url = `/api/projects/${projectId}`
  $.get(url)
    .done(project => {
      let layer = L.geoJSON(project.features).addTo(map)
      map.fitBounds(layer.getBounds())
    })
    .fail(error => { throw error })
})
