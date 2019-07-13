$(document).ready(function () {
  let $searchBtn = $('#searchBtn')
  let $searchInput = $('#searchInput')

  $searchBtn.click(() => {
    let search = $searchInput.val().trim()
    let url = '/projects?search=' + search
    window.location.replace(url)
  })

  $searchInput.keyup(event => {
    if (event.which === 13) $searchBtn.click()
  })
})
