module("plugins/temp-filesystem", function* () {
  "use strict";
  var vfs = yield* load('core/vfs');
  var menu = yield* load('core/menu');

  var enableCommand = "Temp Filesystem: Enable";
  var disableCommand = "Temp Filesystem: Disable";

  menu[enableCommand] = enable;

  var fs = {
    readdir: function* () {},
    mkdir: function* () {},
    readfile: function* () {},
    mkfile: function* () {},
  };

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


});


