#!/usr/bin/env node

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import process from 'process';

import args from 'args';

import { CloudFormationGraph } from '../src/CloudFormationGraph';
import * as mermaid from '../src/mermaid';

args
  .option(
    'profile',
    "The AWS CLI named profile to use. If available, 'AWS_PROFILE' environment variable is used.",
    'default'
  )
  .option('region', 'The AWS region to use.', 'us-east-1')
  .option('output', 'Output file name', 'cfn-stacks-graph')
  .option('format', 'Output file format. Should be pdf, png or svg.', 'pdf');

process.on('unhandledRejection', (err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(-1);
});

(async () => {
  const flags = args.parse(process.argv);
  const profile: string =
    flags.profile === 'default'
      ? process.env.AWS_PROFILE || 'default'
      : flags.profile;
  const region: string = flags.region;

  const extension = ['pdf', 'png', 'svg'].includes(flags.format.toLowerCase())
    ? flags.format.toLowerCase()
    : 'pdf';

  const stacksGraphOutput = `${flags.output}.${extension}`;

  const graph = new CloudFormationGraph();
  const config = await graph.query(profile, region);

  console.log('Rendering...');
  const renderer = new mermaid.MermaidRenderer();
  await renderer.render(config, stacksGraphOutput);

  console.log('See output files: ');
  console.log(stacksGraphOutput);

  await renderer.cleanIntermediateFiles();

  process.exit(0);
})();
