.. user:
.. _user:

User manual
===========

Quick start
-----------

To learn the main features of Fennec from a user perspective navigate your webbrowser to the public instance at https://fennec.molecular.eco
The first thing you see is the startpage

.. image:: screenshots/startpage.png

The boxes show the number of organisms and trait entries in the current database.
You can explore the organisms and traits in the database by using the navigation on the left hand side.
However, in order to analyze projects it is necessary to log in (in the top right corner).
You can login using your GitHub or Google account.
Some instances also provide a demo user (look on the page for information).

After login navigate to projects.
If it is your first login the project table will be empty.
Otherwise your projects show up here.
To upload a new project in biom format just click the ``Browse`` Button and select the file.

.. image:: screenshots/projects.png

Details on file formats are available in the "Import Project" section TODO:ref
Upload this `demo biom file <https://raw.githubusercontent.com/molbiodiv/fennec/master/doc/beta/J.biom>`_ to follow along the tutorial.
It consists of 446 samples of pollen with a total of 1002 OTUs.

To get to the project page click on the link in the first column of the project table `No Table ID`.
This will bring you to the project details page.

.. image:: screenshots/project_details.png

Basic information about the project is displayed in the table.
However, when you navigate on the traits tab you'll see empty tables.
This is because the organisms in the project are not mapped to entities in the database, yet.
So head to the mapping tab and select:

Map ``OTUs`` by ``ncbi_taxid`` on ``NCBI taxid`` and click ``GO``.

The result of the mapping will be displayed below where a click on ``Save in database`` will make this mapping persistent.
For more details about mapping see the section in the tutorial TODO:ref

.. image:: screenshots/project_mapping.png

Now that the OTUs are mapped to organisms in the database switching to the ``Traits`` tab will show available traits.
By clicking on the icon in the details column for a trait (e.g. ``Plant Habit``) you come to a page summarizing the trait values in this community.
On this page trait values of all species present in any of the samples are summarized (without taking abundance into account).
The trait values can be added to the project either via the ``Add trait to OTU metadata`` button on this page or the ``+`` icon in the trait table.

.. image:: screenshots/project_traits.png

Finally it is possible to interactively explore the trait values by navigating to the ``Inspect with Phinch`` tab.
The first screen on this tab is the filter page which you can leave via the ``Proceed To Gallery`` button in the top right corner.
You can select any of the visualizations.
Taxonomy is derived from your original biom file and not altered by Fennec.
The traits you added can be selected in the top right corner of each visualization (except in the Sankey Diagram).

.. image:: screenshots/project_phinch.png

Download of the enriched community data is possible in different formats via the ``Project overview`` tab.