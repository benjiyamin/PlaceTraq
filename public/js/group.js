$(document).ready(function () {
  $('#saveProjectBtn').click(function () {
    let groupId = parseInt(window.location.pathname.replace('/groups/', ''))
    let name = $('#projectNameInput').val().trim()
    let description = $('#projectDescriptionTextarea').val().trim()
    let location = $('#projectLocationInput').val().trim()
    let start = $('#projectStartInput').val().trim()
    let end = $('#projectEndInput').val().trim()
    $.ajax({
      url: '/api/projects',
      type: 'POST',
      data: {
        GroupId: groupId,
        name: name,
        description: description,
        location: location,
        start: start,
        end: end
      }
    })
      .done(project => document.location.reload())
      .fail(error => { throw error })
  })
})
