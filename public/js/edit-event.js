$(document).ready(function () {
  let quill = new Quill('#eventEditor', { // eslint-disable-line no-undef
    theme: 'snow'
  })

  $('#saveEventBtn').click(function () {
    let projectId = parseInt($(this).data('project-id'))
    let name = $('#eventNameInput').val().trim()
    let description = $('#eventDescriptionTextarea').val().trim()
    let start = $('#eventStartInput').val().trim()
    let details = quill.getText().trim().length ? JSON.parse(JSON.stringify(quill.getContents())) : null
    let data = {
      name: name,
      description: description,
      start: start,
      details: details
    }
    let eventId = parseInt($(this).data('event-id'))
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
    $('#saveEventBtn').removeAttr('data-event-id')
  })

  $(document.body).on('click', '.event-edit-btn', function () {
    let eventId = parseInt($(this).data('event-id'))
    $('#saveEventBtn').attr('data-event-id', eventId)
    $.get(`/api/events/${eventId}`)
      .done(event => {
        $('#eventNameInput').val(event.name)
        $('#eventDescriptionTextarea').val(event.description)
        let start = moment(event.start).format('YYYY-MM-DD') // eslint-disable-line no-undef
        $('#eventStartInput').val(start)
        quill.setContents(event.details)
      })
      .fail(error => { throw error })
  })
})
