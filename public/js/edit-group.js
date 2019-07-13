$(document).ready(function () {
  $('#saveGroupBtn').click(function () {
    let groupId = parseInt(window.location.pathname.replace('/groups/', ''))
    let name = $('#groupNameInput').val().trim()
    let description = $('#groupDescriptionTextarea').val().trim()
    $.ajax({
      url: '/api/groups',
      type: 'PUT',
      data: {
        id: groupId,
        name: name,
        description: description
      }
    })
      .done(project => { document.location.reload() })
      .fail(error => { throw error })
  })
})
