const fs = require('fs')

const bCrypt = require('bcrypt-nodejs')
const db = require('../models')

db.sequelize
  .sync({
    force: true
  })
  .then(function () {
    createGroup()
  })

function createGroup () {
  db.Group.create({
    name: 'Department of Transportation'
  })
    .then(function (dbGroup) {
      createUser(dbGroup)
    })
}

function createUser (group) {
  db.User.create({
    email: 'mail@mail.com',
    password: bCrypt.hashSync('password', bCrypt.genSaltSync(8), null)
  })
    .then(function (dbUser) {
      createMember(group, dbUser)
    })
}

function createMember (group, user) {
  console.log(group.id, user.id)
  db.Member.create({
    GroupId: group.id,
    UserId: user.id
  })
    .then(function () {
      fs.readFile('./scripts/about_quill1.json', (err, data) => {
        if (err) throw err
        let about = JSON.parse(data)
        createProject1(about, user)
      })
      fs.readFile('./scripts/about_quill2.json', (err, data) => {
        if (err) throw err
        let about = JSON.parse(data)
        createProject2(about, user)
      })
    })
}

function createProject1 (about, user) {
  console.log('Creating a project.')
  db.Project.create({
    name: 'Crosstown Parkway',
    description: 'The Crosstown Parkway Extension Project will provide a new bridge crossing over the North Fork of the St. Lucie River in the City of Port St. Lucie, connecting the existing Crosstown Parkway from Manth Lane to U.S. 1.',
    start: new Date(2017, 1),
    end: new Date(2019, 8),
    location: 'Port St. Lucie, FL',
    about: about
  })
    .then(function (project) {
      user.addProject(project)
      createEvents1(project)
    })
}

function createEvents1 (project) {
  console.log('Creating events.')
  let events = [{
    name: 'Start Construction - Manth Lane to Coral Reef Street',
    datetime: new Date(2017, 1)
  }, {
    name: 'Start Construction - Bridge',
    datetime: new Date(2017, 3)
  },
  {
    name: 'Start Construction - Floresta Intersection',
    datetime: new Date(2017, 5)
  },
  {
    name: 'End Construction - Floresta Intersection',
    datetime: new Date(2017, 7)
  },
  {
    name: 'Start Construction - US Highway 1 and Village Green',
    datetime: new Date(2017, 7)
  },
  {
    name: 'End Construction - US Highway 1 and Village Green',
    datetime: new Date(2019, 3)
  },
  {
    name: 'End Construction - Manth Lane to Coral Reef Street',
    datetime: new Date(2019, 7)
  },
  {
    name: 'End Construction - Bridge',
    datetime: new Date(2019, 10)
  }
  ]
  events.forEach(event => {
    event.description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque scelerisque diam non nisi semper, et elementum lorem ornare. Maecenas placerat facilisis mollis. Duis sagittis ligula in sodales vehicula...'
    event.ProjectId = project.id
  })
  db.Event.bulkCreate(events).then(function () {})
}

function createProject2 (about, user) {
  console.log('Creating a project.')
  db.Project.create({
    name: 'I-4 Ultimate',
    description: 'I-4 Ultimate is an important project for Central Florida. The 21-mile makeover — from west of Kirkman Road in Orange County to east of State Road 434 in Seminole County — is transforming the region to better connect our communities, boost our economy and improve everyone’s quality of life.',
    start: new Date(2015, 1),
    end: new Date(2021, 2),
    location: 'Orlando, FL',
    about: about
  })
    .then(function (project) {
      user.addProject(project)
      createEvents2(project)
    })
}

function createEvents2 (project) {
  console.log('Creating events.')
  let events = [{
    name: 'Westbound entrance and exit ramps at S.R. 434 Closing for Two Nights',
    datetime: new Date(2019, 5, 24)
  }, {
    name: 'Westbound entrance and exit ramps at S.R. 434 Open',
    datetime: new Date(2019, 5, 25)
  },
  {
    name: 'Rio Grande Ave. under I-4 closing continuously June 28-30',
    datetime: new Date(2019, 5, 28)
  },
  {
    name: 'Rio Grande Ave. under I-4 open',
    datetime: new Date(2019, 5, 28)
  },
  {
    name: 'Maitland Boulevard Temporarily Closing for One Night',
    datetime: new Date(2019, 5, 27)
  },
  {
    name: 'WB I-4 through downtown Orlando shifting June 29',
    datetime: new Date(2019, 5, 27)
  },
  {
    name: 'WB I-4 exit ramp to Lee Road shifting on June 30',
    datetime: new Date(2019, 5, 30)
  }
  ]
  events.forEach(event => {
    event.description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque scelerisque diam non nisi semper, et elementum lorem ornare. Maecenas placerat facilisis mollis. Duis sagittis ligula in sodales vehicula...'
    event.ProjectId = project.id
  })
  db.Event.bulkCreate(events).then(function () {})
}
