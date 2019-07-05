const express = require('express')

const router = express.Router()

/*
function createRoutes (model, baseUrl, includeModels) {
  router.get(baseUrl, function (request, response) {
    let options = {}
    if (includeModels) options.include = includeModels
    model.findAll(options)
      .then(data => {
        response.json(data)
      })
      .catch(() => {
        response.status(500).end()
      })
  })

  router.post(baseUrl, function (request, response) {
    model.create(request.body)
      .then(data => {
        response.json(data)
      })
      .catch(() => {
        response.status(500).end()
      })
  })

  router.put(`${baseUrl}`, function (request, response) {
    model.update(request.body, {
      where: {
        id: request.body.id
      }
    })
      .then(data => {
        response.json(data)
      })
      .catch(() => {
        response.status(500).end()
      })
  })

  router.delete(`${baseUrl}/:id`, function (request, response) {
    model.destroy({
      where: {
        id: request.params.id
      }
    })
      .then(() => {
        response.status(204).end()
      })
      .catch(() => {
        response.status(500).end()
      })
  })
}
*/

// createRoutes(db.Customer, '/api/customers', [db.Burger])
// createRoutes(db.Burger, '/api/burgers', [db.Customer])

module.exports = router
