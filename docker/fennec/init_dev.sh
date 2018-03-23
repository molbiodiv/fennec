#!/bin/bash
set -e

if [[ -e .docker.initialized ]]
then
  exit 0
fi

export HOME=/tmp
COMPOSER_CACHE_DIR=/tmp
cd /fennec-dev
composer -n install
yarn --non-interactive install
./node_modules/.bin/encore dev
cd web/assets/Phinch
coffee -o scripts src
cd /fennec-dev
bin/console doctrine:schema:update --em userdb --force
bin/console doctrine:schema:update --em default_data --force

while getopts 'd' OPTION ; do
  case "$OPTION" in
    d)   echo "Populating database with test data";xzcat /fennec-dev/tests/initial_testdata.sql.xz | PGPASSWORD=fennec_data psql -h datadb -U fennec_data -d fennec_data;;
    *)   echo "Unknown parameter"
  esac
done

touch .docker.initialized
