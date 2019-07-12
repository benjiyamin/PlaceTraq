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
      .done(function (data) {
        document.location.reload()
      })
      .fail(function (error) {
        throw error
      })
  })
})
