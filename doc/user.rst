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

For more details about mapping see the section in the tutorial TODO:ref
TODO:add_screenshot