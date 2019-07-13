$(document).ready(function () {
  $('#saveGroupBtn').click(function () {
    let name = $('#nameInput').val().trim()
    let description = $('#descriptionTextarea').val().trim()
    $.ajax({
      url: '/api/groups',
      type: 'POST',
      data: {
        name: name,
        description: description
      }
    })
      .done(group => { document.location.reload() })
      .fail(error => { throw error })
  })
})
