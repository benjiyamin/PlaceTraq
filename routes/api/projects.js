const router = require('express').Router()
const projectsController = require('../../controllers/projects')

// Matches with "/api/projects"
router.route('/')
  .get(projectsController.findAll)
  .post(projectsController.create)
  .put(projectsController.update)

// Matches with "/api/projects/:id"
router.route('/:id')
  .get(projectsController.findById)
  // .put(projectsController.update)
  // .delete(projectsController.remove)

router.route('/:id/follow')
  .put(projectsController.follow)

module.exports = router
