/* eslint no-undef: 0 */

$(document).ready(function () {
  $('#followBtn').click(function () {
    let followed = $(this).data('followed')
    let projectId = $(this).data('project-id')
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

  $(document.body).on('click', '.event-view-btn', function () {
    let eventId = parseInt($(this).data('event-id'))
    $.get(`/api/events/${eventId}`)
      .done(event => {
        $('#eventModalLabel').text(event.name)
        $('#eventModalBody').html(event.detailsHTML)
      })
      .fail(error => { throw error })
  })
})
