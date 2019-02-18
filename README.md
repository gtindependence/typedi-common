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

email:
    noReplyEmailAddress: 'dev@meetmaestro.com'
    sendTo: ['placeholder@placeholder.com']
    send: true
    sendgrid:
        apiKey: 'PLACEHOLDER'
```

### Email Templates
In addtion to the email configuration above, you will need to have your email templates and resources in an `emails` folder at the root level of your project. The `emails` folder should have all template folders inside of it as well as a `shared` folder. The `shared` folder is where email-templates will look for any css files or assets that your email templates reference. Each template folder should have an `html.pug` file for the body of the email and a `subject.pug` file for the subject.
```
.
+-- emails
|   +-- sample-template
|   |   +-- html.pug
|   |   +-- subject.pug
|   +-- shared
|   |   +-- css
|   |   |   +-- main.css
|   |   +-- images
|   |   |   +-- sample.jpg
```

## Available Modules

### Providers
There are a few different providers that we have made available:
#### EmailProvider
The email provider is configured based off of your projects `email` configuration object. You can inject it into your email service and then using it is as simple as the example below. The `send` method will return a boolean indicating if the email was successfully sent and automatically will have it's errors handled by the `ErrorHandler` service. If you want to handle any thrown error at the project level, the second parameter of the `send` method is a boolean `handleErrors` that can be set to `false`.

```
async sendExampleEmail(user: User) {
        return await this.email.send({
            message: {
                to: user.email
            },
            template: 'sample-template',
            locals: {
                // variables to pass into email
            }
        });
    }
```

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