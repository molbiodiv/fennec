# Fennec
## About
FENNEC - Functional Exploration of Natural Networks and Ecological Communities.

The FENNEC is a tool that helps integrate trait data into ecological community analyses.
For that purpose traits are aggregated from various sources.
Those can then be mapped onto user provided community data.

## What are you looking for?
 - **I want to see FENNEC in action.** &rarr; [Public instance](https://fennec.molecular.eco)
 - **I want to learn how to use FENNEC.** &rarr; [User manual](https://fennec.readthedocs.io/en/latest/)
 - **I want to host my own instance of FENNEC.** &rarr; [Admin manual](https://fennec.readthedocs.io/en/latest/admin.html)
 - **I want to access FENNEC data via API.** &rarr; [API doc](https://fennec.molecular.eco/api/doc) 
 - **I want to improve/add features to FENNEC.** &rarr; [Read on](#setup-development-environment)
 - **I want to read/cite the preprint describing FENNEC.** &rarr; [![bioRxiv](https://img.shields.io/badge/DOI-10.1101%2F194308-blue.svg)](https://doi.org/10.1101/194308)
 - **I want to reference the source code of FENNEC.** &rarr; [![DOI](https://zenodo.org/badge/51136300.svg)](https://zenodo.org/badge/latestdoi/51136300) Please also cite our preprint.

## Setup development environment
So you want to contribute to the development of FENNEC - awesome!

### Local setup
As there are quite a few dependencies and setting everything up properly is highly dependent on the environment, we suggest using docker.
A local setup is not impossible but all current developers use the docker setup.
Therefore, we are best able to assist with that.
If you really need a local setup have a look at the dockerfile to see how things are installed there.
Also feel free to open issues with all the problems you encounter.

### Docker setup
You will clone the repository to your local computer and mount it in a fully functional FENNEC docker environment.
This way you can develop locally (using your IDE of choice), view your changes immediately in a realistic running system.
In addition you can transpile code and run the tests without installing additional dependencies.

#### Prerequisites:
 - [git](https://git-scm.com/)
 - [docker](https://www.docker.com/)
 - [docker compose](https://docs.docker.com/compose/)

#### Clone source code and initialize containers
```{bash}
git clone https://github.com/molbiodiv/fennec --recursive
cd fennec
# your UID is used to run processes in the docker container so files in your repo are not owned by root
export UID=$UID
docker-compose -f docker/fennec/docker-compose-dev.yml up -d
```
Congratulations! You are good to go.
Point your browser to [localhost:3141](http://localhost:3141).

#### Configuration

The default config files that were created with `init_dev.sh` should be ok to get started but you might want to update `app/config/parameters.yml` with:
 - github_client_id
 - github_client_secret
 - ga_tracking
 - secret

The first two are required for "Login with GitHub", see [this guide](https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/) for details.
The third one is your []Google Analytics tracking ID](https://support.google.com/analytics/answer/1008080?hl=en), with an empty ID, Google Analytics will be disabled.
The secret should be replaced with a random string as [documented by symfony](https://symfony.com/doc/3.4/reference/configuration/framework.html#secret).

If you need to modify the docker-compose file (e.g. hard code your user id for better integration into your IDE, or for changing the db volume locations) you can do this:
```
cp docker/fennec/docker-compose-dev.yml docker/fennec/docker-compose-dev.local.yml
```
This file is not under version control so you can modify it as you like and use this file after the `-f` parameter for all of the `docker-compose` commands.

#### Source code
##### php
The structure of the project is that of a default symfony 3 application.
Changes to the php code should be served immediately on [localhost:3141](http://localhost:3141) as we are using the development server.
If you need additional composer packages you can install them with
```
docker-compose -f ~/projects/fennec/docker/fennec/docker-compose-dev.local.yml exec web bash -c "cd /fennec-dev;COMPOSER_CACHE_DIR=/tmp composer require -n foo/bar:1.0.0"
```

##### javascript and css
The js(x) and (s)css code is located in `app/Resources/client`.
**Important: do not edit the js or css files in `web/assets` directly.**
They are generated with the following command (assuming your working directory is the fennec repo):
```
docker-compose -f docker/fennec/docker-compose-dev.yml exec web /fennec-dev/node_modules/.bin/encore dev
```
If you need additional npm packages you can install them with
```
docker-compose -f ~/projects/fennec/docker/fennec/docker-compose-dev.local.yml exec web bash -c "cd /fennec-dev;HOME=/tmp yarn add --non-interactive package@1.0.0"
```

##### phinch
Beware that [phinch](https://github.com/PitchInteractiveInc/Phinch) is included as a git submodule so changes there should not be FENNEC specific.
However, if you change the `.coffee` files or checkout another version via git re-generate the js files with:
```
docker-compose -f ~/projects/fennec/docker/fennec/docker-compose-dev.yml exec web coffee -o /fennec-dev/web/assets/Phinch/scripts /fennec-dev/web/assets/Phinch/src
```

#### Tests
##### php
In order to run the php tests do this:
```
docker-compose -f ~/projects/fennec/docker/fennec/docker-compose-dev.yml exec web /fennec-dev/vendor/bin/simple-phpunit -c /fennec-dev/phpunit.xml.dist
```
This completely removes and re-creates the test database (this can take some time).

##### javascript
Currently, only the javascript helper files are unit tested.
To run the tests execute this command:
```
docker-compose -f ~/projects/fennec/docker/fennec/docker-compose-dev.local.yml exec web yarn --cwd /fennec-dev test
```

#### Documentation
If you want to contribute documentation you can do so by modifying the content of the `.rst` files in the `doc` directory.
In case you want to check how the converted html files look you can build with.
```
docker-compose -f ~/projects/fennec/docker/fennec/docker-compose-dev.local.yml exec web bash -c "cd /fennec-dev/doc; make html"
```
Then open the (local) html file `doc/_build/html/index.html` in your favorite browser.
As documentation is hosted at [readthedocs](https://readthedocs.org/) those files are not served by FENNEC.

The api doc on the other hand is dynamically created from the php annotations in `src/AppBundle/Controller/APIController.php`.
Those are served from [localhost:3141/api/doc](http://localhost:3141/api/doc).

## Changes
### Next Release
 - Add user management (FOSUserBundle)
 - Add sharing capability for projects
 - Add permission management for projects (view/edit)
 - Add admin interface for user management
 - Improve data import documentation
 - Improve auto-generated API documentation (NelmioApiDocBundle)
 - Improve development setup via docker-compose
 - Improve basic documentation (README)
### 0.9.0 <2017-11-03>
 - Add cron capability to docker (#101)
 - Add option to use google analytics
 - Breaking changes: docker container has to be pulled, `ga_tracking` has to be added to `parameters.yml` (can be empty)
### 0.8.4 <2017-09-27>
 - Add API documentation
 - Add cors header to make API accessible (#109)
 - Make content wrapper expand automatically (#99)
 - Fix dropdown on project details page (#98)
 - Add scientific name to trait citation export (#97)
### 0.8.3 <2017-08-23>
 - Fix bug (add sample trait to project from table via +)
 - Add documentation for [SCALES bee traits](http://scales.ckff.si/scaletool/?menu=6&submenu=3) 
### 0.8.2 <2017-08-21>
 - Fix dialog problem on project details page
### 0.8.1 <2017-08-21>
 - Fix dropdown problem on project details page
### 0.8.0 <2017-08-09>
 - Add interactive metadata tables
 - Add scientific name to fennec metadata in projects (breaking change: projects from versions <0.8 need to be re-mapped)
 - Upgrade to Symfony 3.3 (from 3.1)
 - Replace bower and gulp with yarn and webpack
### 0.7.2 <2017-06-30>
 - Add attribution to text blocks on organism pages (#84)
 - Add boxes for texts on organism pages
 - Improve admin documentation
### 0.7.1 <2017-06-29>
 - Add Phinch to docker image (#90)
 - Add EPPO trait to docu
### 0.7.0 <2017-06-28>
 - Add php importers for organisms (#79)
 - Improve performance of trait importer
 - Clean up design of organism search (#76)
 - Make docker container ready to use (#66)
 - Improve tutorial (#67)
### 0.6.2 <2017-05-29>
 - Add long table import (#70)
 - Add local demo user
 - Add Quick Start documentation
 - Add basic admin documentation
### 0.6.1 <2017-05-05>
 - Improve design of project details (tabs)
 - Add trait table for samples (#72)
 - Add better handling of traits via table
 - Add capability to remove traits from project (#71)
 - Add unit for numerical traits to frontend (#73)
 - Fix github login timeout (#69)
### 0.6.0 <2017-04-10>
 - Add metadata overview to projects
 - Add possibility to upload metadata tsv files
 - Generalize mapping to fennec ids
 - Add contact page
### 0.5.1 <2017-04-04>
 - Add numerical trait format
 - Add trait citations to frontend
 - Allow upload of OTU tables as projects
### 0.5.0 <2017-03-10>
 - Update color scheme
 - Improve startpage layout
 - Initialize documentation
 - Fix bugs
 - Improve mapping to fennec ids
 - Add cli trait importer
 - Add console commands for db interaction
 - Use ORM for database connection
### 0.4.1 <2017-01-05>
 - Handle deleted traits properly
 - Add two versions of IUCN to test set
 - Replace Blackbird with patched Phinch
 - Add user selected trait to project (biom)
 - Merge multiple trait values for one organism
### 0.4.0 <2016-11-22>
 - Rename organism_id to fennec_id
 - Update webservices for db schema 0.4.0
 - Fix frontend for new data schema
 - Fix bugs (related to biom json export)
### 0.3.2 <2016-11-04>
 - Add organism_id mapping to project details page
 - Export project as biom (v1)
 - Download mapping results as csv
 - Mapping to organism_id by species name
 - Make project ID and comment editable
 - Improve project details page
 - Use pre-compilation of jsx files with babel
 - Re-write message system (using React)
### 0.3.1 <2016-10-20 Th>
 - Add exception handling to API
 - Add generalized WebserviceTestCase
 - Add fennec icon-font
 - Fix project overview table delete bug (#30)
### 0.3.0 <2016-10-17 Mo>
 - Use Symfony framework (symfony.com)
### 0.2.0 <2016-10-10 Mo>
 - Update navigation
 - Add trait details to projects
 - Update database schema for specific trait types
 - Add webservice to convert ncbi_taxids to organism_ids
 - Add trait overview table to projects
 - Update color scheme (fix scss)
### 0.1.5 <2016-06-01 Mi>
 - Integrate a phinch fork for inspection of projects
 - Add OTU table to project page
 - Add central dialog method
 - Add biom2 to biom1 conversion capability on the server
 - Add filename of imported file to project table
 - Add "remove project" capability
 - Remove communities from web interface
### 0.1.4 <2016-05-20 Fr>
 - Add proper redirects on login and logout
 - Add project upload capability
 - Add project overview table
### 0.1.3 <2016-04-29 Fr>
 - Add login with GitHub
### 0.1.2 <2016-04-28 Do>
 - Add gulp as build system
 - Add style-checks (phpcs, sassLint, jshint)
 - Add docu generation (apigen, jsdoc)
 - Add unit tests (phpunit, jasmine)
 - Add performance test (artillery)
 - Add ui test (selenium)
 - Add contribution guidelines
### 0.1.1 <2016-04-08 Fr>
 - Fix redirect on startpage
### 0.1.0 <2016-04-08 Fr>
 - add version picker
 - add support for multiple db versions
 - add project page design
 - add community page design
 - clean pages
 - add new level to interactive browse
 - add apigen documentation for webservices
### 0.0.5 <2016-03-23 Mi>
 - display all traits of an organism
 - add progress bar on organism page
 - display preffered name from eol on organism page
 - setup javascript testing
### 0.0.4 <2016-03-21 Mo>
 - add plotly graphs
 - add trait webservice for displaying trait information
 - display eol organism info (via API)
 - add db test fixtures
### 0.0.3 <2016-03-11 Fr>
 - add dynamic organism view
 - create layout for trait overview page
 - create layout for trait search page
 - add autocompletion for trait search form
### 0.0.2 <2016-02-26 Fr>
 - create layout for organism details
 - add autocompletion for organism search form
 - present organisms from database
 - add organism listing webservice
 - define general layout
 - setup general framework
### 0.0.1 <2016-02-15 Mo>
 - Initial release
   
