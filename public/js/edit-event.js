$(document).ready(function () {
  let quill = new Quill('#eventEditor', { // eslint-disable-line no-undef
    theme: 'snow'
  })

  $('#saveEventBtn').click(function () {
    let projectId = parseInt(window.location.pathname.replace('/projects/', ''))
    let name = $('#eventNameInput').val().trim()
    let description = $('#eventDescriptionTextarea').val().trim()
    let start = $('#eventStartInput').val().trim()
    let about = JSON.parse(JSON.stringify(quill.getContents()))
    let data = {
      name: name,
      description: description,
      start: start,
      about: about
    }
    let eventId = parseInt($(this).data('id'))
    let type = eventId ? 'PUT' : 'POST'
    if (eventId) {
      data.id = eventId
    } else {
      data.ProjectId = projectId
    }
    $.ajax({
      url: '/api/events',
      type: type,
      data: data
    })
      .done(event => document.location.reload())
      .fail(error => { throw error })
  })

  $('#addEventBtn').click(function () {
    $('#saveEventBtn').removeAttr('data-id')
  })

  $(document.body).on('click', '.event-box', function () {
    let eventId = parseInt($(this).data('id'))
    $('#saveEventBtn').data('id', eventId)
    $.get(`/api/events/${eventId}`)
      .done(event => {
        $('#eventNameInput').val(event.name)
        $('#eventDescriptionTextarea').val(event.description)
        let start = moment(event.start).format('YYYY-MM-DD') // eslint-disable-line no-undef
        $('#eventStartInput').val(start)
      })
      .fail(error => { throw error })
  })
})
