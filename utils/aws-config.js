const AWS = require('aws-sdk');
const { AWS_DATA } = require('./config');

const {
  AWS_ACCESS_KEY_ID: accessKeyId,
  AWS_SECRET_ACCESS_KEY: secretAccessKey,
  AWS_BUCKET_NAME: bucketName,
  AWS_REGION: region,
} = AWS_DATA;

AWS.config.update({
  accessKeyId,
  secretAccessKey,
  region,
});

module.exports = new AWS.S3({ params: { Bucket: bucketName } });
