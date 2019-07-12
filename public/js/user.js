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
      .done(function (data) {
        document.location.reload()
      })
      .fail(function (error) {
        throw error
      })
  })
})
