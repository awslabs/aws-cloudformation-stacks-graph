# aws-cloudformation-stacks-graph

Generate a network diagram of the CloudFormation stacks using the import/export dependencies that exist amongst them.

This helps to visualize the dependency complexity between various stacks in an application and the shows the deployment order for these stacks.

### Usage

1. Install the application

```shell
npm install --global aws-cloudformation-stacks-graph
```

2. Run the application against all stacks in a given AWS account and region

```shell
cfn-stacks-graph --profile="profile" --region="your-region"
```

### Parameters

#### `--profile <profile-name>`

The AWS CLI named profile to use. If available, `AWS_PROFILE` environment variable is used if this parameter is not specified, otherwise uses 'default'.

#### `--region <region>`

The AWS region to use. Uses `us-east-1` if this parameter is not specified.

#### `--output <file-name>`

Output file name to use. Uses 'cfn-stacks-graph' if this parameter is not specified.

#### `--format <file-format>`

Output file format to use - should be 'pdf', 'png', or 'svg'. Uses 'pdf' if this parameter is invalid or not specified.

### Technical Notes

This uses the Mermaid-JS (https://mermaid-js.github.io/) library /
Mermaid-CLI (https://github.com/mermaidjs/mermaid.cli) to render the graph of the information.

The AWS SDKv3 for Javascript is used to gather the stack information.

An intermediate file named `cfn-stacks-graph.mmd` will be generated as part of running this application. This is the
config file leveraged by mermaid to render the actual graph

### IAM Permissions Needed

A policy attached to your role must have the following minimum permissions:

```json
{
  "Effect": "Allow",
  "Action": [
    "cloudformation:ListExports",
    "cloudformation:ListImports",
    "cloudformation:ListStacks"
  ],
  "Resource": "*"
}
```

### Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

### License

This project is licensed under the Apache-2.0 License.
