# AWS-Lambda-Helper

Helper library designed to simplify calling AWS lambdas in NodeJS.

## Motivation

I write a lot of lambdas, and in many cases I need call other lambda functions. This library is the result of the effort to wrap a bit of boiler plate code that is needed to do that.

It is specifically designed to be used with other AWS lambda functions, however can be used in any project.

## Usage

### Constructor:

``` js
const Lambda = require('aws-lambda-helper');
const myLambda = new S3(name, qualifier, profile, awsRegion);
```

* name - Name of the bucket that you will be interacting with (required).
* qualifier - qualifier that lambda will be called with (optional).
* profile - profile that will be used to get your AWS credentials. If none provided it will use `AWS.EnvironmentCredentials` with 'AWS' prefix (default in lambda environments) to get credentials (optional)
* awsRegion - region in which your ElasticSearch is located, default: `process.env.AWS_DEFAULT_REGION`. (optional)

### Methods:
Library supports following operations.

#### event
`s3.event(payload)`

Triggers an *Event* style request to the lambda function.

* payload - is the data payload that will be sent to the function. *Important:* lambdas requires a JSON format payload, this method will perform `JSON.stringify` on your payload. 

Returns a promise that will resolve after request was succesfully sent.

#### request

Triggers a *Request* style request to the lambda function.

`s3.request(payload)`

* payload - is the data payload that will be sent to the function. *Important:* lambdas requires a JSON format payload, this method will perform `JSON.stringify` on your payload. 

Returns a promise that will resolve after triggered lambda has executed and responded to your request. Promise will be resolved with the response of the triggered lambda, or with error in case execution error or timeout.

## Example

``` js
exports.handler = (event, context, callback) => {
    const Lambda = require('aws-lambda-helper');
    const myLambda = new Lambda('my-lambda', 'dev');

    myLambda.request({ hello : 'world'}).
    then((text) => console.log(text)).
    then(() => callback()).
    catch((err) => callback(err));
}
```