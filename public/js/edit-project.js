$(document).ready(function () {
  // let quill = new Quill('#editor', { theme: 'snow' })

  $('#saveProjectBtn').click(function () {
    let projectId = parseInt(window.location.pathname.replace('/projects/', ''))
    let name = $('#nameInput').val().trim()
    let description = $('#descriptionTextarea').val().trim()
    let location = $('#locationInput').val().trim()
    let start = $('#startInput').val().trim()
    let end = $('#endInput').val().trim()
    $.ajax({
      url: '/api/projects',
      type: 'PUT',
      data: {
        id: projectId,
        name: name,
        description: description,
        location: location,
        start: start,
        end: end
      }
    })
      .done(project => { document.location.reload() })
      .fail(error => { throw error })
  })
})
