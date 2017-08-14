FROM php:7.1-apache
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb http://dl.yarnpkg.com/debian/ stable main" > /etc/apt/sources.list.d/yarn.list
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get update \
&& apt-get install -yq nodejs git postgresql-client libpq-dev unzip vim libdbd-pg-perl liblog-log4perl-perl yarn\
&& rm -rf /var/lib/apt/lists/* \
&& docker-php-ext-install pdo pdo_pgsql zip \
&& a2enmod rewrite \
&& docker-php-source delete
RUN git clone --branch develop --recursive https://github.com/molbiodiv/fennec /fennec

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
COPY php.ini /usr/local/etc/php/
COPY parameters.yml /fennec/app/config/
RUN cd /fennec; composer install

RUN npm install -g coffeescript
RUN cd /fennec; yarn install
# RUN cd /fennec; ./node_modules/.bin/encore production
RUN cd /fennec; ./node_modules/.bin/encore dev
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