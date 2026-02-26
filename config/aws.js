/**
 * ZeroV2 — Secure Team Storage
 * Copyright (c) 2026 Pawan Yadav (github.com/Pawan947)
 * Licensed under the MIT License. See LICENSE for details.
 */

const AWS = require("aws-sdk");
require("dotenv").config();

const s3 = new AWS.S3({
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION,
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    s3ForcePathStyle: false,
    signatureVersion: 'v4',
});

const BUCKET = process.env.S3_BUCKET;

module.exports = { s3, BUCKET };
