# API for filter data

A simple server for filtering data.

## Example 

current api is avalible at http://codingchallenge.ap-southeast-2.elasticbeanstalk.com/ 

Please find examples in the test folder.

## Install

Download or clone first

`git clone git@github.com:Donnzh/api-filter-data.git`

### Set up NodeJs

Using nvm to set up NodeJs on Linux or Mac
[`nvm`](https://github.com/creationix/nvm)

```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.1/install.sh | bash
nvm install v7.5.0
nvm use 7
npm install -g nodemon # for localhost debug only
```

to check the version numbers of `node`, `npm`

```bash
$ npm --version
4.1.2
$ node --version
v7.5.0
```

### Set up project
In the project directory,
typing the following commands.

```bash
npm install
```

## Run project

For run, test, or postman test, please use the following commands.

Note: the project manage environments through [`erun`](https://github.com/bguiz/erun), a library which export different `NODE_ENV` and configurations by using different environment variables. Different environments are configurable under `/config` .

Local (`NODE_ENV = localhost`):

```bash
npm run erun -- start localhost
npm run erun -- dev localhost
npm run erun -- debug localhost
npm run erun -- test localhost
```
Please note that `dev` and `debug` make use of a global `nodemon` installation.

```
npm install --global nodemon
```

Development (`NODE_ENV = dev`):

```bash
npm run erun -- start dev
npm run erun -- test dev
```

- Test report can be found in the `reports/` folder. Look in `reports/test/${NODE_ENV}` for the test results



Production (`NODE_ENV = production`):

- Please using external tools (e.g. postman) for production testing and monitoring.

```bash
npm run erun -- start production

```




## Documentation

To generate documentation for the project, use the following commands.

```
npm run generate-docs
```

- The api documents will be found in the `docs/server/` folder.
