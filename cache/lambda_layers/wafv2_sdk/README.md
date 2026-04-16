# WAFv2 SDK Lambda Layer

This Lambda layer provides the AWS SDK v3 WAFv2 client (`@aws-sdk/client-wafv2`) for use in Lambda functions.

The WAFv2 client allows programmatic interaction with AWS Web Application Firewall v2, including reading and updating IP sets. Node.js 24 Lambda runtime doesn't include AWS SDK v3 by default, so this layer packages it separately.

## Building the layer

To update the layer dependencies:

```bash
cd lambda_layers/wafv2_sdk/nodejs
npm install --production
```

The Terraform configuration will automatically zip the nodejs directory (including node_modules) and deploy the layer.

## Usage

Reference the layer ARN in your Lambda function configuration. The layer makes `@aws-sdk/client-wafv2` available via `require('@aws-sdk/client-wafv2')`.
