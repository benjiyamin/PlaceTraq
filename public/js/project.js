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

  $(document.body).on('click', '.event-box', function () {
    let eventId = parseInt($(this).data('id'))
    // $('#saveEventBtn').data('id', eventId)
    $.get(`/api/events/${eventId}`)
    // .done(event => {
    // $('#eventNameInput').val(event.name)
    // $('#eventDescriptionTextarea').val(event.description)
    // $('#eventStartInput').val(event.start)
    // })
    // .fail(error => { throw error })
  })
})
