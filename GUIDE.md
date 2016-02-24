## The Pmteor Guide

* [Installing Basic](#install-basic)
* [Installing from Source](#install-manually-from-source)

## Installing Basic

    curl install.pmteor.com | sh

or other `versions`
    
    curl install.pmteor.com/release/x.x.x | sh

## Manual Installation Steps

### Install Node.js

Make sure Node.js is installed (currently Version 0.12.XX is required). If you don't have this version, you can use the [node packages][node-packages].

### Install MongoDB
In order to run Pmteor you need to have MongoDB installed. You can either install your distributions package, if they offer any or see the [MongoDB website][mongodb-website] how to install it.

### Install a Pmteor release
Now you need to download the release you want to install, usually this is the latest release which you can find [here][latest-release] (you need the `.tar.gz` one).

Extract it:

```sh
tar xzvf pmteor-VERSION.tar.gz
```

Now go back to the base Pmteor bundle directory:

```sh
cd ../../
```

Now we just need to make some settings through env variables:

```sh
export MONGO_URL='mongodb://127.0.0.1:27017/pmteor'
export ROOT_URL='https://example.com'
export ADMIN='user:pass@domain.com'
export BUNDLE_DIR='~/bundles'
export PORT=8080
```

Now you are ready to run:

```sh
node main.js
```

## Install manually from Source
This is the most complex way, suitable if you know what you are doing and want to have the most flexibility to adapt the installation to your needs. Let's go!

### Install Node.js
If you haven't already, you need to install Node.js, given that we need node version 0.10.40, make sure to either use the [custom packages][node-packages] (the ones of your OS are likely too old) or install the correct version from the Node.js [website][node-web].

### Install Meteor
As you might have noticed already, Pmteor is built using the Meteor web framework, so we need to install this as well. This can be done easily using their install script ([read it][meteor-script] if you don't trust it):

```sh
# This will install Meteor to ~/.meteor
curl https://install.meteor.com/ | sh
```

### Install MongoDB

In order to run Pmteor you need to have MongoDB installed. You can either install your distributions package, if they offer any or see the [MongoDB website][mongodb-website] how to install it.

### Download and build Pmteor
First we need to get the latest version of Pmteor and change to the cloned folder:

```sh
git clone https://github.com/pmteor/pmteor.git && cd pmteor
```

Now we need to build the meteor app:

```sh
meteor build .build --directory
```

We use `.build` here, as it will be ignored by meteor on subsequent builds, you can as well use a directory outside the pmteor folder.

Now we need to cd into the build server folder and install some dependencies:

```sh
cd .build/bundle/programs/server/ && sudo npm install
```

Now we need to set some environment variables:

```sh
export MONGO_URL='mongodb://127.0.0.1:27017/pmteor'
export ROOT_URL='https://example.com'
export ADMIN='user:pass@domain.com'
export BUNDLE_DIR='~/bundles'
export PORT=8080
```

Most of them should be self-explaining. After having set the variables, let's move back to the build package folder and start the server:

```sh
cd ../../../
node main.js
```

Done!

[node-packages]: https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager
[node-web]: https://nodejs.org/download
[meteor-script]: https://install.meteor.com/
[mongodb-website]: https://www.mongodb.org/downloads
[latest-release]: https://github.com/pmteor/pmteor/releases/latest
