#!/bin/bash

set -o nounset
set -o errexit

VERSION=$(curl -sS "apiv3.iucnredlist.org/api/v3/version" | jq --raw-output '.version')
OUT_FILE=IUCN-${VERSION}.json

if [ -e $OUT_FILE ]
then
    echo "IUCN file for version $VERSION exists: $OUT_FILE ... nothing to do"
    exit 0
fi

`dirname $0`/download_iucn_api.sh $VERSION $OUT_FILE
`dirname $0`/update_iucn_traits.sh $VERSION
