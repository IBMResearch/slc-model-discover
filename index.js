/*
  Copyright (c) 2016 IBM Research Emergent Solutions
                     Jesús Pérez <jesusprubio@gmail.com>
                     Paco Martín <fmartinfdez@gmail.com>

  This code may only be used under the MIT style license found at
  https://ibmresearch.github.io/LICENSE.txt
*/

'use strict';

/* eslint-disable no-console */

const Promise = require('bluebird');
const dbg = require('debug')('slc-model-discover:index');
const writeFile = Promise.promisify(require('fs').writeFile);

const errMandatory = 'Mandatory option not found: ';


function getWriteSchema(model, datasource, dbName, outPath) {
  return new Promise((resolve, reject) => {
    if (!model.name || (model.type !== 'table')) {
      dbg('Doing nothing for model', model);

      resolve();
      return;
    }
    dbg(`Discover: ${model.name}`);

    // Not working, using the callback.
    // const discoverSch = Promise.promisify(datasource.discoverSchema);
    datasource.discoverSchema(model.name, { schema: dbName }, (error, schema) => {
      if (error) {
        console.log('Warning: Generating the table for this model:' +
                    ` ${model.name}, message: ${error.message}`);

        // We dont' want to break the full thing. The view also have type "table",
        // so it sometimes happens.
        resolve();
        return;
      }

      if (!schema) {
        reject(new Error('Schema not found'));
        return;
      }

      const outputName = `${outPath}/${schema.name}.json`;
      dbg(`Auto discovery success: ${schema.name}`);

      writeFile(outputName, JSON.stringify(schema, null, 2))
      .then(() => {
        resolve();
        dbg(`JSON saved to "${outputName}"`);
      })
      .catch(err => reject(new Error(`Wrinting to the file: ${err.message}`)));
    });
  });
}


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


    // Not working, so using the callback.
    // const discoverDefs = Promise.promisify(datasource.discoverModelDefinitions);
    datasource.discoverModelDefinitions({ schema: dbName }, (err, models) => {
      if (err) {
        reject(new Error(`Discovering definitions: ${err.message}`));

        return;
      }

      if (!models) {
        reject(new Error('Empty models'));

        return;
      }
      console.log('Models correctly discovered'); // eslint-disable-line no-console
      dbg('Discovered models', models);

      Promise.map(models, model => getWriteSchema(model, datasource, dbName, outPath))
      .then(() => {
        console.log('All task correctly finished');
        resolve();
      })
      .catch(err2 => reject(new Error(`Getting/writing the Schema: ${err2.message}`)));
    });
  });

/* eslint-enable no-console */
