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
    # Create empty data folder with correct owner
    mkdir data

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

Create admin user
^^^^^^^^^^^^^^^^^

The admin user is able to manage other users and needs to be created via the command line.
You can choose the username, email and password freely.
If you do not provide the password as last argument you will be prompted for it.
This avoids adding this sensible information to your command history.
There will be no visual feedback while you type the password::

    docker-compose exec web /fennec/bin/console app:create-user --super-admin <username> <email> [password]

.. NOTE::

    If you forget the password of the admin user you can create a new one and use the admin web interface to edit or delete the old account.

Login with GitHub
^^^^^^^^^^^^^^^^^

1. Register an OAuth App with your account following [this guide](https://developer.github.com/apps/building-integrations/setting-up-and-registering-oauth-apps/)
2. As "Authorization callback URL" enter your domain or ip address with ``/login`` appended
3. Modify ``parameters.yml`` and add the respective values to ``github_client_id`` and ``github_client_secret``

That's it. Login with GitHub should now work.

.. WARNING::

    After changes to ``parameters.yml`` it might be necessary to clear the cache::

        docker-compose restart
        docker-compose exec -u www-data web /fennec/bin/console cache:clear --env prod
        docker-compose exec -u www-data web /fennec/bin/console cache:warmup --env prod

Contact Page
^^^^^^^^^^^^

The content of ``custom_contact.html.twig`` is integrated into the contact page.
You can modify it like this for example::

    <div class="row">
        <h1>Contact</h1>
        This instance is maintained by <a href="mailto:mail@example.com">John Doe</a>.
        The source code is available on <a href="https://github.com/molbiodiv/fennec">GitHub</a>.
    </div>

Please be aware that a proper contact page might be a legal requirement if you run a public instance.

Google Analytics
^^^^^^^^^^^^^^^^

It is possible to monitor the traffic of your page with `Google Analytics <https://analytics.google.com>`_ which is disabled by default.
If you want to enable it make sure that you are allowed to do this legally, and then add your tracking id to ``parameters.yml`` as value for ``ga_tracking``.

Loading organisms
-----------------

The following sections describe in detail how to import organisms and traits into a Fennec database.
Those are the commands used to import the ``default_data`` into the public instance.
If you want to start with a mirror of this database without importing everything manually you can use :download:`this dump <example/fennec_default_data.sql.xz>`.
Skip ahead to :ref:`import-db-reference-label`.

NCBI Taxonomy
^^^^^^^^^^^^^

We will demonstrate loading organisms into the ``default_data`` database using `NCBI Taxonomy <https://www.ncbi.nlm.nih.gov/taxonomy>`_.
Inside the docker container execute the following commands::

    curl ftp://ftp.ncbi.nih.gov/pub/taxonomy/taxdump.tar.gz >data/taxdump.tar.gz
    tar xzvf data/taxdump.tar.gz -C data
    grep "scientific name" data/names.dmp | perl -F"\t" -ane 'print "$F[2]\t$F[0]\n"' >data/ncbi_organisms.tsv
    docker-compose exec web /fennec/bin/console app:import-organism-db --provider ncbi_taxonomy /data/ncbi_organisms.tsv

The last step will take a couple of minutes but after that more than 1.7 million organisms will be stored in the database with their scientific name and NCBI taxid.

.. ATTENTION::

    The taxonomy is currently only used to display it on the organism page.
    There are possible future applications like automatic trait imputation based on taxonomy.
    However, none of them are implemented, yet.
    Therefore, you might consider not importing taxonomic information, especially as the import is quite cumbersome.
    If taxonomic information is used more in FENNEC the import process will be improved as well.
    For now the steps below are required.

In order to add taxonomic relationships follow those steps::

    # Create a fennec_id to ncbi_taxid map (will be obsolete in the future)
    docker-compose exec -T datadb psql -U fennec_data -F $'\t' -At -c "SELECT fennec_id,identifier as ncbi_taxid FROM fennec_dbxref, db WHERE fennec_dbxref.db_id=db.id AND db.name='ncbi_taxonomy';" >data/fennec2ncbi.tsv
    perl -F"\t" -ane 'BEGIN{open IN, "<data/fennec2ncbi.tsv";while(<IN>){chomp;($f,$n)=split(/\t/);$n2f{$n}=$f}} print "$n2f{$F[0]}\t$n2f{$F[2]}\t$F[4]\n"' data/nodes.dmp >data/ncbi_taxonomy.tsv
    wget -P data https://raw.githubusercontent.com/molbiodiv/fennec-cli/master/bin/import_taxonomy.pl
    docker-compose exec web perl /data/import_taxonomy.pl --input /data/ncbi_taxonomy.tsv --provider ncbi_taxonomy --db-host datadb --db-user fennec_data --db-password fennec_data --db-name fennec_data

Again the last step will take some minutes (even after printing "Script finished") and needs a few GB of memory.

EOL
^^^

The Encyclopedia of Life is a great resource for organism information.
Because of the nice API organism pages in Fennec are dynamically created from EOL content.
In order to link organisms to EOL we need to add EOL page IDs.
For this purpose we use `the hierarchy entries file <http://opendata.eol.org/dataset/da9635ec-71b6-4fb2-a4cb-518f71eeb45d/resource/dd1d5160-b56a-4541-ac88-494bc03b4bc8/download/hierarchyentries.tgz>`_::

    wget -P data http://opendata.eol.org/dataset/da9635ec-71b6-4fb2-a4cb-518f71eeb45d/resource/dd1d5160-b56a-4541-ac88-494bc03b4bc8/download/hierarchyentries.tgz
    tar xzvf data/hierarchyentries.tgz -C data
    # Now we create a file with two columns: 1) ncbi_taxid 2) eol_id
    perl -F"\t" -ane 'print "$F[4]\t$F[1]\n" if($F[2] == 1172)' data/hierarchy_entries.tsv | perl -pe 's/"//g' | sort -u >data/ncbi2eol.tsv
    docker-compose exec web php -d memory_limit=2G /fennec/bin/console app:import-organism-ids --provider EOL --mapping ncbi_taxonomy --skip-unmapped /data/ncbi2eol.tsv

Now you have 1.7 million organisms in the database of which roughly 1.2 million have a nice organism page provided by EOL.

Loading traits
--------------

Plant Growth Habit
^^^^^^^^^^^^^^^^^^

As a first example we want to load growth habit data for plants from eol.
Those values are stored in this `file from opendata.eol.org <https://editors.eol.org/eol_php_code/applications/content_server/resources/eol_traits/growth-habit.txt.gz>`_::

    wget -P data https://editors.eol.org/eol_php_code/applications/content_server/resources/eol_traits/growth-habit.txt.gz
    gunzip data/growth-habit.txt.gz
    # We want to have a tsv with the following columns: eol_id, value, value_ontology, citation, origin_url
    # And citation consists of the columns "Supplier(12),Citation(15),Reference(29),Source(14)"
    perl -F"\t" -ane 'print "$F[0]\t$F[4]\t$F[6]\tSupplier:$F[12];Citation:$F[15];Reference:$F[29];Source:$F[14]\t$F[13]\n" unless(/^EOL page ID/)' data/growth-habit.txt >data/growth-habit.tsv
    docker-compose exec web /fennec/bin/console app:create-traittype --format categorical_free --description "general growth form, including size and branching. Some organisms have different growth habits depending on environment or location" --ontology_url "http://www.eol.org/data_glossary#http___eol_org_schema_terms_PlantHabit" "Plant Growth Habit"
    docker-compose exec web php -d memory_limit=1G /fennec/bin/console app:import-trait-entries --traittype "Plant Growth Habit" --provider TraitBank --description "EOL TraitBank http://eol.org/info/516" --mapping EOL --skip-unmapped --public --default-citation "Data supplied by Encyclopedia of Life via http://opendata.eol.org/ under CC-BY" /data/growth-habit.tsv

Almost 70 thousand of the entries are imported into the database.
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

    wget -P data http://opendata.eol.org/dataset/fedb8890-f943-4907-a36f-c7df4770a076/resource/e4eced0b-70f4-497f-9aa6-b1fd1212cfd9/download/life-cycle-habit.txt.gz
    gunzip data/life-cycle-habit.txt.gz
    perl -F"\t" -ane 'print "$F[0]\t$F[4]\t$F[6]\tSupplier:$F[12];Citation:$F[15];Reference:$F[29];Source:$F[14]\t$F[13]\n" unless(/^EOL page ID/)' data/life-cycle-habit.txt >data/life-cycle-habit.tsv
    docker-compose exec web /fennec/bin/console app:create-traittype --format categorical_free --description "Determined for type of life cycle being annual, binneal, perennial etc." --ontology_url "http://purl.obolibrary.org/obo/TO_0002725" "Life Cycle Habit"
    docker-compose exec web php -d memory_limit=1G /fennec/bin/console app:import-trait-entries --traittype "Life Cycle Habit" --provider TraitBank --mapping EOL --skip-unmapped --public --default-citation "Data supplied by Encyclopedia of Life via http://opendata.eol.org/ under CC-BY" /data/life-cycle-habit.tsv

EPPO List of Invasive Alien Plants (Europe)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The European and Mediterranean Plant Protection Organization (EPPO) provides a list of invasive alien species: https://www.eppo.int/INVASIVE_PLANTS/ias_lists.htm
This categorizations can be obtained as csv file from: https://gd.eppo.int/rppo/EPPO/categorization.csv
In order to import this file into FENNEC execute those commands in the docker container::

    curl "https://gd.eppo.int/rppo/EPPO/categorization.csv" >data/eppo_categorization.csv
    perl -pe 's/"//g' data/eppo_categorization.csv | perl -F"," -ane 'print "$F[3]\t$F[1]\t\tEPPO (2017) EPPO Global Database (available online). https://gd.eppo.int\thttps://gd.eppo.int/rppo/EPPO/categorization.csv\n" if($F[6]=="")' >data/eppo_categorization.tsv
    docker-compose exec web /fennec/bin/console app:create-traittype --format categorical_free --description "List of invasive alien species by the European and Mediterranean Plant Protection Organization (EPPO)" --ontology_url "https://www.eppo.int/INVASIVE_PLANTS/ias_lists.htm" "EPPO Categorization"
    docker-compose exec web php -d memory_limit=1G /fennec/bin/console app:import-trait-entries --traittype "EPPO Categorization" --provider EPPO --description "European and Mediterranean Plant Protection Organization (EPPO) https://www.eppo.int/" --mapping scientific_name --skip-unmapped --public --default-citation "EPPO (2017) EPPO Global Database (available online). https://gd.eppo.int" /data/eppo_categorization.tsv

World Crops Database
^^^^^^^^^^^^^^^^^^^^

The World Crops Database is a collection of cereals, fruits, vegetables and other crops that are grown by farmers all over the world collected by Hein Bijlmakers at http://world-crops.com/ .
It has a list of plants by scientific name http://world-crops.com/showcase/scientific-names/ which can be used for import into FENNEC.
Being on this list is a strong indication that the plant can be used for agriculture.
The definition of crop used for the database is:
"Agricultural crops are plants that are grown or deliberately managed by man for certain purposes." (see http://world-crops.com/the-world-crops-database/ )
To prepare the data for import into FENNEC (just the info that a plant is listed) execute::

    # Citation will be provided as default citation (therefore left empty here)
    curl "http://world-crops.com/showcase/scientific-names/" | grep Abelmoschus | perl -pe 's/\|/\n/g;s/.*a href="([^"]+)" >([^<]+).*/$2\tlisted\t\t\t$1/g' | grep -v "</p>" | sort -u >data/crops.tsv
    docker-compose exec web /fennec/bin/console app:create-traittype --format categorical_free --description "The World Crops Database is a collection of cereals, fruits, vegetables and other crops that are grown by farmers all over the world. In this context crops are defined as 'Agricultural crops are plants that are grown or deliberately managed by man for certain purposes.'" --ontology_url "http://world-crops.com/" "World Crops Database"
    docker-compose exec web php -d memory_limit=1G /fennec/bin/console app:import-trait-entries --provider WorldsCropDatabase --description "The World Crops Database http://world-crops.com/the-world-crops-database/" --default-citation "Hein Bijlmakers, 'World Crops Database', available online http://world-crops.com/showcase/scientific-names/ (retrieved $(date "+%Y-%m-%d"))" --traittype "World Crops Database" --mapping scientific_name --skip-unmapped /data/crops.tsv

The database also contains categories like Vegetables, Cereals, Fruits, etc.
So in principle those categories could be used as value instead of a generic "listed".

More TraitBank plant traits
^^^^^^^^^^^^^^^^^^^^^^^^^^^

A couple more interesting plant traits from TraitBank are available at http://opendata.eol.org/dataset/plantae
This dataset consists of thirteen traits:

* conservation status (will not be imported because we use IUCN directly)
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
In order to create the categorical trait types and import them into FENNEC just follow the steps below::

    # Download and prepare data
    wget http://opendata.eol.org/dataset/a44a37ad-27f5-45ef-8719-1a31ae4ed3e5/resource/c7c90510-402e-4ead-8204-d92c44723c1f/download/plantae.zip -O data/plantae.zip
    unzip data/plantae.zip -d data
    wget http://opendata.eol.org/dataset/a44a37ad-27f5-45ef-8719-1a31ae4ed3e5/resource/67410c56-d9d9-4e60-a223-39334e0081d5/download/uses.txt.gz -O data/Plantae/Plantae-uses.txt.gz
    for i in data/Plantae/*.txt.gz
    do
        BASE=$(basename $i .txt.gz)
        zcat $i | perl -F"\t" -ane 'print "$F[0]\t$F[4]\t$F[6]\tSupplier:$F[12];Citation:$F[15];Reference:$F[29];Source:$F[14]\t$F[13]\n" unless(/^EOL page ID/)' >data/$BASE.tsv
    done

    # Create trait types (description and ontology url from http://eol.org/data_glossary )
    docker-compose exec web /fennec/bin/console app:create-traittype --format categorical_free --description "A dispersal vector is an agent transporting seeds or other dispersal units. Dispersal vectors may include biotic factors, such as animals, or abiotic factors, such as the wind or the ocean." --ontology_url "http://eol.org/schema/terms/DispersalVector" "Dispersal Vector"
    docker-compose exec web /fennec/bin/console app:create-traittype --format categorical_free --description "A flower anatomy and morphology trait (TO:0000499) which is associated with the color of the flower (PO:0009046)." --ontology_url "http://purl.obolibrary.org/obo/TO_0000537" "Flower Color"
    docker-compose exec web /fennec/bin/console app:create-traittype --format categorical_free --description "Information about the jurisdictions where the taxon is considered to be an invasive organism due to its negative impact on human welfare or ecosystems." --ontology_url "http://eol.org/schema/terms/InvasiveRange" "Invasive In"
    docker-compose exec web /fennec/bin/console app:create-traittype --format categorical_free --description "A vascular leaf anatomy and morphology trait (TO:0000748) which is associated with the color of leaf (PO:0025034)." --ontology_url "http://purl.obolibrary.org/obo/TO_0000326" "Leaf Color"
    docker-compose exec web /fennec/bin/console app:create-traittype --format categorical_free --description "The process in which nitrogen is taken from its relatively inert molecular form (N2) in the atmosphere and converted into nitrogen compounds useful for other chemical processes, such as ammonia, nitrate and nitrogen dioxide." --ontology_url "http://purl.obolibrary.org/obo/GO_0009399" "Nitrogen Fixation"
    docker-compose exec web /fennec/bin/console app:create-traittype --format categorical_free --description "Methods used to produce new plants from a parent plant." --ontology_url "http://eol.org/schema/terms/PropagationMethod" "Plant Propagation Method"
    docker-compose exec web /fennec/bin/console app:create-traittype --format categorical_free --description "Tolerance to the high salt content in the growth medium." --ontology_url "http://purl.obolibrary.org/obo/TO_0006001" "Salt Tolerance"
    docker-compose exec web /fennec/bin/console app:create-traittype --format categorical_free --description "The soil requirements (texture, moisture, chemistry) needed for a plant to establish and grow." --ontology_url "http://eol.org/schema/terms/SoilRequirements" "Soil Requirements"
    docker-compose exec web /fennec/bin/console app:create-traittype --format categorical_free --description "The rate at which this plant can spread compared to other species with the same growth habit." --ontology_url "http://eol.org/schema/terms/VegetativeSpreadRate" "Vegetative Spread Rate"
    docker-compose exec web /fennec/bin/console app:create-traittype --format categorical_free --description "The uses of the organism or products derived from the organism." --ontology_url "http://eol.org/schema/terms/Uses" "Uses"

    # Import traits
    docker-compose exec web php -d memory_limit=1G /fennec/bin/console app:import-trait-entries --traittype "Dispersal Vector" --provider TraitBank --mapping EOL --skip-unmapped --public --default-citation "Data supplied by Encyclopedia of Life via http://opendata.eol.org/ under CC-BY" /data/Plantae-dispersal-vector.tsv
    docker-compose exec web php -d memory_limit=1G /fennec/bin/console app:import-trait-entries --traittype "Flower Color" --provider TraitBank --mapping EOL --skip-unmapped --public --default-citation "Data supplied by Encyclopedia of Life via http://opendata.eol.org/ under CC-BY" /data/Plantae-flower-color.tsv
    docker-compose exec web php -d memory_limit=1G /fennec/bin/console app:import-trait-entries --traittype "Invasive In" --provider TraitBank --mapping EOL --skip-unmapped --public --default-citation "Data supplied by Encyclopedia of Life via http://opendata.eol.org/ under CC-BY" /data/Plantae-invasive-in.tsv
    docker-compose exec web php -d memory_limit=1G /fennec/bin/console app:import-trait-entries --traittype "Leaf Color" --provider TraitBank --mapping EOL --skip-unmapped --public --default-citation "Data supplied by Encyclopedia of Life via http://opendata.eol.org/ under CC-BY" /data/Plantae-leaf-color.tsv
    docker-compose exec web php -d memory_limit=1G /fennec/bin/console app:import-trait-entries --traittype "Nitrogen Fixation" --provider TraitBank --mapping EOL --skip-unmapped --public --default-citation "Data supplied by Encyclopedia of Life via http://opendata.eol.org/ under CC-BY" /data/Plantae-nitrogen-fixation.tsv
    docker-compose exec web php -d memory_limit=1G /fennec/bin/console app:import-trait-entries --traittype "Plant Propagation Method" --provider TraitBank --mapping EOL --skip-unmapped --public --default-citation "Data supplied by Encyclopedia of Life via http://opendata.eol.org/ under CC-BY" /data/Plantae-plant-propagation-method.tsv
    docker-compose exec web php -d memory_limit=1G /fennec/bin/console app:import-trait-entries --traittype "Salt Tolerance" --provider TraitBank --mapping EOL --skip-unmapped --public --default-citation "Data supplied by Encyclopedia of Life via http://opendata.eol.org/ under CC-BY" /data/Plantae-salt-tolerance.tsv
    docker-compose exec web php -d memory_limit=1G /fennec/bin/console app:import-trait-entries --traittype "Soil Requirements" --provider TraitBank --mapping EOL --skip-unmapped --public --default-citation "Data supplied by Encyclopedia of Life via http://opendata.eol.org/ under CC-BY" /data/Plantae-soil-requirements.tsv
    docker-compose exec web php -d memory_limit=1G /fennec/bin/console app:import-trait-entries --traittype "Vegetative Spread Rate" --provider TraitBank --mapping EOL --skip-unmapped --public --default-citation "Data supplied by Encyclopedia of Life via http://opendata.eol.org/ under CC-BY" /data/Plantae-vegetative-spread-rate.tsv
    docker-compose exec web php -d memory_limit=1G /fennec/bin/console app:import-trait-entries --traittype "Uses" --provider TraitBank --mapping EOL --skip-unmapped --public --default-citation "Data supplied by Encyclopedia of Life via http://opendata.eol.org/ under CC-BY" /data/Plantae-uses.tsv


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
    zcat data/Plantae/Plantae-leaf-area.txt.gz | perl -F"\t" -ane 'BEGIN{%factor=("cm^2" => 1, "mm^2" => 0.01)} $F[4]=~s/,//g;$F[4]=~s/ .*//g; print "$F[0]\t".($F[4] * $factor{$F[7]})."\t$F[6]\tSupplier:$F[12];Citation:$F[15];Reference:$F[29];Source:$F[14]\t$F[13]\n" unless(/^EOL page ID/ or $F[7] eq "")' >data/Plantae-leaf-area.tsv
    # For plant height we convert all units (cm, ft, inch, m) to cm and discard rows that use statistical method http://semanticscience.org/resource/SIO_001114 (max), retaining average, median and measurement
    zcat data/Plantae/Plantae-plant-height.txt.gz | perl -F"\t" -ane 'BEGIN{%factor=("cm" => 1, "m" => 100, "ft" => 30.48, "inch" => 2.54)} print "$F[0]\t".($F[4] * $factor{$F[7]})."\t$F[6]\tSupplier:$F[12];Citation:$F[15];Reference:$F[29];Source:$F[14]\t$F[13]\n" unless(/^EOL page ID/ or $F[17] eq "http://semanticscience.org/resource/SIO_001114")' >data/Plantae-plant-height.tsv
    # pH has no unit so that is not a problem. However the method here is either min or max. But we have both values for every EOL ID except 1114581 and 584907 (verify with zcat Plantae/Plantae-soil-pH.txt.gz | cut -f1,18 | sort -u | cut -f1 | sort | uniq -u ).
    zcat data/Plantae/Plantae-soil-pH.txt.gz | perl -F"\t" -ane 'print "$F[0]\t$F[4]\t$F[6]\tSupplier:$F[12];Citation:$F[15];Reference:$F[29];Source:$F[14]\t$F[13]\n" unless(/^EOL page ID/ or $F[0] eq "1114581" or $F[0] eq "584907")' >data/Plantae-soil-pH.tsv

    # Create trait types (incl. unit)
    docker-compose exec web /fennec/bin/console app:create-traittype --format numerical --description "A leaf anatomy and morphology trait (TO:0000748) which is associated with the total area of a leaf (PO:0025034)." --ontology_url "http://purl.obolibrary.org/obo/TO_0000540" --unit "cm^2" "Leaf Area"
    docker-compose exec web /fennec/bin/console app:create-traittype --format numerical --description "A stature and vigor trait (TO:0000133) which is associated with the height of a whole plant (PO:0000003)." --ontology_url "http://purl.obolibrary.org/obo/TO_0000207" --unit "cm" "Plant Height"
    docker-compose exec web /fennec/bin/console app:create-traittype --format numerical --description "The soil pH, of the top 12 inches of soil, within the plant’s known geographical range. For cultivars, the geographical range is defined as the area to which the cultivar is well adapted rather than marginally adapted." --ontology_url "http://eol.org/schema/terms/SoilPH" "Soil pH"

    # import
    docker-compose exec web php -d memory_limit=1G /fennec/bin/console app:import-trait-entries --traittype "Leaf Area" --provider TraitBank --mapping EOL --skip-unmapped --public --default-citation "Data supplied by Encyclopedia of Life via http://opendata.eol.org/ under CC-BY" /data/Plantae-leaf-area.tsv
    docker-compose exec web php -d memory_limit=1G /fennec/bin/console app:import-trait-entries --traittype "Plant Height" --provider TraitBank --mapping EOL --skip-unmapped --public --default-citation "Data supplied by Encyclopedia of Life via http://opendata.eol.org/ under CC-BY" /data/Plantae-plant-height.tsv
    docker-compose exec web php -d memory_limit=1G /fennec/bin/console app:import-trait-entries --traittype "Soil pH" --provider TraitBank --mapping EOL --skip-unmapped --public --default-citation "Data supplied by Encyclopedia of Life via http://opendata.eol.org/ under CC-BY" /data/Plantae-soil-pH.tsv

This will import the numerical trait values into FENNEC.
The count for "Distinct new values" will be displayed as 0 as this is specific for categorical values.

SCALES Wasps & Bees Database
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

This database (available at http://scales.ckff.si/scaletool/?menu=6&submenu=3 ) is an excellent resource for many traits of 162 bees and wasps.
As data download is not easily possible here is a guide on downloading all the data and extracting the traits:
First download the html pages of all organisms to an empty folder (sid ranges from 1 to 162, determined by trial and error)::

    mkdir -p data/scales
    for i in $(seq 1 162)
    do
        curl "http://scales.ckff.si/scaletool/index.php?menu=6&submenu=3&sid=$i" >data/scales/$i.html
    done

To extract all traits I wrote a short python script (using `Beautiful Soup <https://www.crummy.com/software/BeautifulSoup/>`_) available as `gist <https://gist.github.com/iimog/a6a36a7b03906f18ac490b0a4708224c>`_.
You can extract traits with those commands::

    # Install beautiful soup (e.g. via "conda install beautifulsoup4")
    cd data/scales
    wget https://gist.githubusercontent.com/iimog/a6a36a7b03906f18ac490b0a4708224c/raw/b3bc7309ae13415c9d00ad469e948b8847312511/extract_scales_bee_traits_from_html.py
    python extract_scales_bee_traits_from_html.py
    # Get rid of colon in filenames
    rename 's/://g' *.tsv
    # Osmia rufa and Osmia bicornis are synonyms but bicornis is used by NCBI taxonomy while rufa is used by SCALES, therefore: rename globally:
    perl -i -pe 's/Osmia rufa/Osmia bicornis/g' *.tsv
    cd -

This will create a bunch of tsv files with categorical and numerical values for each trait as well as a file ``trait_types.tsv`` which lists all trait types with description.
Using mapping by scientific name those files can be imported directly::

    # Create trait types (incl. unit)
    docker-compose exec web /fennec/bin/console app:create-traittype --format numerical --description "Average number of brood cells per nest" "Nest cells"
    docker-compose exec web /fennec/bin/console app:create-traittype --format numerical --description "Approximate body length of female collection specimens" --unit "mm" "Body length: female"
    docker-compose exec web /fennec/bin/console app:create-traittype --format numerical --description "Mean weight of a freshly hatched adult female" --unit "mg" "Adult weight: female"
    docker-compose exec web /fennec/bin/console app:create-traittype --format numerical --description "Male/female rate of progeny" "Sex ratio"
    docker-compose exec web /fennec/bin/console app:create-traittype --format categorical_free --description "Sex ratio categories: female biased (males/females<0.8), equal (males/females 0.8-1.3), male biased (males/females>1.3)" "Sex ratio (categorical)"
    docker-compose exec web /fennec/bin/console app:create-traittype --format categorical_free "Larval food type"
    docker-compose exec web /fennec/bin/console app:create-traittype --format categorical_free "Foraging mode"
    docker-compose exec web /fennec/bin/console app:create-traittype --format categorical_free --description "Typical of a landscape species" "Landscape type"
    docker-compose exec web /fennec/bin/console app:create-traittype --format categorical_free --description "Nest building material type" "Nest built of"
    docker-compose exec web /fennec/bin/console app:create-traittype --format categorical_free --description "Trophic specialisation rank" "Trophic specialisation"
    docker-compose exec web /fennec/bin/console app:create-traittype --format categorical_free --description "Taxonomic rank on which this organism is specialized on" "Specialized on"

    # import
    docker-compose exec web php -d memory_limit=1G /fennec/bin/console app:import-trait-entries --traittype "Nest cells" --provider SCALES_WaspsBeesDatabase --description "SCALES Wasps & Bees Database http://scales.ckff.si/scaletool/?menu=6&submenu=3" --mapping scientific_name --skip-unmapped --public --default-citation "Budrys, E., Budriene., A. and Orlovskyte. S. 2014. Cavity-nesting wasps and bees database." "/data/scales/Nest cells_numeric.tsv"
    docker-compose exec web php -d memory_limit=1G /fennec/bin/console app:import-trait-entries --traittype "Body length: female" --provider SCALES_WaspsBeesDatabase --mapping scientific_name --skip-unmapped --public --default-citation "Budrys, E., Budriene., A. and Orlovskyte. S. 2014. Cavity-nesting wasps and bees database." "/data/scales/Body length female_numeric.tsv"
    docker-compose exec web php -d memory_limit=1G /fennec/bin/console app:import-trait-entries --traittype "Adult weight: female" --provider SCALES_WaspsBeesDatabase --mapping scientific_name --skip-unmapped --public --default-citation "Budrys, E., Budriene., A. and Orlovskyte. S. 2014. Cavity-nesting wasps and bees database." "/data/scales/Adult weight female_numeric.tsv"
    docker-compose exec web php -d memory_limit=1G /fennec/bin/console app:import-trait-entries --traittype "Sex ratio" --provider SCALES_WaspsBeesDatabase --mapping scientific_name --skip-unmapped --public --default-citation "Budrys, E., Budriene., A. and Orlovskyte. S. 2014. Cavity-nesting wasps and bees database." "/data/scales/Sex ratio_numeric.tsv"
    docker-compose exec web php -d memory_limit=1G /fennec/bin/console app:import-trait-entries --traittype "Sex ratio (categorical)" --provider SCALES_WaspsBeesDatabase --mapping scientific_name --skip-unmapped --public --default-citation "Budrys, E., Budriene., A. and Orlovskyte. S. 2014. Cavity-nesting wasps and bees database." "/data/scales/Sex ratio_categorical.tsv"
    docker-compose exec web php -d memory_limit=1G /fennec/bin/console app:import-trait-entries --traittype "Larval food type" --provider SCALES_WaspsBeesDatabase --mapping scientific_name --skip-unmapped --public --default-citation "Budrys, E., Budriene., A. and Orlovskyte. S. 2014. Cavity-nesting wasps and bees database." "/data/scales/Larval food type_categorical.tsv"
    docker-compose exec web php -d memory_limit=1G /fennec/bin/console app:import-trait-entries --traittype "Foraging mode" --provider SCALES_WaspsBeesDatabase --mapping scientific_name --skip-unmapped --public --default-citation "Budrys, E., Budriene., A. and Orlovskyte. S. 2014. Cavity-nesting wasps and bees database." "/data/scales/Foraging mode_categorical.tsv"
    docker-compose exec web php -d memory_limit=1G /fennec/bin/console app:import-trait-entries --traittype "Landscape type" --provider SCALES_WaspsBeesDatabase --mapping scientific_name --skip-unmapped --public --default-citation "Budrys, E., Budriene., A. and Orlovskyte. S. 2014. Cavity-nesting wasps and bees database." "/data/scales/Landscape type_categorical.tsv"
    docker-compose exec web php -d memory_limit=1G /fennec/bin/console app:import-trait-entries --traittype "Nest built of" --provider SCALES_WaspsBeesDatabase --mapping scientific_name --skip-unmapped --public --default-citation "Budrys, E., Budriene., A. and Orlovskyte. S. 2014. Cavity-nesting wasps and bees database." "/data/scales/Nest built of_categorical.tsv"
    docker-compose exec web php -d memory_limit=1G /fennec/bin/console app:import-trait-entries --traittype "Trophic specialisation" --provider SCALES_WaspsBeesDatabase --mapping scientific_name --skip-unmapped --public --default-citation "Budrys, E., Budriene., A. and Orlovskyte. S. 2014. Cavity-nesting wasps and bees database." "/data/scales/Trophic specialisation_categorical.tsv"
    docker-compose exec web php -d memory_limit=1G /fennec/bin/console app:import-trait-entries --traittype "Specialized on" --provider SCALES_WaspsBeesDatabase --mapping scientific_name --skip-unmapped --public --default-citation "Budrys, E., Budriene., A. and Orlovskyte. S. 2014. Cavity-nesting wasps and bees database." "/data/scales/Trophic specialisation_numeric.tsv"

IUCN Redlist
^^^^^^^^^^^^

IUCN redlist data can be conveniently downloaded using the `API <http://apiv3.iucnredlist.org/>`_.
Before you can query the API you need to register for a token.
Also if you want to put this data into a public instance you have to make sure to always (automatically) update the data to the latest version in order to comply with the terms of use.
For convenience there are some scripts that help with download and update of IUCN data.
You have to do some initial preparation and then link additional files into the fennec container::

    mkdir -p iucn
    echo "YOUR IUCN API TOKEN" >iucn/.iucn_token

Now edit the ``docker-compose.yml`` and add to the list of volumes for the ``web`` service::

    - "./iucn:/iucn"

Then rebuild your web container::

    docker-compose stop web
    docker-compose rm -f web
    docker-compose up -d

Now you can download and import/update the iucn data in your database with::

    docker-compose exec web bash -c "cd /iucn;/fennec/util/check_download_update_iucn.sh"

This will download the most current version of the IUCN red list via the api and add it to the fennec database.
On the first run the traittype is automatically generated.
On subsequent runs if the version of IUCN is unchanged nothing happens and if there is a new version the old traits are expired and the new data is loaded.
You will notice that only about half the entries could be mapped by their scientific name.
One reason for that is that many species on the red list are species with a small population size endemic to a small geographic region.

.. WARNING::

    In order to comply with the terms of use of IUCN please add a cron job to your docker host.
    Unfortunately cron does not work smoothly inside docker but you can try this as well if you feel like it.
    Otherwise add an entry like this to your host via ``crontab -e`` (use the correct path)::

        0 * * * * docker-compose -f /path/to/docker-compose.yml exec web bash -c "cd /iucn;/fennec/util/check_download_update_iucn.sh >>iucn_cron.log 2>>iucn_cron.err"

Multiple data databases
-----------------------

It is possible to have multiple data databases in Fennec.
This is useful, both to provide different versions and to provide specific databases for groups of organisms.
While projects are always stored in the user database the data database to work on can be selected in the web interface.
Users can map their organisms against different data databases (this information is stored independently).
However traits mapped to the project are stored without distinguishing database versions.

To create an additional database add to your ``parameters.yml`` (for a simpler presentation the irrelevant fractions of the file are not shown, denoted by ``# ...``)::

    parameters:
        # ...
        user_connection: "userdb"
        user_entity_manager: "userdb"
        default_data_connection: "default_data"
        default_data_entity_manager: "default_data"
        versions: 'default_data|alternative_data'
        dbal:
            connections:
                'userdb':
                    # ...
                'default_data':
                    # ...
                'alternative_data':
                    driver: pdo_pgsql
                    host: datadb
                    port: 5432
                    dbname: fennec_alt_data
                    user: fennec_data
                    password: fennec_data
                    charset: UTF8
        orm:
            auto_generate_proxy_classes: '%kernel.debug%'
            entity_managers:
                'userdb':
                    # ...
                'default_data':
                    # ...
                'alternative_data':
                    connection: 'alternative_data'
                    naming_strategy: doctrine.orm.naming_strategy.underscore
                    mappings:
                        AppBundle:
                            dir: '%kernel.project_dir%/src/AppBundle/Entity/Data'
                            type: annotation
                            prefix: 'AppBundle\Entity\Data'

This adds a new database to the existing ``datadb`` docker container.
You can also add another docker container to the ``docker-compose.yml`` file and configure the new database in there.
In order to initialize the new database execute those commands::

    docker-compose restart web
    docker-compose exec web /fennec/bin/console doctrine:database:create --connection alternative_data
    docker-compose exec web /fennec/bin/console doctrine:schema:create --em alternative_data
    docker-compose exec web /fennec/bin/console doctrine:fixtures:load --em alternative_data -n

If your database does not show up in the web interface, double check that you added ``alternative_data`` to the ``versions`` in ``parameters.yml`` and clear the cache as explained above.
From now on when you import data and you want it to end up in the ``alternative_data`` db you have to add ``--em alternative_data`` to the command.
If you do not specify the ``--em`` option the value from ``default_data_entity_manager`` in ``parameters.yml`` will be used.

Backup
------

If you followed the setup above all fennec related data is on the host in the ``fennec`` directory.
You should regularly create backup copies of this directory.
However, you might want to additionally create dumps from the databases for easy import into other instances.
To backup the databases just execute the following commands (repeat for all additional data databases)::

    mkdir -p backup
    docker-compose exec userdb pg_dump -U fennec_user --data-only --no-owner fennec_user | xz >backup/fennec_user.$(date +%F_%T).sql.xz
    docker-compose exec datadb pg_dump -U fennec_data --data-only --no-owner fennec_data | xz >backup/fennec_data.$(date +%F_%T).sql.xz
    # docker-compose exec datadb pg_dump -U fennec_data --data-only --no-owner fennec_alt_data | xz >backup/fennec_alt_data.$(date +%F_%T).sql.xz

.. _import-db-reference-label:

Import database from dump
-------------------------

In order to import a database dump follow this steps (assuming you want to remove all old data before importing).
You might want to do this in the ``alternative_data`` database (see above) instead of ``default_data``::

    docker-compose exec web /fennec/bin/console doctrine:database:drop --force --connection default_data
    docker-compose exec web /fennec/bin/console doctrine:database:create --connection default_data
    docker-compose exec web /fennec/bin/console doctrine:schema:create --em default_data
    # do not load fixtures otherwise there will be unique constraint violations
    # replace the backup filename with an existing one
    xzcat fennec_default_data.sql.xz | docker-compose exec -T datadb psql -U fennec_data -d fennec_data

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
