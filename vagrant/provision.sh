#!/bin/bash

# Add proper LC_CTYPE export to .bashrc
if ! grep -q "export LC_CTYPE=en_US\.UTF-8" ~/.bashrc; then
  printf 'export LC_CTYPE=en_US.UTF-8\n' >> ~/.bashrc
fi

# And set it to proper value for current shell session
export LC_CTYPE=en_US.UTF-8

sudo apt-get update
sudo apt-get -y install php5-cli imagemagick libmagickwand-dev libcurl3 libcurl3-gnutls libcurl4-openssl-dev

# GPG key for RVM installation
gpg --keyserver hkp://pool.sks-keyservers.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3

echo "Getting rvm"
curl -sSL https://get.rvm.io | bash -s stable
source ~/.profile
rvm install ruby-2.1.2

gem install bundler

cd jekyll-softwaremill
bundle

cd __generators
bundle