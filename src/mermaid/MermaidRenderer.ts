// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

import { MermaidConfig } from './MermaidConfig';

export class MermaidRenderer {
  private static TempMermaidDefinitionFilePath = path.join(
    '.',
    'cfn-stacks-graph.mmd'
  );

  render(mermaidConfig: MermaidConfig, outputFilePath: string): void {
    fs.writeFileSync(
      MermaidRenderer.TempMermaidDefinitionFilePath,
      mermaidConfig.code,
      {
        encoding: 'ascii'
      }
    );

    const configFilePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'mermaidRenderConfig.json'
    );
    const mermaidCli = path.join('.', 'node_modules', '.bin', 'mmdc');
    execSync(
      `${mermaidCli} --input '${MermaidRenderer.TempMermaidDefinitionFilePath}' --output '${outputFilePath}' --pdfFit --configFile='${configFilePath}'`,
      { stdio: 'inherit' }
    );
  }

  cleanIntermediateFiles(): void {
    fs.unlinkSync(MermaidRenderer.TempMermaidDefinitionFilePath);
  }
}
