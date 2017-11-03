#!/bin/bash

set -o nounset
set -o errexit

FENNEC_PATH=/fennec

VERSION=$1
YEAR=${VERSION:0:4}

# create input table
perl -F"\t" -ane 'chomp $F[11]; print "$F[7]\t$F[11]\t\t\t\n";' IUCN-${VERSION}.tsv >/tmp/iucn.tsv

# get iucn webuser id (create if not exists)
WEBUSER_ID=$($FENNEC_PATH/bin/console app:create-webuser IUCN | tail -n1 | cut -f4 -d" ")

# create trait type (if not exists)
$FENNEC_PATH/bin/console app:create-traittype --format categorical_free --description "The IUCN Red List of Threatened Species" --ontology_url "http://www.iucnredlist.org" "IUCN Red List"

# invalidate old iucn traits
$FENNEC_PATH/bin/console app:expire-trait-entries --traittype "IUCN Red List"

# import trait table
$FENNEC_PATH/bin/console app:import-trait-entries --user-id $WEBUSER_ID --default-citation "IUCN ${YEAR}. IUCN Red List of Threatened Species. Version $VERSION <www.iucnredlist.org>" --traittype "IUCN Red List" --mapping scientific_name --skip-unmapped /tmp/iucn.tsv
