FROM php:7.1-apache
RUN apt-get update \
&& apt-get install -yq git postgresql-client libpq-dev unzip npm vim libdbd-pg-perl liblog-log4perl-perl\
&& rm -rf /var/lib/apt/lists/* \
&& docker-php-ext-install pdo pdo_pgsql \
&& a2enmod rewrite \
&& docker-php-source delete
RUN git clone --recursive https://github.com/molbiodiv/fennec /fennec

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
COPY php.ini /usr/local/etc/php/
COPY parameters.yml /fennec/app/config/
RUN cd /fennec; composer install

RUN ln -s /usr/bin/nodejs /usr/bin/node
RUN npm install -g bower
RUN npm install -g coffeescript
RUN cd /fennec; npm install
# RUN cd /fennec; ./node_modules/.bin/encore production
RUN cd /fennec; ./node_modules/.bin/encore dev
RUN cd /fennec; bower install --allow-root
RUN cd /fennec/web/assets/Phinch; coffee -o scripts src

RUN rm -rf /var/www/html && ln -fs /fennec/web /var/www/html
RUN chown -R www-data:www-data /fennec/var

# Install biom tools
RUN curl -sS https://repo.continuum.io/miniconda/Miniconda3-latest-Linux-x86_64.sh >miniconda.sh
RUN chmod +x miniconda.sh
RUN ./miniconda.sh -b -f -p /usr/local
RUN echo "export LC_ALL=C.UTF-8" >>/etc/apache2/envvars
RUN echo "export LANG=C.UTF-8" >>/etc/apache2/envvars
RUN git clone https://github.com/molbiodiv/biom-conversion-server.git /tmp/biomcs
RUN cd /tmp/biomcs && conda install --yes --file explicit-conda-spec.txt