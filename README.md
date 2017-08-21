# Fennec Web
## About
Fennec - Functional Exploration of Natural Networks and Ecological Communities.
[![DOI](https://zenodo.org/badge/51136300.svg)](https://zenodo.org/badge/latestdoi/51136300)
## Getting started
To get started with the development do the following:
### Install prerequisits
 - [composer](https://getcomposer.org/download/)
 - [node.js](https://nodejs.org/en/download/)
 - [yarn](https://yarnpkg.com/en/)
### Clone source code and initialize packages
```{bash}
git clone https://github.com/molbiodiv/fennec
cd fennec
yarn install
composer install
```
**Important: do not edit the js or css files in `web/assets` directly.
They are generated with `./node_modules/.bin/encore` from `app/Resources/client`**

### Docker setup for development
For development it is advisable to set up three docker containers:
1. A fennec container to serve the development version (include the repo as a volume)
2. A database container with data for interactive testing
3. A database container to run the unit tests

```{bash}
docker pull iimog/fennec
docker pull postgres:9.6
docker run -d -e POSTGRES_USER=fennec -e POSTGRES_PASSWORD=fennec -e POSTGRES_DB=fennec --name fennec_db postgres:9.6
docker run -d -e POSTGRES_USER=fennectest -e POSTGRES_PASSWORD=fennectest -e POSTGRES_DB=fennectest --name fennec_db_test postgres:9.6
# Run from inside your fennec repository
# publish the port where our php dev server will run (8000) instead of the apache (80)
docker run -d -v $PWD:/fennec-dev -p 3141:8000 --link fennec_db:db --link fennec_db_test:testdb --name fennec iimog/fennec

# Optionally init the database with pre-existing data (fennec.sql.xz), replace 172.17.0.2 with the ip of the database container as determined by "docker inspect fennec_db"
xzcat /tmp/fennec.sql.xz | psql -U fennec -h 172.17.0.2 -p 5432 -d fennec
# Alternatively just init an empty db with the fennec schema
#docker exec -it fennec php /fennec-dev/bin/console doctrine:schema:create

# Modify parameters.yml and parameters_test.yml in app/config
# You can use 'fennec_db' as hostname in parameters.yml
# If you want to run the phpunit test on your development machine you have to insert the ip address of the fennec_db_test in parameters_test.yml

# Run the development server
docker exec fennec php /fennec-dev/bin/console server:run 0.0.0.0:8000
```

Now you can point your browser to [http://localhost:3141]().

### Test, LINT, generate API, ...
Use gulp for all those things:
```{bash}
# phpunit testing
vendor/bin/simple-phpunit

# javascript testing (of helpers)
npm test

# transpile jsx to js and scss to css
./node_modules/.bin/encore dev # or production
# or
# ./node_modules/.bin/encore production
```

Anything else should be in the [official documentation](http://fennec.readthedocs.io/en/latest/).

## Changes
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
   
