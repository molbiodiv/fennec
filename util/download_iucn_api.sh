#!/bin/bash

set -o nounset
set -o errexit

if [ -e .iucn_token ]
then
    TOKEN=$(<.iucn_token)
else
    echo "No IUCN API token found. Store it in .iucn_token"
    exit 1
fi

VERSION=$1
OUT_FILE=$2

GET_NEXT=true
PAGE="0"
TMP_PREFIX="/tmp/IUCN-${VERSION}-page-"

while [ "$GET_NEXT" = true ]
do
    echo "Downloading version $VERSION page $PAGE"
    TMP_FILE="${TMP_PREFIX}${PAGE}.json"
    curl "apiv3.iucnredlist.org/api/v3/species/page/${PAGE}?token=${TOKEN}" >$TMP_FILE
    PAGE=$((PAGE + 1))
    COUNT=$(jq '.count' ${TMP_FILE})
    if (( COUNT < 1 ))
    then
        GET_NEXT=false
    fi
done

cat ${TMP_PREFIX}*.json | jq '.result[]' >$OUT_FILE
echo "IUCN file for version $VERSION created: $OUT_FILE ... done"

jq -r '(.taxonid | tostring)+"\t"+.kingdom_name+"\t"+.phylum_name+"\t"+.class_name+"\t"+.order_name+"\t"+.family_name+"\t"+.genus_name+"\t"+.scientific_name+"\t"+.infra_rank+"\t"+.infra_name+"\t"+.population+"\t"+.category' $OUT_FILE | sort -u >IUCN-${VERSION}.tsv

