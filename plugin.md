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

The driver for any plugin is simply a javascript module.  The core modules
contain the mutable lists of items like menu entries and live filesystems.

For example, a simple plugin may have one command to enable itself and another
to disable itself.  It will do this by adding and removing keys on the menu
list.

```js
var vfs = yield* load('core/vfs');
var menu = yield* load('core/menu');

var enableCommand = "Temp Filesystem: Enable";
var disableCommand = "Temp Filesystem: Disable";

menu[enableCommand] = enable;

var fs = {...};

return {
  enable: enable,
  disable: disable,
};

function* enable() {
  delete menu[enableCommand];
  menu[disableCommand] = disable;
  vfs["temp://"] = fs;
}

function* disable() {
  menu[enableCommand] = enable;
  delete menu[disableCommand];
  delete vfs["temp://"];
}
```
