FROM mysql:8.3

COPY my.cnf /etc/mysql/conf.d/my.cnf

COPY schema.sql /docker-entrypoint-initdb.d/
