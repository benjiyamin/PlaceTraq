// load bcrypt
const bCrypt = require('bcrypt-nodejs')
const LocalStrategy = require('passport-local').Strategy
// const JWTStrategy = require('passport-jwt').Strategy
// const ExtractJWT = require('passport-jwt').ExtractJWT

module.exports = function (passport, user) {
  let User = user
  // let LocalStrategy = require('passport-local').Strategy

  passport.use('local-signup', new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true // allows us to pass back the entire request to the callback
    },

    function (req, email, password, done) {
      var generateHash = function (password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null)
      }
      User.findOne({
        where: {
          email: email
        }
      }).then(function (user) {
        if (user) {
          return done(null, false, {
            message: 'That email is already taken'
          })
        } else {
          var userPassword = generateHash(password)
          var data = {
            email: email,
            password: userPassword
          }

          User.create(data).then(function (newUser, created) {
            if (!newUser) {
              return done(null, false)
            }
            if (newUser) {
              return done(null, newUser)
            }
          })
        }
      })
    }
  ))

  passport.use('local-login', new LocalStrategy(
    {
      // by default, local strategy uses username and password, we will override with email
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true // allows us to pass back the entire request to the callback
    },

    function (req, email, password, done) {
      var User = user
      var isValidPassword = function (userpass, password) {
        return bCrypt.compareSync(password, userpass)
      }

      User.findOne({
        where: {
          email: email
        }
      }).then(function (user) {
        if (!user) {
          return done(null, false, {
            message: 'Email does not exist'
          })
        }

        if (!isValidPassword(user.password, password)) {
          return done(null, false, {
            message: 'Incorrect password.'
          })
        }

        var userinfo = user.get()
        return done(null, userinfo)
      }).catch(function (err) {
        console.log('Error:', err)

        return done(null, false, {
          message: 'Something went wrong with your Signin'
        })
      })
    }

  ))

  // serialize
  passport.serializeUser(function (user, done) {
    done(null, user.id)
  })

  // deserialize user
  passport.deserializeUser(function (id, done) {
    User.findByPk(id).then(function (user) {
      if (user) {
        done(null, user.get())
      } else {
        done(user.errors, null)
      }
    })
  })

  /*
  passport.use('local-jwt', new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: process.env.JWT_SECRET
  }, (jwtPayload, done) => {
    try {
      User.findOne({
        where: {
          email: jwtPayload.id
        }
      }).then(user => {
        if (user) {
          console.log('user found in db in passport')
          // note the return removed with passport JWT - add this return for passport local
          done(null, user)
        } else {
          console.log('user not found in db')
          done(null, false)
        }
      })
    } catch (err) {
      done(err)
    }
  }))
  */
}
