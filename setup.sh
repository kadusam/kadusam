#!/bin/bash

if [ "${USER}x" != "rootx" ]
then
  echo "you must run as root"
  exit 1
fi

# install td-agent(fluentd)
cat <<EOT >/etc/yum.repos.d/td.repo
[treasuredata]
name=TreasureData
baseurl=http://packages.treasure-data.com/redhat/\$basearch
gpgcheck=0
EOT
yum -y install td-agent

/usr/lib64/fluent/ruby/bin/fluent-gem update fluentd
/usr/lib64/fluent/ruby/bin/fluent-gem update fluent-plugin-mongo
/usr/lib64/fluent/ruby/bin/fluent-gem install bson_ext

# install mongodb
cat <<EOT >/etc/yum.repos.d/10gen.repo
[10gen]
name=10gen Repository
baseurl=http://downloads-distro.mongodb.org/repo/redhat/os/x86_64
gpgcheck=0
EOT
yum -y install mongo-10gen.x86_64 mongo-10gen-server.x86_64

# install node.js
useradd dak
su - dak
git clone git://github.com/creationix/nvm.git ~/.nvm
. ~/.nvm/nvm.sh
nvm install v0.6.10
nvm alias default v0.6.10
exit

