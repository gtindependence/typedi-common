# nestjs-common
In this repo you will find a lot of the base shared code that we will user throughout all of our TypeDI projects. Some of these common modules that we have bundled are:
 - Error Handling Service
 - Redis Service

## Installation
```
npm i @teamhive/typedi-common
```

From there just add whatever you want to import into your Core/Common Modules

## Peer Dependencies
There are several peer dependencies of this project. Once you install this package you will need to follow up and ensure the follow dependencies are installed:

```
npm i type-di config@^3.0 js-yaml@^3.0 log4js@^3.0 raven@^2.0 reflect-metadata@^0.1 rxjs@^6.0
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
    dsn: 'htttps://logger.sentry.io/31'

logger:
    level: 'debug'

redis:
    host: 'localhost'
    keyPrefix: 'app_name_'
    expiration: 86400000 # ms - 24 hours
```

## Available Modules

<!-- TODO: Put actual modules from this repo here -->
### Decorators
There are a few different decorators that we have made available:
#### @TryCatch(error: Error, options?: { customResponseMessage: string } )
This decorator will wrap your whole function into a try/catch and you can pass an optional custom error class for it to throw!

```
    @TryCatch(SqlException)
    async fetchAll() {
        return await this.usersRepository.fetchAll()
    }
```


## Distribution
```
npm pack
npm version (major|minor|patch)
npm publish
```

_Note: This will also automatically push changes and tags post-publish_