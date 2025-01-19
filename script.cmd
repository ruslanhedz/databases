docker-compose build master
docker-compose up -d master

:wait_for_container

timeout /t 15 /nobreak

echo Please enter the root password for master:
set /p masterpassword=

powershell -Command "& { docker exec -it master mysql -u root -p%masterpassword% -e \"show master status;\" }"

echo please check your ./init/slave.sql and make change if there is need
pause

docker-compose build slave
docker-compose up -d slave

timeout /t 15 /nobreak

docker cp ./init/my_cnf.txt master:/etc/

docker exec -it master sh -c "cat /etc/my_cnf.txt > /etc/my.cnf"

docker exec -it master sh -c "touch /etc/mysql/conf.d/ssl.cnf; echo '[mysqld]' >> /etc/mysql/conf.d/ssl.cnf; echo 'ssl-ca = /var/lib/mysql/ca.pem' >> /etc/mysql/conf.d/ssl.cnf; echo 'ssl-cert = /var/lib/mysql/server-cert.pem' >> /etc/mysql/conf.d/ssl.cnf; echo 'ssl-key = /var/lib/mysql/server-key.pem' >> /etc/mysql/conf.d/ssl.cnf; echo 'ssl-cipher = TLSv1.2:!aNULL:!eNULL:!LOW:!EXPORT:!SSLv2:!SSLv3' >> /etc/mysql/conf.d/ssl.cnf; chmod 644 /etc/mysql/conf.d/ssl.cnf"

docker cp ./init/my_cnf.txt slave:/etc/

docker exec -it slave sh -c "cat /etc/my_cnf.txt > /etc/my.cnf"

docker exec -it slave sh -c "touch /etc/mysql/conf.d/ssl.cnf; echo '[mysqld]' >> /etc/mysql/conf.d/ssl.cnf; echo 'ssl-ca = /var/lib/mysql/ca.pem' >> /etc/mysql/conf.d/ssl.cnf; echo 'ssl-cert = /var/lib/mysql/server-cert.pem' >> /etc/mysql/conf.d/ssl.cnf; echo 'ssl-key = /var/lib/mysql/server-key.pem' >> /etc/mysql/conf.d/ssl.cnf; echo 'ssl-cipher = TLSv1.2:!aNULL:!eNULL:!LOW:!EXPORT:!SSLv2:!SSLv3' >> /etc/mysql/conf.d/ssl.cnf; chmod 644 /etc/mysql/conf.d/ssl.cnf"

docker restart master slave

del ./init/certs/master/ca.pem
docker cp master:/var/lib/mysql/ca.pem ./init/certs/master/

del ./init/certs/slave/ca.pem
docker cp slave:/var/lib/mysql/ca.pem ./init/certs/slave/

powershell -Command "& { docker exec -it master mysql -u root -p%masterpassword% -e \"CREATE DATABASE Project_database; GRANT ALL PRIVILEGES ON `Project_database`.* TO 'user'@'%%'; flush privileges;\" }"

echo Please enter the root password for slave:
set /p slavepassword=

powershell -Command "& { docker exec -it slave mysql -u root -p%slavepassword% -e \"GRANT ALL PRIVILEGES ON `Project_database`.* TO 'user'@'%%'; flush privileges;\" }"

pause

docker-compose up -d minio mc

docker-compose up -d backup

docker cp ./init/certs/master/ca.pem backup:/

powershell -Command "& { docker exec -it backup sh -c 'apk add --no-cache mysql-client openssl curl && curl https://dl.min.io/client/mc/release/linux-arm64/mc --create-dirs -o ~/minio-binaries/mc && chmod +x ~/minio-binaries/mc && export PATH=$PATH:~/minio-binaries' }"

docker restart backup

pause

