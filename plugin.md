# Plugin Architecture

Creator is a versitile creation platform designed to run on as many different
devices and platforms as possible.  The goal is to encourage people to be
creators on devices normally used primarilly for consumption.

To achieve this goal, the backends to the app are completely pluggable.  These
can be anything from remote web services running in the cloud to shared
workers running locally.

A backend provides menu entries (commands) and various services like virtual
filesystem mounts, runtime virtual machines, or live code linters.

Initially this will focus on replacing my Sublime Text workflow for lua and C
development, but on limited devices like chromebooks.  This small scoped, but
challenging use case will provide a good ground for architecting the sytem.

## Plugin API

The driver for any plugin is simply a javascript file.  It is normally run in
a worker to keep the system more stable, but some require APIs not existing in
workers. These will be run in a fairly clean environment using `new Function`.


```js
module.exports =
```
