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

