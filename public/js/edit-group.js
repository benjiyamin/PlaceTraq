$(document).ready(function () {
  $('#saveGroupBtn').click(function () {
    let groupId = parseInt($(this).data('group-id'))
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
      .done(project => document.location.reload())
      .fail(error => { throw error })
  })
})
