# Loopback model discovery

[![Continuos integration status](https://travis-ci.org/IBMResearch/slc-model-discover.svg)](https://travis-ci.org/IBMResearch/slc-model-discover)
[![NSP Status](https://nodesecurity.io/orgs/ibmresearch/projects/e12d6c60-9c19-42e2-913b-0f670cf692bb/badge)](https://nodesecurity.io/orgs/ibmresearch/projects/e12d6c60-9c19-42e2-913b-0f670cf692bb)

Client to discover LoopBack models from SQL databases.


## Install

- Install the last Node.js stable version.
 - https://nodejs.org/download
 - A better alternative for developers is to use [nvm](https://github.com/creationix/nvm), to test different versions.

- Get a copy of the code and install Node dependencies.
```sh
npm i -g slc-model-discover
```


## Use
```
Usage: index [options] <dbName> <datasName>.

- dbName: The name of the database to inspect.
- datasName: The name of the datasource to use (the key used in "datasources.json" and equivalent files).

Options:

  -h, --help             output usage information
  -V, --version          output the version number
  -op, --outpath <s>     Path to drop the discovered models setup into. (default: ./server/models)
  -sp, --serverpath <s>  Path to the LoopBack app "server.js" file. (default: ./server/server.js)
  -v, --verbose          Print the debug lines. (default: false)
```

Examples:
```sh
slc-model-discover --help
slc-model-discover petsapp cloudant_db
slc-model-discover -h 79.22.156.34 -p 8888 --c postgresql petsapp cloudant_db
slc-model-discover --host 79.22.156.34 --port 8888 --connector postgresql petsapp cloudant_db
slc-model-discover --outpath ./common/models --port 8888 --connector postgresql petsapp cloudant_db
```


## Developer guide

Please check [this link](https://github.com/IBMResearch/backend-development-guide) before a contribution.
