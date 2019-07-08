$(document).ready(function () {
  let $searchBtn = $('#searchBtn')
  let $searchInput = $('#searchInput')

  $searchBtn.click(function () {
    let search = $searchInput.val().trim()
    let url = '/projects?search=' + search
    window.location.replace(url)
  })

  $searchInput.keyup(function (event) {
    if (event.which === 13) {
      $searchBtn.click()
    }
  })
})
