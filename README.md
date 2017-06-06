# Installation

git clone https://github.com/sherlyc/Social-Login.git
npm i
cd Social-Login
touch .env
put the following lines in your .env file.

FACEBOOK_APP_ID=YOURAPPID
FACEBOOK_APP_SECRET=YOURSECRET

npm run knex migrate:latest
npm run knex seed:run
npm run dev

# Social Login Checklist

## Introduction

The following checklist walks you through a best-practice for an app with local (username and password form) and social login features using [Passport](http://passportjs.org/). It asumes you're using express, server-side rendering and routing, and a relational database.


## Server

- [x] I have written a JavaScript file that instantiates a server
  - [x] The file exports the server - allowing me to require and test it.
  - [x] The server is NOT automatically started when required into another file. i.e. Does NOT have `.listen()` in it.
- [x] I have setup a the [template-engine](http://expressjs.com/en/guide/using-template-engines.html) OR similar

HINT - you can use the following to have the server file only run `.listen()` if it has not been required:

```js
var port = process.env.PORT || 3000

if (require.main === module) {
  server.listen(port, function () {
    console.log(`server listening on ${port}`)
  })
}
```

## User and Database Methods

- [x] My app has the concept of a `user`
- [x] I have a migration for a `users` table that includes the following columns or similar:
  - [x ] `id`
  - [x] `name`
  - [x] `email`
  - [x] social media account id e.g. `twitterId`
  - [x] `hashedPassword`
- [x] I have written tests for methods that:
  - [x] finds users by their primary id e.g. `find()` or `findById()`
  - [x] finds users by their email e.g. `findByEmail()`
  - [x] finds users based on their social media identifier e.g. `findByFacebookId()`
  - [x] create a user in your `users` table e.g. `createUser()`
    - [x ] user creation tests that unique emails are enforced - _i.e. if an account with the same email is created `createUser` responds with an `Error` informing that we will use to inform the user that an account with this email already exists._
  - [x] ensure passwords are hashed correctly, and you have all the helper methods needed e.g. `hashPassword()` and `comparePassword()` helper functions using [bcryptjs](https://www.npmjs.com/package/bcryptjs) or [bcrypt](https://www.npmjs.com/package/bcrypt) or similar.
  - **OR** _IF I am using an ORM, I have written analogous user model tests for the above_
- [x] My tests all pass.


## Routing, Authentication and Authorisation Logic

Note, you can call your routes whatever you like, so long as they're not going to be ambiguous for future developers / future you.

- [x] I have set up a series of **incomplete** routes. These minimally include:
  - [x] **View Routes:** to a view or views that will contain my login buttons or anchors and forms:
    * GET `/` (login forms on the main page) AND/OR
    * GET `/login` (this may be the same as `/auth/facebook` in some apps)
  - [x] a POST `/signup` for registering user accounts with user details
  - [x] a POST `/login` for logging in
  - [x] a GET `/logout` for logging out
  - [x] a GET `/auth/facebook` for initiating the social login
  - [x] a GET `/auth/facebook/callback` for recieving the details back from the provider

In addition these may include (recommended):
  - [x] private RESTful routes only available to authenticated users e.g. GET `/transactions`
  - [x] a private route only available to a specific authenticated user e.g. GET `/users/:id/profile/edit`

In addition:
- [x] I have mapped a diagram of success and failure redirect flows between relevant routes e.g. (not limited to):
  * GET `/` is authenticated -> `/resource`
  * GET `/` is not authenticated -> `/login`

I.e when the user attempts to navigate to `/` if they are authenticated redirect them to `/resource`, if they are not 

  * GET `/resource` is not authenticated -> `/login`
  * GET `/users/:id/profile/edit` is not authorised -> `/login`



## Views

- [x] I have created a views folder that contains the **incomplete views** specified in **view routes** above.


## Tests

- [ ] I have written server tests for my **Views** AND
- [ ] I have converted my **Routing, Authentication and Authorisation Logic**  into view tests.

- [ ] My unauthenticated (public) view tests PASS.
- [ ] My authenticated route tests FAIL.


## Passport and Session Setup

- [x] I have installed Passport related modules :
  - [x] [passport](https://www.npmjs.com/package/passport),
  - [x] [passport-local](https://www.npmjs.com/package/passport-local),
  - [x] the social login [strategy](http://passportjs.org/), e.g. [passport-facebook](https://www.npmjs.com/package/passport-facebook)

- [x] I have installed [express-session](https://www.npmjs.com/package/express-session), [body-parser](https://www.npmjs.com/package/body-parser)
- [x] I have checked my modules are installed and are now listed in my `package.json`
- [x] I have required the above modules into my server file
- [x] I have added the `express-session` and `body-parser` [middleware setup](https://github.com/jaredhanson/passport#middleware) to the top of my server file underneath my module requires


## Passport Strategy Setup

We are now ready to write our passport code and get our autheticated route tests passing!

Testing social login directly is impossible to do with unit testing.
We will write our local strategy which we can unit test first, get our **Routing, Authentication and Authorisation Logic** tests to pass, then implement a social login on top of this.

- [x] I have created a `passport.js` file and exported a function that accepts `app` and `passport` as parameters from this file.
- [x] I have required my user model OR database connection and functions into this file.
- [x] I have required my passport strategies into this file.
- [x] I have required my `passport.js` function into my server file and executed it passing in a reference to the initialised `app` and `passport`.


## Local Strategy

Now let's set up our local stratgey.

The details of the following checkpoints are unpacked in following subsections.

- [x] I have configured passport to use [passport-local](https://github.com/jaredhanson/passport-local/) startegy, implementing the following logic and interface with my database's user table and `hashPassword` and `comparePasswords` helper functions created previously:
- [x] I have configured passport to serialise and deserialise the unique user id to the `session` using my `find` or `findUserById` functions written previously:
- [x] I have implemented the authentication and authentication success and failure redirect logic above using the [passport.authenticate()](http://passportjs.org/docs/authenticate) middleware on `/login` `/signup`
- [ ] 
- [x] _(IF I am using routes that are private to particulare users)_ I have implemented this logic using custom middleware functions
- [ ] My authenticated route tests now PASS.


### Passport - User Model Interface

You need to connect each passport strategy to the user table in your database using the database functions or user model you have written above.
When we POST to `/login` or `/signup` we will be hitting the passport Local Strategy, which at its final step will run a callback.
This callback will be given a user, either : 
  - a matching user from the users table (if such a user exists), or 
  - a freshly created user (in the case of a `/signup`).

The logic for these operations is psuedocoded in the example below:

```js
passport.use(new LocalStrategy( 
  configObject,    // this is used to customise how the strategy works
  verifyCallback   // this is the callback we're modifying
)) 
```

Now in more detail (with config and callback inline):

```js

passport.use(new LocalStrategy({ 
    usernameField: 'email', 
    passReqToCallback: true 
  },

  // configure the LocalStrategy verifyCallback to accept parameters: 
  //   - request object
  //   - email and password,
  //   - done (a callback inside the verifyCallback)
  function (req, email, password, done) {
    //find user by email ->
      // if there's an error -> done(error)   (call done callback with an error)

      // user exists -> comparePasswords(password, hashedPassword)
        // passwords match -> done(null, user)
        // passwords do not match -> done(null, false, { message: 'Incorrect Password' })
      // user does not exist -> hash password ->
        // error ? done(error)
        // create user (req.body.name, email, hashedPassword, ...) ->
          // error ? done(error)
          // else done(null, user)
  })
)
```

### Serialising and deserialising the user id to the request

"Serialising" is a fancy word for converting a JSON object to a string. The session and passport setup above means the user's browser will store a hashed reference to the user id. When a request from this browsercomes through it passes this reference (cookie) to the server. Passport then unhashes this reference, lookup the user and attaches the user object to the request, making a reference to the "authenticated user" available to other routes. We need to tell passport how to lookup users and point it to the user id.

For more explanation of serialisation and deserialisation see [this stackoverflow answer](http://stackoverflow.com/a/27637668)



```js
passport.serializeUser(function (user, callback) {
  callback(null, user.id) // pass the user id as the second argument to the serialise user callback
})

passport.deserializeUser(function (id, callback) {
  // find user by user id ->
    // error ? callback(error)
    // else -> callback(null, user)
})

```

### Custom authorisation middleware

We may want to restrict access to a lot of our routes to authenticated (logged-in) users only. We may also restrict particular routes or resources to particular users. We will write our own [express middleware](http://expressjs.com/en/guide/using-middleware.html) for this functionality. Middleware are functions that site between ('in the middle') requests and the request listener. For example the following middleware function tests if it is coming from an autheticated user using the undocumented [req.isAutheticated()](https://github.com/jaredhanson/passport/blob/a892b9dc54dce34b7170ad5d73d8ccfba87f4fcf/lib/passport/http/request.js#L74) method that passport adds to the request:

```js
function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next() 
  } else {
    res.redirect('/login')
  }
}

```
We can use this function in a route like so:

```js
app.get('/cats', ensureAuthenticated, function (req, res) {
  res.render('cats')
})
```

If the user is authenticated the `ensureAutheticated` will pass the request to literally the `next` function (the handler that renders the 'cats'). Otherwise it redirects to `/login`.

The following psuedo-ish example shows how you might restrict access to a page for editing a user profile to the user to whom the profile belongs:

```js
function isAuthorisedUser (req, res, next) {
  // user does not exist on the request session -> redirect to '/login'
  // userId on the session equals the userId in the request params -> next()
  // else redirect to '/not-authorised'
}

app.get('/users/:id/profile/edit', isAuthorisedUser, function (req, res, next) {
  res.render('edit-profile', { user: req.user })
})

```


## Oauth Provider App Setup

You are now ready to add a social login feature to your app! "Provider" means the social media platform that provides the authentication service - Twitter, Facebook and Github would be common examples.

- [ ] I have a personal or shared account on the provider platform.
- [ ] I have created an Oauth App on the platform asscoiated with the above account, e.g. [Twitter](https://apps.twitter.com/), [Facebook](https://developers.facebook.com/docs/apps/register), [Github](https://github.com/settings/developers)
- [ ] I have entered the callback url into the app settings. This is the same url as I have created perviously but absolute e.g. `http://localhost:3000/auth/facebook/callback`.

Note: The input form for the callback url and app configuration setup varies by provider and sometimes changes. It may be obvious or you may have to check the docs or web search for the provider's Oauth App registration particulars. When you deploy your app you will need to register **another app** that callsback to the production host.

At the time of writing this [stackoverflow comment](http://stackoverflow.com/questions/37255315/cant-load-url-the-domain-of-this-url-isnt-included-in-the-apps-domains/37534760#37534760) was helpful for registering a facebook OAuth app.

- [ ] I have installed [dotenv](https://www.npmjs.com/package/dotenv) and saved it to my `package.json`
- [ ] I have created a `.env` file in the root directory of my project.
- [ ] I have added the keys and secrets from my Oauth app to my `.env` file
- [ ] I have required `dotenv` into the top of my server file and called `dotenv.config()`
- [ ] I have required the Provider Strategy into my `passport.js` file
- [ ] I have implemented the authentication and authentication success and failure redirect logic above using the [passport.authenticate()](http://passportjs.org/docs/authenticate) middleware on `/auth/facebook` and `/auth/facebook/callback`.
- [ ] I have written the logic in `passport.js` that connects the response from the Provider to our `users` table. 

### Example passport configuration

```js

passport.use(new FaceBookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL:  'http://localhost:3000/auth/facebook/callback' // <- example only
  },
  function (accessToken, refreshToken, profile, done) { 
  // the arguments are specific to the Stretegy. Check the docs of the strategy you have decided to use
    //find user by provider id
      // if there's an error -> done(error)   (call done callback with an error)
      // user exists -> done(null, user)
      // user does not exist ->
        // create user (profile.name, profile.email, ...) -> 
        // example only, you will need to extract details from the `profile` 
        // that you recieve from the Provider..
          // error ? done(error)
          // else done(null, user)
  })
)
```

You have now setup password and social login in your app! 

