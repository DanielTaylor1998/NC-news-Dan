# Northcoders News API

## Summary

This is an API for accessing a database containing articles,user, and comments. Its purpose is to mimic the backend of a web feed or news/social media website




## Kanban

### Link to your Trello Board here: https://trello.com/b/WuP0vxAh/nc-news-dan

## Hosted App

## Link to hosted app: https://dtaylor-nc-news.herokuapp.com/

You can access link directly through a web browser; however that has many limitations on its usage. it is currently best utilised through an API platfrom such as Postman/Insomina or Hopscotch.io

## How to setup a local install

### Clone Repository (Repo)

The github page is located [here](https://github.com/DanielTaylor1998/NC-news-Dan) 

Alternatively you can download a ZIP file containing all the contents of the Repo.

### Git Clone

Initially you will need to have GIT installed so that you can run the terminal commads. ==> [Guide To Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

Once you have setup git, open your terminal, navigate to your preferered directory in which you intend to download repo to, and then enter the command: 

```
git clone https://github.com/DanielTaylor1998/NC-news-Dan.git
```

if you wish to expand on the functionality of this API, it is best that you fork the repo to your own github account, as I do not intend to allow any pushes from any one who is not a collaborator.

### Install NPM

To correctly run this application you will need Node Package Manager to do so run open the directory (in your terminal!) in which you have cloned/forked the repo and run the command `npm install`. You will also Node version 16.15.1, to do so run the command `node -v` to check your version and if you have nvm (node version manager, higly recommend !) installed run `nvm use 16`, [NPM docs](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) have guide to getting started with both npm and installing Node.

### PostgreSQL

The database are run on PSQL (PostgreSQL) which must be installed to host the database locally, to do so simply donwload the correct installer from [here] (https://www.postgresql.org/download/) and follow this guide to [getting started](https://www.postgresql.org/docs/current/tutorial-start.html). This application was created using PSQL(12.11) to simply check run these commands.

```
psql
SELECT version();
```

You may recieve an ERROR: Cannot connect to database/server this happens because you have started PSQL service to do so run the command `sudo service postgresql start`

### Hosting the database locally (optional)

Although not required to run the application; if for any reason you wish to query the database manually, then you will need to host the databases locally. I have created scripts in the package.json to quickly do this:

to create the databases: 

```
npm run setup-dbs
```

to seed the databases: 

```
npm run seed
```

### Testing

Once you have hosted the databases locally, you may want to run the test suite, to check for errors. The test suite should automatically seed the database if not follow the above [guide](https://github.com/DanielTaylor1998/NC-news-Dan#testing).

The test suite has been written in jest using jest-sorted and can filtered by adding .only to any test/describe block. To run all tests simply run `npm test`

### Husky

This application is using husky to install git hooks. This prevents any commits or pushes if the test suite fails

You may wish to remove this so you can run `npm uninstall husky && git config --unset core.hooksPath` which should remove the hooks and husky

### DOTENV

This application is using dotenv packages to set local enviroment variables automatically.

you will need to add both a .env.test and .env.development to your project so that you can connect to each local database correctly when running the test suite.
