# typedi-common
In this repo you will find a lot of the base shared code that we will user throughout all of our TypeDI projects. Some of these common modules that we have bundled are:
 - Error Handling Service
 - Email Provider

## Installation
```
npm i @teamhive/typedi-common
```

## Peer Dependencies
There are several peer dependencies of this project. Once you install this package you will need to follow up and ensure the follow dependencies are installed:
```
npm i config@^3.0 email-templates@^5.0 js-yaml@^3.0 log4js@^4.0 pug@^2.0 nodemailer@^5.0 nodemailer-sendgrid@^1.0 raven@^2.0 reflect-metadata@^0.1 typedi^0.8
```

## Dev Dependencies
There are also a few dev dependencies that you may want to add in order for typescript to compile correctly:
```
npm i --save-dev @types/config @types/raven
```

## Configurations
There are several configurations that we use throughout our projects. Some of them are required by this package. Here is what you should add into the default config file (https://www.npmjs.com/package/config)
```
raven:
    dsn: 'https://logger.sentry.io/31'

logger:
    level: 'debug'
```

## Available Modules

### Services
There are a few different services that we have made avaialable:
#### ErrorHandler
The ErrorHandler service is configured to send your error to Sentry through Raven. Make sure you have a configuration for raven in your project. There are three methods available: `captureMessage`, `captureBreadcrum`, and `captureException`. All of these methods will log to console during development and report to Sentry when deployed. 
```
async putFiles() {
    try {
        await this.sftp.connect(...);

        this.errorHandler.captureBreadcrumb({ message: 'CONNECTED to server' });
        this.errorHandler.captureBreadcrumb({ message: 'Putting files...' });

        await this.sftp.put(...);

        await this.sftp.end();
        this.errorHandler.captureBreadcrumb({ message: 'ENDED CONNECTION to server' });
    }
    catch (error) {
        this.errorHandler.captureException(error);
    }
}
```


## Distribution
```
npm pack
npm version (major|minor|patch)
npm publish
```

_Note: This will also automatically push changes and tags post-publish_