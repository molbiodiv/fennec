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

Configuration
-------------

Login with GitHub
^^^^^^^^^^^^^^^^^

1. Register an OAuth App with your account following [this guide](https://developer.github.com/apps/building-integrations/setting-up-and-registering-oauth-apps/)
2. As "Authorization callback URL" enter your domain or ip address with ``/login`` appended
3. Modify ``/fennec/app/config/parameters.yml`` and add the respective values to ``github_client_id`` and ``github_client_secret``

That's it. Login with GitHub should now work.

Login with Google
^^^^^^^^^^^^^^^^^

1. Register an OAuth App with your account following [this guide](https://support.google.com/googleapi/answer/6158849?hl=en&ref_topic=7013279)
2. If you want to set a redirect URI use your domain with path ``/login/check-google`` appended
3. Modify ``/fennec/app/config/parameters.yml`` and add the respective values to ``google_client_id`` and ``google_client_secret``

That's it. Login with Google should now work.

Demo User
^^^^^^^^^

A single demo user can be configured via ``demo_user_name`` and ``demo_user_password`` in ``/fennec/app/config/parameters.yml``.
Be aware that this is a single user and everyone using those credentials will share the data.
Therefore it is possible for everyone to add, modify and delete projects.
We intend to improve user handling in the future (including demo users) until then feel free to use the demo user as needed.

Contact Page
^^^^^^^^^^^^

A dummy contact page is present but has to be replaced by one showing the real content.
In order to do this create a file called ``custom_contact.html.twig``.
You can put content like this for example::

    <div class="row">
        <h1>Contact</h1>
        This instance is maintained by <a href="mailto:mail@example.com">John Doe</a>.
        The source code is available on <a href="https://github.com/molbiodiv/fennec">GitHub</a>.
    </div>

Next this file needs to be transferred to the docker container::

    docker cp custom_contact.html.twig fennec_web:/fennec/app/Resources/views/misc/

Please be aware that a proper contact page might be a legal requirement if you run a public instance.

Loading organisms
-----------------

NCBI Taxonomy
^^^^^^^^^^^^^

We will demonstrate loading organisms into the database using `NCBI Taxonomy <https://www.ncbi.nlm.nih.gov/taxonomy>`_.
Inside the docker container execute the following commands::

    cd /tmp
    curl ftp://ftp.ncbi.nih.gov/pub/taxonomy/taxdump.tar.gz >taxdump.tar.gz
    tar xzvf taxdump.tar.gz
    grep "scientific name" names.dmp | perl -F"\t" -ane 'print "$F[2]\t$F[0]\n"' >ncbi_organisms.tsv
    /fennec/bin/console app:import-organism-db --provider ncbi_taxonomy --description "NCBI Taxonomy" /tmp/ncbi_organisms.tsv

The last step will take a couple of minutes but after that more than 1.6 million organisms will be stored in the database with their scientific name and NCBI taxid.

.. ATTENTION::

    The taxonomy is currently only used to display it on the organism page.
    There are possible future applications like automatic trait imputation based on taxonomy.
    However, none of them are implemented, yet.
    Therefore, you might consider not importing taxonomic information, especially as the import is quite cumbersome.
    If taxonomic information is used more in FENNEC the import process will be improved as well.
    For now the steps below are required.

In order to add taxonomic relationships follow those steps::

    # Create a fennec_id to ncbi_taxid map (will be obsolete in the future)
    PGPASSWORD=fennec psql -F $'\t' -At -h db -U fennec -c "SELECT fennec_id,identifier as  ncbi_taxid FROM fennec_dbxref, db WHERE fennec_dbxref.db_id=db.db_id AND db.name='ncbi_taxonomy'" >fennec2ncbi.tsv
    # Synonyms are currently not used at all
    # perl -F"\t" -ane 'BEGIN{open IN, "<fennec2ncbi.tsv";while(<IN>){chomp;($f,$n)=split(/\t/);$n2f{$n}=$f}} print "$n2f{$F[0]}\t$F[2]\t$F[6]\n" if($F[6] eq "synonym")' names.dmp >ncbi_synonyms.tsv
    # python fennec-cli/bin/import_organism_names.py --db-host db ncbi_synonyms.tsv
    perl -F"\t" -ane 'BEGIN{open IN, "<fennec2ncbi.tsv";while(<IN>){chomp;($f,$n)=split(/\t/);$n2f{$n}=$f}} print "$n2f{$F[0]}\t$n2f{$F[2]}\t$F[4]\n"' nodes.dmp >ncbi_taxonomy.tsv
    git clone https://github.com/molbiodiv/fennec-cli
    PGPASSWORD=fennec perl fennec-cli/bin/import_taxonomy.pl --input ncbi_taxonomy.tsv --provider ncbi_taxonomy --db-host db

Again the last step will take some minutes (even after printing "Script finished") and needs a few GB of memory.

EOL
^^^

The Encyclopedia of Life is a great resource for organism information.
Because of the nice API organism pages in Fennec are dynamically created from EOL content.
In order to link organisms to EOL we need to add EOL page IDs.
For this purpose download `the hierarchy entries file <http://opendata.eol.org/dataset/da9635ec-71b6-4fb2-a4cb-518f71eeb45d/resource/dd1d5160-b56a-4541-ac88-494bc03b4bc8/download/hierarchyentries.tgz>`_
and add it to the docker container via ``docker cp hierarchyentries.tgz fennec_web:/tmp``
(direct download via ``curl`` or ``wget`` produced errors in the past)::

    cd /tmp
    tar xzf hierarchyentries.tgz
    # Now we create a file with two columns: 1) ncbi_taxid 2) eol_id
    perl -F"\t" -ane 'print "$F[4]\t$F[1]\n" if($F[2] == 1172)' hierarchy_entries.tsv | perl -pe 's/"//g' | sort -u >ncbi2eol.tsv
    /fennec/bin/console app:import-organism-ids --provider EOL --description "Encyclopedia of Life" --mapping ncbi_taxonomy --skip-unmapped ncbi2eol.tsv

Now you have 1.6 million organisms in the database of which roughly 170 thousand have a nice organism page provided by EOL.

Loading traits
--------------

Initialize trait formats
^^^^^^^^^^^^^^^^^^^^^^^^

In the docker container execute::

    /fennec/bin/console app:create-traitformat categorical_free
    /fennec/bin/console app:create-traitformat numerical

Plant Growth Habit
^^^^^^^^^^^^^^^^^^

As a first example we want to load growth habit data for plants from eol.
First download the `file from opendata.eol.org <http://opendata.eol.org/dataset/3cd2c5c3-67c8-496c-a838-98c99cfaadc3/resource/5ed0d6d3-4261-4c1b-a5cb-9c2e985a9989/download/growth-habit.txt.gz>`_.
After copying the file to the docker container via ``docker cp growth-habit.txt.gz fennec_web:/tmp``::

    gunzip growth-habit.txt.gz
    # We want to have a tsv with the following columns: eol_id, value, value_ontology, citation, origin_url
    # And citation consists of the columns "Supplier(12),Citation(15),Reference(29),Source(14)"
    perl -F"\t" -ane 'print "$F[0]\t$F[4]\t$F[6]\tSupplier:$F[12];Citation:$F[15];Reference:$F[29];Source:$F[14]\t$F[13]\n" unless(/^EOL page ID/)' growth-habit.txt >growth-habit.tsv
    /fennec/bin/console app:create-webuser EOL # Note user-id for later commands
    /fennec/bin/console app:create-traittype --format categorical_free --description "general growth form, including size and branching. Some organisms have different growth habits depending on environment or location" --ontology_url "http://www.eol.org/data_glossary#http___eol_org_schema_terms_PlantHabit" "Plant Growth Habit"
    /fennec/bin/console app:import-trait-entries --traittype "Plant Growth Habit" --user-id 1 --mapping EOL --skip-unmapped --public --default-citation "Data supplied by Encyclopedia of Life via http://opendata.eol.org/ under CC-BY" growth-habit.tsv

More than 1 million of the entries are imported into the database.
For the other EOL ids there is no organism in the database, therefore those are skipped (because of the ``--skip-unmapped`` parameter, otherwise the importer would fail).

An important thing to note is that we are preparing the trait table by rearranging columns using ``perl``.
However, you could just as well use ``Excel`` or any other tool to do this.
The only requirement is that you end up with a tab delimited file with five columns:

1. organism identifier (either fennec_id or something that can be mapped)
2. trait value
3. value ontology url (can be empty)
4. citation (can be empty or set via default citation, if multiple sources have to be cited they have to be concatenated)
5. origin url (can be empty, a link to the original source)

Life Cycle Habit
^^^^^^^^^^^^^^^^

Next we can repeat these steps for the "Life Cycle Habit" trait:
Again there is a file at opendata.eol.org::

    curl http://opendata.eol.org/dataset/fedb8890-f943-4907-a36f-c7df4770a076/resource/e4eced0b-70f4-497f-9aa6-b1fd1212cfd9/download/life-cycle-habit.txt.gz | zcat >life-cycle-habit.txt
    perl -F"\t" -ane 'print "$F[0]\t$F[4]\t$F[6]\tSupplier:$F[12];Citation:$F[15];Reference:$F[29];Source:$F[14]\t$F[13]\n" unless(/^EOL page ID/)' life-cycle-habit.txt >life-cycle-habit.tsv
    /fennec/bin/console app:create-traittype --format categorical_free --description "Determined for type of life cycle being annual, binneal, perennial etc." --ontology_url "http://purl.obolibrary.org/obo/TO_0002725" "Life Cycle Habit"
    /fennec/bin/console app:import-trait-entries --traittype "Life Cycle Habit" --user-id 1 --mapping EOL --skip-unmapped --public --default-citation "Data supplied by Encyclopedia of Life via http://opendata.eol.org/ under CC-BY" life-cycle-habit.tsv

EPPO List of Invasive Alien Plants (Europe)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The European and Mediterranean Plant Protection Organization (EPPO) provides a list of invasive alien species: https://www.eppo.int/INVASIVE_PLANTS/ias_lists.htm
This categorizations can be obtained as csv file from: https://gd.eppo.int/rppo/EPPO/categorization.csv
In order to import this file into FENNEC execute those commands in the docker container::

    curl "https://gd.eppo.int/rppo/EPPO/categorization.csv" >/tmp/eppo_categorization.csv
    perl -pe 's/"//g' /tmp/eppo_categorization.csv | perl -F"," -ane 'print "$F[3]\t$F[1]\t\tEPPO (2017) EPPO Global Database (available online). https://gd.eppo.int\thttps://gd.eppo.int/rppo/EPPO/categorization.csv\n" if($F[6]=="")' >/tmp/eppo_categorization.tsv
    /fennec/bin/console app:create-traittype --format categorical_free --description "List of invasive alien species by the European and Mediterranean Plant Protection Organization (EPPO)" --ontology_url "https://www.eppo.int/INVASIVE_PLANTS/ias_lists.htm" "EPPO Categorization"
    /fennec/bin/console app:create-webuser EPPO # Note user-id for next command
    /fennec/bin/console app:import-trait-entries --traittype "EPPO Categorization" --user-id 2 --mapping scientific_name --skip-unmapped --public --default-citation "EPPO (2017) EPPO Global Database (available online). https://gd.eppo.int" /tmp/eppo_categorization.tsv

Backup
------

To backup the database just execute the following command (on the host, not inside of docker)::

    docker exec -it fennec_db pg_dump -U fennec fennec | xz >fennec.$(date +%F_%T).sql.xz
