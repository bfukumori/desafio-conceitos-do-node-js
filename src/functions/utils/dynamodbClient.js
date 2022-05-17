const { DynamoDB } = require('aws-sdk');

const options = {
  region: 'localhost',
  endpoint: 'http://localhost:8000'
}

module.exports.document = new DynamoDB.DocumentClient(options);