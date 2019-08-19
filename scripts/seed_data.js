const fs = require('fs')

const bCrypt = require('bcrypt-nodejs')
const db = require('../models')

db.sequelize.sync({ force: true })
  .then(() => {
    return db.Group.create({
      name: 'Department of Transportation'
    })
  })
  .then(dbGroup => createUser(dbGroup))

function createUser (group) {
  db.User.create({
    firstName: 'John',
    lastName: 'Smith',
    email: 'mail@mail.com',
    password: bCrypt.hashSync('password', bCrypt.genSaltSync(8), null)
  })
    .then(dbUser => createMember(group, dbUser))
}

function createMember (group, user) {
  console.log(group.id, user.id)
  db.Member.create({
    GroupId: group.id,
    UserId: user.id,
    isOwner: true
  })
    .then(function () {
      fs.readFile('./scripts/about_quill1.json', (err, data) => {
        if (err) throw err
        let about = JSON.parse(data)
        createProject1(about, user, group)
      })
      fs.readFile('./scripts/about_quill2.json', (err, data) => {
        if (err) throw err
        let about = JSON.parse(data)
        createProject2(about, user, group)
      })
    })
}

function createProject1 (about, user, group) {
  console.log('Creating a project.')
  fs.readFile('./scripts/features1.json', (err, data) => {
    if (err) throw err
    let features = JSON.parse(data)
    db.Project.create({
      name: 'Crosstown Parkway',
      description: 'The Crosstown Parkway Extension Project will provide a new bridge crossing over the North Fork of the St. Lucie River in the City of Port St. Lucie, connecting the existing Crosstown Parkway from Manth Lane to U.S. 1.',
      start: new Date(2017, 1),
      end: new Date(2019, 8),
      location: 'Port St. Lucie, FL',
      about: about,
      features: features,
      GroupId: group.id
    })
      .then(dbProject => {
        user.addProject(dbProject)
        console.log('Creating events.')
        let events = [{
          name: 'Start Construction - Manth Lane to Coral Reef Street',
          start: new Date(2017, 1)
        }, {
          name: 'Start Construction - Bridge',
          start: new Date(2017, 3)
        },
        {
          name: 'Start Construction - Floresta Intersection',
          start: new Date(2017, 5)
        },
        {
          name: 'End Construction - Floresta Intersection',
          start: new Date(2017, 7)
        },
        {
          name: 'Start Construction - US Highway 1 and Village Green',
          start: new Date(2017, 7)
        },
        {
          name: 'End Construction - US Highway 1 and Village Green',
          start: new Date(2019, 3)
        },
        {
          name: 'End Construction - Manth Lane to Coral Reef Street',
          start: new Date(2019, 7)
        },
        {
          name: 'End Construction - Bridge',
          start: new Date(2019, 10)
        }
        ]
        events.forEach(event => {
          event.description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque scelerisque diam non nisi semper, et elementum lorem ornare. Maecenas placerat facilisis mollis. Duis sagittis ligula in sodales vehicula...'
          event.ProjectId = dbProject.id
        })
        return db.Event.bulkCreate(events)
      })
      .then(dbEvents => { return dbEvents })
  })
}

function createProject2 (about, user, group) {
  console.log('Creating a project.')
  fs.readFile('./scripts/features2.json', (err, data) => {
    if (err) throw err
    let features = JSON.parse(data)
    db.Project.create({
      name: 'I-4 Ultimate',
      description: 'I-4 Ultimate is an important project for Central Florida. The 21-mile makeover — from west of Kirkman Road in Orange County to east of State Road 434 in Seminole County — is transforming the region to better connect our communities, boost our economy and improve everyone’s quality of life.',
      start: new Date(2015, 1),
      end: new Date(2021, 2),
      location: 'Orlando, FL',
      about: about,
      features: features,
      GroupId: group.id
    })
      .then(project => {
        user.addProject(project)
        console.log('Creating events.')
        let events = [{
          name: 'Westbound entrance and exit ramps at S.R. 434 Closing for Two Nights',
          start: new Date(2019, 5, 24)
        }, {
          name: 'Westbound entrance and exit ramps at S.R. 434 Open',
          start: new Date(2019, 5, 25)
        },
        {
          name: 'Rio Grande Ave. under I-4 closing continuously June 28-30',
          start: new Date(2019, 5, 28)
        },
        {
          name: 'Rio Grande Ave. under I-4 open',
          start: new Date(2019, 5, 28)
        },
        {
          name: 'Maitland Boulevard Temporarily Closing for One Night',
          start: new Date(2019, 5, 27)
        },
        {
          name: 'WB I-4 through downtown Orlando shifting June 29',
          start: new Date(2019, 5, 27)
        },
        {
          name: 'WB I-4 exit ramp to Lee Road shifting on June 30',
          start: new Date(2019, 5, 30)
        },
        {
          name: 'Keller Rd. under Maitland Blvd. Closing Nightly',
          start: new Date(2019, 7, 18),
          description: 'The Florida Department of Transportation (FDOT) is temporarily closing Keller Road under Maitland Boulevard (State Road 414) along with the eastbound frontage road access to and from Keller Road. The nightly closures are scheduled to occur between 9 p.m. and 6 a.m. on August 18 through August 24.'
        },
        {
          name: 'Kennedy Blvd under I-4 closing nightly',
          start: new Date(2019, 7, 30),
          description: 'Kennedy Boulevard will close each night at 10 p.m., with the roadway reopening by 5 a.m. the following morning. These closures are necessary for work on the Interstate 4 (I-4) bridge over Kennedy Boulevard.'
        },
        {
          name: 'EB S.R. 408 to Orange Ave. closes nightly from 11 p.m. to 5 a.m.',
          start: new Date(2019, 8, 25),
          description: 'The I-4 Ultimate project is making great gains at the Interstate 4 (I-4) and State Road (S.R.) 408 interchange. Nightly closures and traffic pacing operations are necessary for work such as concrete pours and bridge girder placement.'
        },
        {
          name: 'The S.R. 408 ramps from I-4 are closing from 11 p.m. to 5 a.m.',
          start: new Date(2019, 8, 21),
          description: 'The I-4 Ultimate project is making great gains at the Interstate 4 (I-4) and State Road (S.R.) 408 interchange. Nightly closures and traffic pacing operations are necessary for work such as concrete pours and bridge girder placement.'
        },
        {
          name: 'The WB S.R. 408 entrance ramp from Division Ave. is closing from 11 p.m. to 5 a.m.',
          start: new Date(2019, 8, 23),
          description: 'The I-4 Ultimate project is making great gains at the Interstate 4 (I-4) and State Road (S.R.) 408 interchange. Nightly closures and traffic pacing operations are necessary for work such as concrete pours and bridge girder placement.'
        },
        {
          name: 'Colonial Dr. under I-4 closes from 10 p.m. to 6 a.m.',
          start: new Date(2019, 7, 16),
          description: 'The I-4 Ultimate project is making gains throughout downtown Orlando as new bridges are being constructed and concrete is being poured.'
        },
        {
          name: 'Washington Ave. at Hughey Ave. closes from 10 p.m. to 6 a.m.',
          start: new Date(2019, 7, 17),
          description: 'The I-4 Ultimate project is making gains throughout downtown Orlando as new bridges are being constructed and concrete is being poured.'
        },
        {
          name: 'Livingston Ave. under I-4 closes from 10 p.m. to 6 a.m.',
          start: new Date(2019, 7, 19),
          description: 'The I-4 Ultimate project is making gains throughout downtown Orlando as new bridges are being constructed and concrete is being poured.'
        },
        {
          name: 'Pine St. under I-4 closes from 10 p.m. to 6 a.m.',
          start: new Date(2019, 7, 21),
          description: 'The I-4 Ultimate project is making gains throughout downtown Orlando as new bridges are being constructed and concrete is being poured.'
        },
        {
          name: 'Hughey Ave. from Central Blvd. to Church St. closes from 10 p.m. to 6 a.m.',
          start: new Date(2019, 7, 22),
          description: 'The I-4 Ultimate project is making gains throughout downtown Orlando as new bridges are being constructed and concrete is being poured.'
        },
        {
          name: 'Division Ave. at Gore St. closes from 10 p.m. to 6 a.m.',
          start: new Date(2019, 7, 23),
          description: 'The I-4 Ultimate project is making gains throughout downtown Orlando as new bridges are being constructed and concrete is being poured.'
        },
        {
          name: 'Central Blvd. under I-4 closes from 10 p.m. to 6 a.m.',
          start: new Date(2019, 7, 18),
          description: 'The I-4 Ultimate project is making gains throughout downtown Orlando as new bridges are being constructed and concrete is being poured.'
        },
        {
          name: 'Church St. under I-4 closes from 10 p.m. to 6 a.m.',
          start: new Date(2019, 7, 18),
          description: 'The I-4 Ultimate project is making gains throughout downtown Orlando as new bridges are being constructed and concrete is being poured.'
        },
        {
          name: 'Amelia St. under I-4 closes from 10 p.m. to 6 a.m.',
          start: new Date(2019, 8, 3),
          description: 'The I-4 Ultimate project is making gains throughout downtown Orlando as new bridges are being constructed and concrete is being poured.'
        },
        {
          name: 'EB Lane on Lee Rd. and WB On Ramp to I-4 Closing',
          start: new Date(2019, 7, 16),
          description: 'The Florida Department of Transportation (FDOT) is closing the right lane on eastbound Lee Road (State Road 423) under Interstate 4 (I-4) and the westbound I-4 entrance ramp from Lee Road during the weekend of August 16.'
        },
        {
          name: 'Minnesota Ave. at Formosa Ave. Closing',
          start: new Date(2019, 7, 16),
          description: 'Minnesota Avenue at Formosa Avenue is closing the weekend of August 16. The continuous closure is scheduled to begin at 10 p.m. on Friday, August 16 and conclude by 5 a.m. by Monday, August 19'
        }
        ]
        events.forEach(event => {
          if (!event.description) event.description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque scelerisque diam non nisi semper, et elementum lorem ornare. Maecenas placerat facilisis mollis. Duis sagittis ligula in sodales vehicula...'
          event.ProjectId = project.id
        })
        return db.Event.bulkCreate(events)
      })
      .then(dbEvents => { return dbEvents })
  })
}
