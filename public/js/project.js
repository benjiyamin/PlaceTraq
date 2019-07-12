$(document).ready(function () {
  $('#followBtn').click(function () {
    let followed = $(this).data('followed')
    let projectId = parseInt(window.location.pathname.replace('/projects/', ''))
    let url = `/api/follow/${projectId}`
    if (typeof followed !== typeof undefined && followed !== false) {
      url += '?unfollow=true'
    }
    $.ajax({
      url: url,
      type: 'PUT'
    })
      .done(function (data) {
        document.location.reload()
      })
      .fail(function (error) {
        throw error
      })
  })
})
