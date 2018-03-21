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

.. NOTE::

    In order to make setup of new instances as easy as possible we describe the setup using docker compose.
    If you do not want to use docker compose it is possible to do it with plain docker or even without docker.
    Feel free to open an `issue <https://github.com/molbiodiv/fennec/issues>`_ if you encounter any problems.

Install docker and docker compose according to the `documentation <https://docs.docker.com/>`_.
Now create a folder for the fennec instance on the target machine and download the docker compose file::

    mkdir fennec
    cd fennec
    wget https://raw.githubusercontent.com/molbiodiv/fennec/master/docker/fennec/docker-compose.yml
    # Get initial versions of the main configuration file and the contact page
    wget -O parameters.yml https://raw.githubusercontent.com/molbiodiv/fennec/master/app/config/parameters.yml.dist
    wget -O custom_contact.html.twig https://raw.githubusercontent.com/molbiodiv/fennec/master/app/Resources/views/misc/missing_contact.html.twig

.. NOTE::

    The name of the folder is relevant because docker compose will use this as the project name.
    If you want to have multiple fennec instances on the same host make sure to use different directory names.
    In the following it is assumed that ``docker-compose`` is always executed from inside your fennec directory.

Have a look at the ``docker-compose.yml`` file and edit it as needed (e.g. adjust the port you want to use).
Now it is time to create and initialize the fennec instance::

    docker-compose up -d
    # wait a couple of seconds to allow the databases to boot
    # Now initialize the userdb and the default_data db
    docker-compose exec web /fennec/bin/console doctrine:schema:create --em userdb
    docker-compose exec web /fennec/bin/console doctrine:schema:create --em default_data
    docker-compose exec web /fennec/bin/console doctrine:fixtures:load --em default_data -n

Congratulations, Fennec is now running on http://localhost .
However, Fennec does not contain any data, yet.

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

World Crops Database
^^^^^^^^^^^^^^^^^^^^

The World Crops Database is a collection of cereals, fruits, vegetables and other crops that are grown by farmers all over the world collected by Hein Bijlmakers at http://world-crops.com/ .
It has a list of plants by scientific name http://world-crops.com/showcase/scientific-names/ which can be used for import into FENNEC.
Being on this list is a strong indication that the plant can be used for agriculture.
The definition of crop used for the database is:
"Agricultural crops are plants that are grown or deliberately managed by man for certain purposes." (see http://world-crops.com/the-world-crops-database/ )
To prepare the data for import into FENNEC (just the info that a plant is listed) execute::

    # Citation will be provided as default citation (therefore left empty here)
    curl "http://world-crops.com/showcase/scientific-names/" | grep Abelmoschus | perl -pe 's/\|/\n/g;s/.*a href="([^"]+)" >([^<]+).*/$2\tlisted\t\t\t$1/g' | grep -v "</p>" | sort -u >/tmp/crops.tsv
    /fennec/bin/console app:create-traittype --format categorical_free --description "The World Crops Database is a collection of cereals, fruits, vegetables and other crops that are grown by farmers all over the world. In this context crops are defined as 'Agricultural crops are plants that are grown or deliberately managed by man for certain purposes.'" --ontology_url "http://world-crops.com/" "World Crops Database"
    /fennec/bin/console app:create-webuser "WorldCropsDatabase" # Note user-id for next command
    /fennec/bin/console app:import-trait-entries --user-id 3 --default-citation "Hein Bijlmakers, 'World Crops Database', available online http://world-crops.com/showcase/scientific-names/ (retrieved $(date "+%Y-%m-%d"))" --traittype "World Crops Database" --mapping scientific_name --skip-unmapped /tmp/crops.tsv

The database also contains categories like Vegetables, Cereals, Fruits, etc.
So in the future those categories could be used as value instead of a generic "listed".

More TraitBank plant traits
^^^^^^^^^^^^^^^^^^^^^^^^^^^

A couple more interesting plant traits from TraitBank are available at http://opendata.eol.org/dataset/plantae
This dataset consists of thirteen traits:

* conservation status
* dispersal vector
* flower color
* invasive in
* leaf area
* leaf color
* nitrogen fixation
* plant height
* plant propagation method
* salt tolerance
* soil pH
* soil requirements
* vegetative spread rate

Three of them are numerical (leaf area, plant height, and soil pH) they are discussed in the next section.
In order to create the categorical trait types and import them into FENNEC just follow the steps below (inside the container)::

    # Download and prepare data
    cd /tmp
    curl http://opendata.eol.org/dataset/a44a37ad-27f5-45ef-8719-1a31ae4ed3e5/resource/c7c90510-402e-4ead-8204-d92c44723c1f/download/plantae.zip >plantae.zip
    unzip plantae.zip
    curl http://opendata.eol.org/dataset/a44a37ad-27f5-45ef-8719-1a31ae4ed3e5/resource/fb7e7de9-7ae9-4b63-8a64-d0a95f210da9/download/plantae-conservation-status.txt.gz >/tmp/Plantae/Plantae-conservation-status.txt.gz
    curl http://opendata.eol.org/dataset/a44a37ad-27f5-45ef-8719-1a31ae4ed3e5/resource/67410c56-d9d9-4e60-a223-39334e0081d5/download/uses.txt.gz >/tmp/Plantae/Plantae-uses.txt.gz
    for i in Plantae/*.txt.gz
    do
        BASE=$(basename $i .txt.gz)
        zcat $i | perl -F"\t" -ane 'print "$F[0]\t$F[4]\t$F[6]\tSupplier:$F[12];Citation:$F[15];Reference:$F[29];Source:$F[14]\t$F[13]\n" unless(/^EOL page ID/)' >$BASE.tsv
    done

    # Create trait types (description and ontology url from http://eol.org/data_glossary )
    /fennec/bin/console app:create-traittype --format categorical_free --ontology_url "http://rs.tdwg.org/ontology/voc/SPMInfoItems#ConservationStatus" "Conservation Status"
    /fennec/bin/console app:create-traittype --format categorical_free --description "A dispersal vector is an agent transporting seeds or other dispersal units. Dispersal vectors may include biotic factors, such as animals, or abiotic factors, such as the wind or the ocean." --ontology_url "http://eol.org/schema/terms/DispersalVector" "Dispersal Vector"
    /fennec/bin/console app:create-traittype --format categorical_free --description "A flower anatomy and morphology trait (TO:0000499) which is associated with the color of the flower (PO:0009046)." --ontology_url "http://purl.obolibrary.org/obo/TO_0000537" "Flower Color"
    /fennec/bin/console app:create-traittype --format categorical_free --description "Information about the jurisdictions where the taxon is considered to be an invasive organism due to its negative impact on human welfare or ecosystems." --ontology_url "http://eol.org/schema/terms/InvasiveRange" "Invasive In"
    /fennec/bin/console app:create-traittype --format categorical_free --description "A vascular leaf anatomy and morphology trait (TO:0000748) which is associated with the color of leaf (PO:0025034)." --ontology_url "http://purl.obolibrary.org/obo/TO_0000326" "Leaf Color"
    /fennec/bin/console app:create-traittype --format categorical_free --description "The process in which nitrogen is taken from its relatively inert molecular form (N2) in the atmosphere and converted into nitrogen compounds useful for other chemical processes, such as ammonia, nitrate and nitrogen dioxide." --ontology_url "http://purl.obolibrary.org/obo/GO_0009399" "Nitrogen Fixation"
    /fennec/bin/console app:create-traittype --format categorical_free --description "Methods used to produce new plants from a parent plant." --ontology_url "http://eol.org/schema/terms/PropagationMethod" "Plant Propagation Method"
    /fennec/bin/console app:create-traittype --format categorical_free --description "Tolerance to the high salt content in the growth medium." --ontology_url "http://purl.obolibrary.org/obo/TO_0006001" "Salt Tolerance"
    /fennec/bin/console app:create-traittype --format categorical_free --description "The soil requirements (texture, moisture, chemistry) needed for a plant to establish and grow." --ontology_url "http://eol.org/schema/terms/SoilRequirements" "Soil Requirements"
    /fennec/bin/console app:create-traittype --format categorical_free --description "The rate at which this plant can spread compared to other species with the same growth habit." --ontology_url "http://eol.org/schema/terms/VegetativeSpreadRate" "Vegetative Spread Rate"
    /fennec/bin/console app:create-traittype --format categorical_free --description "The uses of the organism or products derived from the organism." --ontology_url "http://eol.org/schema/terms/Uses" "Uses"

    # Import traits
    /fennec/bin/console app:import-trait-entries --traittype "Conservation Status" --user-id 1 --mapping EOL --skip-unmapped --public --default-citation "Data supplied by Encyclopedia of Life via http://opendata.eol.org/ under CC-BY" /tmp/Plantae-conservation-status.tsv
    /fennec/bin/console app:import-trait-entries --traittype "Dispersal Vector" --user-id 1 --mapping EOL --skip-unmapped --public --default-citation "Data supplied by Encyclopedia of Life via http://opendata.eol.org/ under CC-BY" /tmp/Plantae-dispersal-vector.tsv
    /fennec/bin/console app:import-trait-entries --traittype "Flower Color" --user-id 1 --mapping EOL --skip-unmapped --public --default-citation "Data supplied by Encyclopedia of Life via http://opendata.eol.org/ under CC-BY" /tmp/Plantae-flower-color.tsv
    /fennec/bin/console app:import-trait-entries --traittype "Invasive In" --user-id 1 --mapping EOL --skip-unmapped --public --default-citation "Data supplied by Encyclopedia of Life via http://opendata.eol.org/ under CC-BY" /tmp/Plantae-invasive-in.tsv
    /fennec/bin/console app:import-trait-entries --traittype "Leaf Color" --user-id 1 --mapping EOL --skip-unmapped --public --default-citation "Data supplied by Encyclopedia of Life via http://opendata.eol.org/ under CC-BY" /tmp/Plantae-leaf-color.tsv
    /fennec/bin/console app:import-trait-entries --traittype "Nitrogen Fixation" --user-id 1 --mapping EOL --skip-unmapped --public --default-citation "Data supplied by Encyclopedia of Life via http://opendata.eol.org/ under CC-BY" /tmp/Plantae-nitrogen-fixation.tsv
    /fennec/bin/console app:import-trait-entries --traittype "Plant Propagation Method" --user-id 1 --mapping EOL --skip-unmapped --public --default-citation "Data supplied by Encyclopedia of Life via http://opendata.eol.org/ under CC-BY" /tmp/Plantae-plant-propagation-method.tsv
    /fennec/bin/console app:import-trait-entries --traittype "Salt Tolerance" --user-id 1 --mapping EOL --skip-unmapped --public --default-citation "Data supplied by Encyclopedia of Life via http://opendata.eol.org/ under CC-BY" /tmp/Plantae-salt-tolerance.tsv
    /fennec/bin/console app:import-trait-entries --traittype "Soil Requirements" --user-id 1 --mapping EOL --skip-unmapped --public --default-citation "Data supplied by Encyclopedia of Life via http://opendata.eol.org/ under CC-BY" /tmp/Plantae-soil-requirements.tsv
    /fennec/bin/console app:import-trait-entries --traittype "Vegetative Spread Rate" --user-id 1 --mapping EOL --skip-unmapped --public --default-citation "Data supplied by Encyclopedia of Life via http://opendata.eol.org/ under CC-BY" /tmp/Plantae-vegetative-spread-rate.tsv
    /fennec/bin/console app:import-trait-entries --traittype "Uses" --user-id 1 --mapping EOL --skip-unmapped --public --default-citation "Data supplied by Encyclopedia of Life via http://opendata.eol.org/ under CC-BY" /tmp/Plantae-uses.tsv


By now you should have an idea on how importing categorical traits into FENNEC works.

Numerical Traits
^^^^^^^^^^^^^^^^

.. ATTENTION::
    The numerical traits need a little more attention as there are two potential complications:

    1. The values might have different units
    2. The values might represent different kinds of statistics (single measurement, mean, median, min, max)

    Regarding 1: FENNEC associates a single unit for each trait type. Therefore all numbers have to be converted to this unit.
    Regarding 2: In order to allow simple usage of numerical values in community analyses FENNEC has no notion of those different types.
    Instead FENNEC treats all values for one organism identically and uses their mean to aggregate them.
    Therefore it is important to only import meaningful values (mean, median, in some cases measurements, in case of a symmetric distribution min and max together might make sense as well).
    This short coming could be fixed in the future by adding more fine grained trait formats (e.g. numerical-range)

To import the traits downloaded above in the plantae dataset from http://opendata.eol.org/dataset/plantae do this inside the docker container::

    # data preparation
    # For leaf area some values are numeric (unit mm^2 or cm^2) some categorical (large, medium, samll, ...) all methods are either measurement or average. Therefore all numeric values are used and converted to cm^2. Unit neads to be stripped from values.
    zcat /tmp/Plantae/Plantae-leaf-area.txt.gz | perl -F"\t" -ane 'BEGIN{%factor=("cm^2" => 1, "mm^2" => 0.01)} $F[4]=~s/,//g;$F[4]=~s/ .*//g; print "$F[0]\t".($F[4] * $factor{$F[7]})."\t$F[6]\tSupplier:$F[12];Citation:$F[15];Reference:$F[29];Source:$F[14]\t$F[13]\n" unless(/^EOL page ID/ or $F[7] eq "")' >/tmp/Plantae-leaf-area.tsv
    # For plant height we convert all units (cm, ft, inch, m) to cm and discard rows that use statistical method http://semanticscience.org/resource/SIO_001114 (max), retaining average, median and measurement
    zcat /tmp/Plantae/Plantae-plant-height.txt.gz | perl -F"\t" -ane 'BEGIN{%factor=("cm" => 1, "m" => 100, "ft" => 30.48, "inch" => 2.54)} print "$F[0]\t".($F[4] * $factor{$F[7]})."\t$F[6]\tSupplier:$F[12];Citation:$F[15];Reference:$F[29];Source:$F[14]\t$F[13]\n" unless(/^EOL page ID/ or $F[17] eq "http://semanticscience.org/resource/SIO_001114")' >/tmp/Plantae-plant-height.tsv
    # pH has no unit so that is not a problem. However the method here is either min or max. But we have both values for every EOL ID except 1114581 and 584907 (verify with zcat Plantae/Plantae-soil-pH.txt.gz | cut -f1,18 | sort -u | cut -f1 | sort | uniq -u ).
    zcat /tmp/Plantae/Plantae-soil-pH.txt.gz | perl -F"\t" -ane 'print "$F[0]\t$F[4]\t$F[6]\tSupplier:$F[12];Citation:$F[15];Reference:$F[29];Source:$F[14]\t$F[13]\n" unless(/^EOL page ID/ or $F[0] eq "1114581" or $F[0] eq "584907")' >/tmp/Plantae-soil-pH.tsv

    # Create trait types (incl. unit)
    /fennec/bin/console app:create-traittype --format numerical --description "A leaf anatomy and morphology trait (TO:0000748) which is associated with the total area of a leaf (PO:0025034)." --ontology_url "http://purl.obolibrary.org/obo/TO_0000540" --unit "cm^2" "Leaf Area"
    /fennec/bin/console app:create-traittype --format numerical --description "A stature and vigor trait (TO:0000133) which is associated with the height of a whole plant (PO:0000003)." --ontology_url "http://purl.obolibrary.org/obo/TO_0000207" --unit "cm" "Plant Height"
    /fennec/bin/console app:create-traittype --format numerical --description "The soil pH, of the top 12 inches of soil, within the plant’s known geographical range. For cultivars, the geographical range is defined as the area to which the cultivar is well adapted rather than marginally adapted." --ontology_url "http://eol.org/schema/terms/SoilPH" "Soil pH"

    # import
    /fennec/bin/console app:import-trait-entries --traittype "Leaf Area" --user-id 1 --mapping EOL --skip-unmapped --public --default-citation "Data supplied by Encyclopedia of Life via http://opendata.eol.org/ under CC-BY" /tmp/Plantae-leaf-area.tsv
    /fennec/bin/console app:import-trait-entries --traittype "Plant Height" --user-id 1 --mapping EOL --skip-unmapped --public --default-citation "Data supplied by Encyclopedia of Life via http://opendata.eol.org/ under CC-BY" /tmp/Plantae-plant-height.tsv
    /fennec/bin/console app:import-trait-entries --traittype "Soil pH" --user-id 1 --mapping EOL --skip-unmapped --public --default-citation "Data supplied by Encyclopedia of Life via http://opendata.eol.org/ under CC-BY" /tmp/Plantae-soil-pH.tsv

This will import the numerical trait values into FENNEC.
The count for "Distinct new values" will be displayed as 0 as this is specific for categorical values.

SCALES Wasps & Bees Database
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

This database (available at http://scales.ckff.si/scaletool/?menu=6&submenu=3 ) is an excellent resource for many traits of 162 bees and wasps.
As data download is not easily possible here is a guide on downloading all the data and extracting the traits:
First download the html pages of all organisms to an empty folder (sid ranges from 1 to 162, determined by trial and error)::

    for i in $(seq 1 163)
    do
        curl "http://scales.ckff.si/scaletool/index.php?menu=6&submenu=3&sid=$i" >$i.html
    done

To extract all traits I wrote a short python script (using `Beautiful Soup <https://www.crummy.com/software/BeautifulSoup/>`_) available as `gist <https://gist.github.com/iimog/a6a36a7b03906f18ac490b0a4708224c>`_.
If you download that you can extract traits with this command::

    # Install beautiful soup (e.g. via "conda install beautifulsoup4")
    # Inside the folder with the html files
    python extract_scales_bee_traits_from_html.py
    # Get rid of colon in filenames
    rename 's/://g' *.tsv
    # Osmia rufa and Osmia bicornis are synonyms but bicornis is used by NCBI taxonomy while rufa is used by SCALES, therefore: rename globally:
    perl -i -pe 's/Osmia rufa/Osmia bicornis/g' *.tsv

This will create a bunch of tsv files with categorical and numerical values for each trait as well as a file ``trait_types.tsv`` which lists all trait types with description.
Using mapping by scientific name those files can be imported directly (transfer them to the docker container via ``docker cp`` if you did not execute the previous commands there)::

    # Create trait types (incl. unit)
    /fennec/bin/console app:create-traittype --format numerical --description "Average number of brood cells per nest" "Nest cells"
    /fennec/bin/console app:create-traittype --format numerical --description "Approximate body length of female collection specimens" --unit "mm" "Body length: female"
    /fennec/bin/console app:create-traittype --format numerical --description "Mean weight of a freshly hatched adult female" --unit "mg" "Adult weight: female"
    /fennec/bin/console app:create-traittype --format numerical --description "Male/female rate of progeny" "Sex ratio"
    /fennec/bin/console app:create-traittype --format categorical_free --description "Sex ratio categories: female biased (males/females<0.8), equal (males/females 0.8-1.3), male biased (males/females>1.3)" "Sex ratio (categorical)"
    /fennec/bin/console app:create-traittype --format categorical_free "Larval food type"
    /fennec/bin/console app:create-traittype --format categorical_free "Foraging mode"
    /fennec/bin/console app:create-traittype --format categorical_free --description "Typical of a landscape species" "Landscape type"
    /fennec/bin/console app:create-traittype --format categorical_free --description "Nest building material type" "Nest built of"
    /fennec/bin/console app:create-traittype --format categorical_free --description "Trophic specialisation rank" "Trophic specialisation"
    /fennec/bin/console app:create-traittype --format categorical_free --description "Taxonomic rank on which this organism is specialized on" "Specialized on"

    # Create webuser
    /fennec/bin/console app:create-webuser "SCALES_WaspsBeesDatabase" # Note user-id for next commands

    # import
    /fennec/bin/console app:import-trait-entries --traittype "Nest cells" --user-id 7 --mapping scientific_name --skip-unmapped --public --default-citation "Budrys, E., Budriene., A. and Orlovskyte. S. 2014. Cavity-nesting wasps and bees database." "/tmp/Nest cells_numeric.tsv"
    /fennec/bin/console app:import-trait-entries --traittype "Body length: female" --user-id 7 --mapping scientific_name --skip-unmapped --public --default-citation "Budrys, E., Budriene., A. and Orlovskyte. S. 2014. Cavity-nesting wasps and bees database." "/tmp/Body length female_numeric.tsv"
    /fennec/bin/console app:import-trait-entries --traittype "Adult weight: female" --user-id 7 --mapping scientific_name --skip-unmapped --public --default-citation "Budrys, E., Budriene., A. and Orlovskyte. S. 2014. Cavity-nesting wasps and bees database." "/tmp/Adult weight female_numeric.tsv"
    /fennec/bin/console app:import-trait-entries --traittype "Sex ratio" --user-id 7 --mapping scientific_name --skip-unmapped --public --default-citation "Budrys, E., Budriene., A. and Orlovskyte. S. 2014. Cavity-nesting wasps and bees database." "/tmp/Sex ratio_numeric.tsv"
    /fennec/bin/console app:import-trait-entries --traittype "Sex ratio (categorical)" --user-id 7 --mapping scientific_name --skip-unmapped --public --default-citation "Budrys, E., Budriene., A. and Orlovskyte. S. 2014. Cavity-nesting wasps and bees database." "/tmp/Sex ratio_categorical.tsv"
    /fennec/bin/console app:import-trait-entries --traittype "Larval food type" --user-id 7 --mapping scientific_name --skip-unmapped --public --default-citation "Budrys, E., Budriene., A. and Orlovskyte. S. 2014. Cavity-nesting wasps and bees database." "/tmp/Larval food type_categorical.tsv"
    /fennec/bin/console app:import-trait-entries --traittype "Foraging mode" --user-id 7 --mapping scientific_name --skip-unmapped --public --default-citation "Budrys, E., Budriene., A. and Orlovskyte. S. 2014. Cavity-nesting wasps and bees database." "/tmp/Foraging mode_categorical.tsv"
    /fennec/bin/console app:import-trait-entries --traittype "Landscape type" --user-id 7 --mapping scientific_name --skip-unmapped --public --default-citation "Budrys, E., Budriene., A. and Orlovskyte. S. 2014. Cavity-nesting wasps and bees database." "/tmp/Landscape type_categorical.tsv"
    /fennec/bin/console app:import-trait-entries --traittype "Nest built of" --user-id 7 --mapping scientific_name --skip-unmapped --public --default-citation "Budrys, E., Budriene., A. and Orlovskyte. S. 2014. Cavity-nesting wasps and bees database." "/tmp/Nest built of_categorical.tsv"
    /fennec/bin/console app:import-trait-entries --traittype "Trophic specialisation" --user-id 7 --mapping scientific_name --skip-unmapped --public --default-citation "Budrys, E., Budriene., A. and Orlovskyte. S. 2014. Cavity-nesting wasps and bees database." "/tmp/Trophic specialisation_categorical.tsv"
    /fennec/bin/console app:import-trait-entries --traittype "Specialized on" --user-id 7 --mapping scientific_name --skip-unmapped --public --default-citation "Budrys, E., Budriene., A. and Orlovskyte. S. 2014. Cavity-nesting wasps and bees database." "/tmp/Trophic specialisation_numeric.tsv"

IUCN Redlist
^^^^^^^^^^^^

IUCN redlist data can be conveniently downloaded using the `API <http://apiv3.iucnredlist.org/>`_.
Before you can query the API you need to register for a token.
Also if you want to put this data into a public instance you have to make sure to always (automatically) update the data to the latest version in order to comply with the terms of use.
For convenience there are some scripts that help with download and update of IUCN data.
You first have to do some initial preparation and then add an entry to crontab (in the fennec container)::

    mkdir -p /iucn
    cd /iucn
    echo "YOUR IUCN API TOKEN" >.iucn_token
    crontab -e
    # Add the following line (without the # at the beginning of the line)
    #17 * * * * cd /iucn;/fennec/util/check_download_update_iucn.sh >>iucn_cron.log 2>>iucn_cron.err

This will download the most current version of the IUCN red list via the api and add it to the fennec database.
On the first run the webuser and traittype are automatically generated.
On subsequent runs if the version of IUCN is unchanged nothing happens and if there is a new version the old traits are expired and the new data is loaded.
You will notice that only about half the entries could be mapped by their scientific name.
One reason for that is that many species on the red list are species with a small population size endemic to a small geographic region.

Backup
------

To backup the database just execute the following command (on the host, not inside of docker)::

    docker exec -it fennec_db pg_dump -U fennec fennec | xz >fennec.$(date +%F_%T).sql.xz

Upgrade
-------

To upgrade to a new version of FENNEC please review the change log and pay special attention to any breaking changes.
Always make a full backup of your database (see above) and all files you modified before upgrading.
The cleanest way to upgrade (if you are using docker) is by replacing the docker container with the latest version like this::

    # Backups of data files (for database see backup section above)
    docker cp fennec_web:/fennec/app/config/parameters.yml parameters.yml
    # If you modified your contact page
    docker cp fennec_web:/fennec/app/Resources/views/misc/contact.html.twig contact.html.twig
    # If you use the IUCN cron job
    docker cp fennec_web:/iucn iucn

    # pull new image
    docker pull iimog/fennec
    # replace old docker container with new one
    docker stop fennec_web
    docker rename fennec_web fennec_web_legacy
    docker run -d -p 8889:80 --link fennec_db:db --name fennec_web iimog/fennec

    # put all files back into place
    docker cp parameters.yml fennec_web:/fennec/app/config/parameters.yml
    # If you modified your contact page
    docker cp contact.html.twig fennec_web:/fennec/app/Resources/views/misc/contact.html.twig
    # If you use the IUCN cron job
    docker cp iucn fennec_web:/iucn
    # You also have to re-create the crontab entry (see IUCN Redlist section)

    # after carefully checking that everything works
    docker rm fennec_web_legacy
