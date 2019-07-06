var db = require('../models')

db.sequelize
  .sync({
    force: true
  })
  .then(function () {
    console.log('Creating a project.')
    db.Project.create({
      name: 'Crosstown Parkway',
      description: 'The Crosstown Parkway Extension Project will provide a new bridge crossing over the North Fork of the St. Lucie River in the City of Port St. Lucie, connecting the existing Crosstown Parkway from Manth Lane to U.S. 1.',
      start: new Date(2017, 2),
      end: new Date(2019, 9),
      location: 'Port St. Lucie'
    }).then(function (dbProject) {
      console.log('Creating events.')
      let events = [{
        name: 'Start Construction - Manth Lane to Coral Reef Street',
        datetime: new Date(2017, 2)
      }, {
        name: 'Start Construction - Bridge',
        datetime: new Date(2017, 4)
      },
      {
        name: 'Start Construction - Floresta Intersection',
        datetime: new Date(2017, 6)
      },
      {
        name: 'End Construction - Floresta Intersection',
        datetime: new Date(2017, 8)
      },
      {
        name: 'Start Construction - US Highway 1 and Village Green',
        datetime: new Date(2017, 8)
      },
      {
        name: 'End Construction - US Highway 1 and Village Green',
        datetime: new Date(2019, 4)
      },
      {
        name: 'End Construction - Manth Lane to Coral Reef Street',
        datetime: new Date(2019, 8)
      },
      {
        name: 'End Construction - Bridge',
        datetime: new Date(2019, 11)
      }]
      events.forEach(event => {
        event.description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque scelerisque diam non nisi semper, et elementum lorem ornare. Maecenas placerat facilisis mollis. Duis sagittis ligula in sodales vehicula...'
        event.ProjectId = dbProject.id
      })
      db.Event.bulkCreate(events).then(function () {
        console.log('Script finished')
        process.exit()
      })
    })
  })
