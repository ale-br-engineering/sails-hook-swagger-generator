'use strict';
var _ = require('lodash');
var generators = require('./generators');
var fs = require('fs');

module.exports = function (sails, context) {
    if (sails.config[context.configKey].disabled === true) {
        return;
    }

    var specifications = sails.config[context.configKey].swagger;
    specifications.parameters = generators.parameters(sails.config, context);

    var generatedRoutes = generators.routes(sails.controllers, sails.config, specifications.tags);
    specifications.paths = generators.paths(generatedRoutes, specifications.tags, sails.config[context.configKey].blueprint_parameters);

    fs.writeFile(sails.config[context.configKey].swaggerJsonPath, JSON.stringify(specifications), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("------------------------------------");
        console.log("   Swagger generated successfully   ");
        console.log("------------------------------------\n");
    });

    return specifications;

};