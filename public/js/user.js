$(document).ready(function () {
  $('#saveGroupBtn').click(function () {
    let name = $('#groupNameInput').val().trim()
    let description = $('#groupDescriptionTextarea').val().trim()
    $.ajax({
      url: '/api/groups',
      type: 'POST',
      data: {
        name: name,
        description: description
      }
    })
      .done(group => document.location.reload())
      .fail(error => { throw error })
  })
})
