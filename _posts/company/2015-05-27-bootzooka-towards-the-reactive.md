---
title: New in Bootzooka - Towards the Reactive
description: How we migrated Bootzooka to Slick 3.0 and what are the larger consequences of transforming the codebase to a more reactive approach?
author: Krzysztof Ciesielski
author_login: ciesielski
categories:
- bootzooka
- reactive
- scala
- slick
- company
layout: simple_post
---
Recently we updated our seed project Bootzooka with new version of dependencies. The most important one is a transition from Slick 2.1 to 3.0. Slick is a library for accessing relational databases with typesafe queries built with a 'functional-relational mapping' paradigm. Its fresh release brings a greatly rebuilt API which is now asynchronous and monadic. Here's [a great introduction](https://www.parleys.com/tutorial/reactive-slick-database-programming) to these concepts by Slick tech lead Stefan Zeiger.
The consequences of such change are very significant - we can return `Future` instead of blocking not only in our data acess layer, but across all application layers. Let's take a look at a sample use case - new user registration (squeezed a bit here and there for brevity).

####The web layer

Scalatra offers a simple way of handling aynchronous result. We can return an `AsyncResult` which wraps a `Future` returned by inner service.

```scala
post("/register", operation(register)) {
  if (!userService.isUserDataValid(loginOpt, emailOpt, passwordOpt)) {
    haltWithBadRequest("Wrong user data!")
  } else {
    val paramLogin = login
    val paramPass = password
    val paramEmail = email
    new AsyncResult {
      val is = userService.checkUserExistenceFor(paramLogin, paramEmail).flatMap {
        case Left(error) => Future { haltWithConflict(error) }
        case _ =>
          userService
            .registerNewUser(escapeHtml4(paramLogin), paramEmail, paramPass).map(
              _ => Created(StringJsonWrapper("success")))
      }
    }
  }
}
```

Notice that we extract `paramLogin`, `paramPass` and `paramEmail` before proceeding. That's because `login`, `password` and `email` are methods and we **can't call them** inside a `Future`. That's a tricky thing that one must remember when working with async Scala code - **avoid closing over mutable state!**
Our `AsyncResult` has a field called `is` and this field should carry our result wrapped in a `Future`. To build it, we are sequentially calling two async services. First one, `checkUserExistenceFor` does a background check if a user with given name or email already exists. Since it returns a `Future`, we need to `map` or `flatMap` over it to define how we would like to proceed with the wrapped result. If requested user data does not yet exist, we are going to call another async service (`registerNewUser`) and return its result as the final one. Since we don't want to end up with a `Future[Future[T]]`, we used `flatMap`. Let's now see how does the registration service look like:

####The service layer

```scala
def registerNewUser(login: String, email: String, password: String): Future[Unit] = {
  val salt = Utils.randomString(128)
  val token = UUID.randomUUID().toString
  userDao.add(User(login, email.toLowerCase, password, salt, token))
    .flatMap(_ => {
    val confirmationEmail = emailTemplatingEngine.registrationConfirmation(login)
    emailScheduler.scheduleEmail(email, confirmationEmail)
  })
}
```

Here's a similar situation: our call to `userDao` is asynchronous and if it succeeds, we want to send an e-mail. Again we are using `flatMap` to compose these two values of type `Future` in a monadic way. Let's now peek into our DAO where we used new Slick 3.0 API:

####The data access layer

```scala
def add(user: User): Future[Unit] = {
  val userByLoginFut = findByLowerCasedLogin(user.login)
  val userByEmailFut = findByEmail(user.email)

  for {
    userByLoginOpt <- userByLoginFut
    userByEmailOpt <- userByEmailFut
  } yield {
    if (userByLoginOpt.isDefined || userByEmailOpt.isDefined) {
     throw new IllegalArgumentException("User already exists")
    }
    else {
      db.run(users += user).mapToUnit
    }
  }
}
```

First we assign two new vals with future DB checks which try to find user by login and e-mail. The `for {}` block is another way of defining monadic composition. The difference here is since our `Futures` are pre-assigned, they will be executed *in parallel*. Then the `yield` block deals with results when they both come. Finally, if everything went fine, we can go with `db.run(users += user).mapToUnit`. This call sends a `DBIOAction` to our database, returning a value of type `Future[Int]`. We additionaly map this to `Future[Unit]`.
Here's the main difference between Slick 3.0 and 2.x. We compose queries of type `Query`, then we make them into executable objects of type `DBIOAction`. Such actions are monads and can also be composed, so we can define database calls based on results of previous calls without actually calling the DB. The final `DBIOAction` can be sent to the database for execution by calling `db.run()`.

####Why 'Reactive'?
We saw that our codebase is now crawling with `Futures`. Thanks to for comprehension and flatMap we can compose them like any other monad and define our logic based on eventually returned values. This is the main elegance of monads - being able to specify computations on some data wrapped in context without explicitly unwrapping this data. But what are real gains of the new approach? Wasn't it simpler before to just define our logic without all the extra code?
#####Elasic threads
In typical approach, a synchronous call creates a thread in the web layer and this thread becomes blocked until our database call completes. In case of slow responses, a part of our application can easily become a bottleneck producing hanging threads and affecting the availability and responsiveness of all the other features. With async DB calls threads get released quickly and they come back re-allocated after a reponse is ready to be returned.
#####Error isolation
Each async call requires an implicit `ExecutionContext` which defines what thread pool will be used. You can now have much better control over different parts of the application, assigning dedicated `ExecutionContext` to them. In case when all threads in some part of your system hang due to a bug, there's still a possibility that other parts have their own thread pools and will continue to work without resource starvation. This approach to isolation of failure zones is called the Bulkhead Pattern.

####Conclusions
There are still parts in Bootzooka where we had to work synchronously. For example: Scalatra has an internal API for authentication which requires overriding a method that immediately returns current user, so we had to use `Await.result()` to handle this case. However, other parts of the code got transformed pretty seamlessly. With little effort, our system becomes much more *elastic* and *resilient* which, as we learned, are not only hot buzzwords from the [Reactive Manifesto](http://www.reactivemanifesto.org/) but actual important values.

Bootzooka is now also available as a [Typesafe Activator Template](https://www.typesafe.com/activator/template/bootzooka)
