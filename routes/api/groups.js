const router = require('express').Router()
const groupsController = require('../../controllers/groups')

// Matches with "/api/groups"
router.route('/')
  .get(groupsController.findAll)
  .post(groupsController.create)
  .put(groupsController.update)

// Matches with "/api/groups/:id"
router.route('/:id')
// .get(groupsController.findById)
// .put(groupsController.update)
// .delete(groupsController.remove)

module.exports = router
