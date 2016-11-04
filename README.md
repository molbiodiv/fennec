# Fennec Web
## About
Fennec - Functional Exploration of Natural Networks and Ecological Communities.
## Getting started
To get started with the development do the following:
### Install prerequisits
 - [composer](https://getcomposer.org/download/)
 - [node.js](https://nodejs.org/en/download/)
 - [bower](http://bower.io/#install-bower) (~npm install -g bower~)
 - [gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md) (~npm install -g gulp-cli~)
### Clone source code and initialize packages
```{bash}
git clone https://github.com/iimog/fennec-web
cd fennec-web
npm install
bower install
composer install
```
**Important: do not edit the js or css files in `web/assets` directly.
They are generated with `gulp scss` and `gulp babel` from `app/Resources/client`**

### Test, LINT, generate API, ...
Use gulp for all those things:
```{bash}
# phpunit testing
vendor/bin/phpunit

# javascript testing (of helpers)
gulp test

# check scss files for lints
gulp sassLint

# generate css files from scss
gulp sass
```
## Changes
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
   
