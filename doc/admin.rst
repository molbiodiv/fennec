.. admin:
.. _admin:

Admin manual
============

This section of the manual describes the process of setting up your own instance of Fennec.
It explains how to configure it and how to load data to the database.
If you are looking for a manual on how to use an existing Fennec instance please refer to :ref:`user`.
If you want to extend or enhance Fennec have a look at the README in the repository.

Docker setup
------------

Install docker according to the `documentation <https://docs.docker.com/engine/installation/>`_.
Fennec consists of the web server running apache and php and at least one database.
For the web server part a specific ``fennec`` container is available, for the database a generic ``postgres`` container is sufficient.

Now run the following commands::

    docker pull iimog/fennec
    docker pull postgres:9.6
    docker run -d -e POSTGRES_USER=fennec -e POSTGRES_PASSWORD=fennec -e POSTGRES_DB=fennec --name fennec_db postgres:9.6
    docker run -d -p 8889:80 --link fennec_db:db --name fennec_web iimog/fennec
    docker exec -it fennec_web php /fennec/bin/console doctrine:schema:create

The web server is now running on http://localhost:8889 .
However, Fennec does not contain any data, yet.

.. NOTE::

    When commands should be executed 'inside the docker container', that means that you should enter the ``fennec_web`` container via::

        docker exec -it fennec_web /bin/bash

Loading organisms
-----------------

.. ATTENTION::

    The import of organism data (scientific names, identifiers, synonyms, taxonomy) will be substantially changed (and improved) in the next major release.
    For now the steps below are required.

NCBI Taxonomy
^^^^^^^^^^^^^

We will demonstrate loading organisms into the database using `NCBI Taxonomy <https://www.ncbi.nlm.nih.gov/taxonomy>`_.
Inside the docker container execute the following commands::

    cd /tmp
    curl ftp://ftp.ncbi.nih.gov/pub/taxonomy/taxdump.tar.gz >taxdump.tar.gz
    tar xzvf taxdump.tar.gz
    grep "scientific name" names.dmp | perl -F"\t" -ane 'print "$F[2]\t$F[0]\t\n"' >ncbi_organisms.tsv
    # We still need some legacy cli tools (will be replaced by php commands in the future)
    /fennec/web/miniconda.sh -b -f -p /usr/local
    git clone https://github.com/molbiodiv/fennec-cli
    conda install --yes --file fennec-cli/requirements.txt
    python fennec-cli/bin/import_organism_db.py --db-host db --provider ncbi_taxonomy --description "NCBI Taxonomy" /tmp/ncbi_organisms.tsv

The last step will take a couple of minutes but after that more than 1.6 million organisms will be stored in the database with their scientific name and NCBI taxid.
In order to add synonyms and taxonomic relationships follow those steps::

    # Create a fennec_id to ncbi_taxid map (will be obsolete in the future)
    PGPASSWORD=fennec psql -F $'\t' -At -h db -U fennec -c "SELECT fennec_id,identifier as  ncbi_taxid FROM fennec_dbxref, db WHERE fennec_dbxref.db_id=db.db_id AND db.name='ncbi_taxonomy'" >fennec2ncbi.tsv
    perl -F"\t" -ane 'BEGIN{open IN, "<fennec2ncbi.tsv";while(<IN>){chomp;($f,$n)=split(/\t/);$n2f{$n}=$f}} print "$n2f{$F[0]}\t$F[2]\t$F[6]\n" if($F[6] eq "synonym")' names.dmp >ncbi_synonyms.tsv
    python fennec-cli/bin/import_organism_names.py --db-host db ncbi_synonyms.tsv
    perl -F"\t" -ane 'BEGIN{open IN, "<fennec2ncbi.tsv";while(<IN>){chomp;($f,$n)=split(/\t/);$n2f{$n}=$f}} print "$n2f{$F[0]}\t$n2f{$F[2]}\t$F[4]\n"' nodes.dmp >ncbi_taxonomy.tsv
    apt update
    apt install libdbd-pg-perl
    apt install liblog-log4perl-perl
    perl fennec-cli/bin/import_taxonomy.pl --input ncbi_taxonomy.tsv --provider ncbi_taxonomy --db-host db

Again the last step will take some minutes and needs a few GB of memory.

EOL
^^^

The Encyclopedia of Life is a great resource for organism information.
Because of the nice API organism pages in Fennec are dynamically created from EOL content.
In order to link organisms to EOL we need to add EOL page IDs.
For this purpose download `the hierarchy entries file <http://opendata.eol.org/dataset/da9635ec-71b6-4fb2-a4cb-518f71eeb45d/resource/dd1d5160-b56a-4541-ac88-494bc03b4bc8/download/hierarchyentries.tgz>`_
and add it to the docker container via ``docker cp hierarchyentries.tgz fennec_web:/tmp``::

    cd /tmp
    tar xzf hierarchyentries.tgz
    perl -F"\t" -ane 'print "$F[1]\t$F[4]\n" if($F[2] == 1172)' hierarchy_entries.tsv | perl -pe 's/"//g' | sort -u >eol2ncbi.tsv
    # Now we create a file with three columns: 1) empty 2) eol_id 3) fennec_id
    perl -F"\t" -ane 'BEGIN{open IN, "<fennec2ncbi.tsv";while(<IN>){chomp;($f,$n)=split(/\t/);$n2f{$n}=$f}} chomp $F[1]; print "\t$F[0]\t$n2f{$F[1]}\n" if(exists $n2f{$F[0]})' eol2ncbi.tsv | sort -u -k1,1 | sort -u -k2,2 >eol_ids.tsv
    python fennec-cli/bin/import_organism_db.py --db-host db --provider EOL --description "Encyclopedia of Life" eol_ids.tsv

Now you have 1.6 million organisms in the database of which roughly 170 thousand have a nice organism page provided by EOL.
