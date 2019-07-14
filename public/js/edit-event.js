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
})
