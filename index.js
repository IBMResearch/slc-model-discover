/*
  Copyright (c) 2016 IBM Research Emergent Solutions
                     Jesús Pérez <jesusprubio@gmail.com>
                     Paco Martín <fmartinfdez@gmail.com>

  This code may only be used under the MIT style license found at
  https://ibmresearch.github.io/LICENSE.txt
*/

'use strict';


const fs = require('fs');

const lodash = require('lodash');
const dbg = require('debug')('slc-model-discover:index');

const errMandatory = 'Mandatory option not found: ';


// "outPath" should be absolute here.
module.exports = (dbName, datasource, outPath) =>
  new Promise((resolve, reject) => {
    // Getting the options and setting the defaults it not present.

    // Rejecting in case of the mandatory ones.
    if (!dbName) {
      reject(new Error(`${errMandatory}"db"`));

      return;
    }
    if (!datasource) {
      reject(new Error(`${errMandatory}"dataSource"`));

      return;
    }
    if (!outPath) {
      reject(new Error(`${errMandatory}"outPath"`));

      return;
    }

    // TODO use a promise here.
    datasource.discoverModelDefinitions({ schema: dbName }, (err, models) => {
      if (err || !models) {
        reject(new Error(`Discovering definitions: ${err.message}`));

        return;
      }

      dbg('Models discovered', models);

      lodash.each(models, (model) => {
        if (model.name && (model.type === 'table')) {
          dbg(`Discover: ${model.name}`);

          datasource.discoverSchema(model.name, { schema: dbName }, (err2, schema) => {
            if (err2) {
              reject(new Error(`Discovering the schema: ${err2.message}`));

              return;
            }

            if (!schema) {
              reject(new Error('Schema not found'));

              return;
            }

            const outputName = `${outPath}/${schema.name}.json`;
            dbg(`Auto discovery success: ${schema.name}`);

            // TODO: Use a promise here.
            fs.writeFile(outputName, JSON.stringify(schema, null, 2), (err3) => {
              if (err3) {
                reject(new Error(`Wrinting to the file: ${err3.message}`));

                return;
              }
              dbg(`JSON saved to "${outputName}"`);
            });
          });
        }
      });
    });
  });
