/*
  Copyright (c) 2016 IBM Research Emergent Solutions
                     Jesús Pérez <jesusprubio@gmail.com>

  This code may only be used under the MIT style license found at
  https://ibmresearch.github.io/LICENSE.txt
*/

'use strict';

const path = require('path');

const program = require('commander');
let dbg = require('debug')('slc-model-discover:bin:index');

const version = require('../package').version;
const run = require('../');


program
  .version(version)
  .usage('[options] <dbName> <datasName>.\n\n' +
         '\t- dbName: The name of the database to inspect.\n' +
         '\t- datasName: The name of the datasource to use (the key used in ' +
         '"datasources.json" and equivalent files).')
  .option('-op, --outpath <s>', 'Path to drop the discovered models setup' +
          ' into. (default: ./server/models)')
  .option('-sp, --serverpath <s>', 'Path to the LoopBack app "server.js" ' +
          'file. (default: ./server/server.js)')
  .option('-v, --verbose', 'Print the debug lines. (default: false)')
  .parse(process.argv);


// Mandatory parameters.
if (program.args.length !== 2) {
  program.help();
  process.exit();
}
const dbName = program.args[0];
const datasName = program.args[1];

// Optional ones.
if (program.verbose) { dbg = console.log; } // eslint-disable-line no-console
dbg('Starting ..., program arguments', program.args);

const serverPath = program.serverpath || './server/server.js';
// eslint-disable-next-line import/no-dynamic-require
const app = require(path.resolve(serverPath));

let outPath = program.outpath || './server/models';
outPath = path.resolve(outPath);

const dataSource = app.dataSources[program.args[1]];

dbg('Running, opts:', dbName, outPath, datasName);

run(program.args[0], dataSource, outPath)
.then(() => { console.log('Models correctly discovered.'); }) // eslint-disable-line no-console
.catch((err) => {
  console.error(`Error: ${err.message}`); // eslint-disable-line no-console
  process.exit(1);
});
