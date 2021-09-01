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

    const appInstallFolder = path.join(__dirname, '..', '..', '..');
    const configFilePath = path.join(
      appInstallFolder,
      'mermaidRenderConfig.json'
    );
    const mermaidCli = path.join(
      appInstallFolder,
      'node_modules',
      '.bin',
      'mmdc'
    );
    execSync(
      `${mermaidCli} --input '${MermaidRenderer.TempMermaidDefinitionFilePath}' --output '${outputFilePath}' --pdfFit --configFile='${configFilePath}'`,
      { stdio: 'inherit' }
    );
  }

  cleanIntermediateFiles(): void {
    fs.unlinkSync(MermaidRenderer.TempMermaidDefinitionFilePath);
  }
}
