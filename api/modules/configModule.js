'use strict';

var colors = require('colors/safe');
var fs = require('fs');

var configPath="data/settings.json";

if (!fs.existsSync("data")){
  fs.mkdirSync("data");
}
var config = module.exports = {
  config: {
    entries:[],
    groups:[],
    devices:[],
    profitabilityServiceUrl:null,
    deployOnStartup:null,
    autoswitchInterval:3
  },
  configNonPersistent:{
    protocols:[
      "http",
      "https"
    ],
    algos:[
      "x11",
      "x13",
      "x14",
      "x15",
      "quark",
      "qubit"
    ],
    regions:[
      "eu",
      "usa",
      "hk",
      "jp"
    ]
  },
  getConfig: function () {
    return config.config;
  },
  setConfig: function (newConfig) {
    config.config = newConfig;
  },
  saveConfig: function () {
    console.log(colors.grey("writing config to file.."));
    fs.writeFile(configPath, JSON.stringify(config.config,null,2), function (err) {
      if (err) {
        return console.log(err);
      }
    });
  },
  loadConfig: function () {
    fs.stat(configPath, function (err, stat) {
      if (err == null) {
        fs.readFile(configPath, 'utf8', function (err, data) {
          if (err) throw err;
          config.config = JSON.parse(data);
          if(config.config.deployOnStartup===undefined)
            config.config.deployOnStartup=false;
          if(config.config.autoswitchInterval===undefined)
            config.config.autoswitchInterval=3;
        });
      } else if (err.code == 'ENOENT') {
        //default conf
        config.config.deployOnStartup=false;
        config.saveConfig();
        setTimeout(function(){
          config.loadConfig();
        },500);
      }
    });
  }
};
console.log("initializing, please wait...");
config.loadConfig();
