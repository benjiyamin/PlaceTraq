$(document).ready(function () {
  $('#saveProjectBtn').click(function () {
    let groupId = parseInt(window.location.pathname.replace('/groups/', ''))
    let name = $('#nameInput').val().trim()
    let description = $('#descriptionTextarea').val().trim()
    let location = $('#locationInput').val().trim()
    let start = $('#startInput').val().trim()
    let end = $('#endInput').val().trim()
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
      .done(project => { document.location.reload() })
      .fail(error => { throw error })
  })
})
