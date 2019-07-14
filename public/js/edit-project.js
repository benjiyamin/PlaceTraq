$(document).ready(function () {
  let quill = new Quill('#projectEditor', { // eslint-disable-line no-undef
    theme: 'snow'
  })
  $('#saveProjectBtn').click(function () {
    let projectId = parseInt(window.location.pathname.replace('/projects/', ''))
    let name = $('#projectNameInput').val().trim()
    let description = $('#projectDescriptionTextarea').val().trim()
    let location = $('#projectLocationInput').val().trim()
    let start = $('#projectStartInput').val().trim()
    let end = $('#projectEndInput').val().trim()
    let about = JSON.parse(JSON.stringify(quill.getContents()))
    $.ajax({
      url: '/api/projects',
      type: 'PUT',
      data: {
        id: projectId,
        name: name,
        description: description,
        location: location,
        start: start,
        end: end,
        about: about
      }
    })
      .done(project => document.location.reload())
      .fail(error => { throw error })
  })
})
