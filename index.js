'use strict';

const AWS = require('aws-sdk');
const Q = require('q');

class Lambda {
  constructor(fnName, qualifier, profile, awsRegion) {
    const region = awsRegion || process.env.AWS_DEFAULT_REGION;
    const config = {
      region,
    };

    if (profile) {
      const SharedIniFileCredentials = AWS.SharedIniFileCredentials;
      config.credentials = new SharedIniFileCredentials({
        profile,
      });
    }

    this.qualifier = qualifier;
    this.fnName = fnName;
  }

  event(payload) {
    return this._lambdaCall('Event', payload);
  }

  request(payload) {
    return this._lambdaCall('RequestResponse', payload);
  }

  _lambdaCall(type, payload) {
    const deferred = Q.defer();
    const params = {
      FunctionName: this.fnName,
      InvocationType: type,
      Qualifier: this.qualifier,
      Payload: JSON.stringify(payload),
    };

    const lambda = new AWS.Lambda(this.config);
    lambda.invoke(params, (err, data) => {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(data);
      }
    });

    return deferred.promise;
  }
}

module.exports = Lambda;
