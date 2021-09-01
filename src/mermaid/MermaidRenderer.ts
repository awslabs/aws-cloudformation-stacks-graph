// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { execSync } from 'child_process';
import fs from 'fs';

import { MermaidConfig } from './MermaidConfig';

export class MermaidRenderer {
  private static TempMermaidDefinitionFilePath = './cfn-stacks-graph.mmd';

  render(mermaidConfig: MermaidConfig, outputFilePath: string): void {
    fs.writeFileSync(
      MermaidRenderer.TempMermaidDefinitionFilePath,
      mermaidConfig.code,
      {
        encoding: 'ascii'
      }
    );

    execSync(
      `npx @mermaid-js/mermaid-cli --input '${MermaidRenderer.TempMermaidDefinitionFilePath}' --output '${outputFilePath}' --pdfFit --configFile='${__dirname}/../../../mermaidRenderConfig.json'`,
      { stdio: 'inherit' }
    );
  }

  cleanIntermediateFiles(): void {
    fs.unlinkSync(MermaidRenderer.TempMermaidDefinitionFilePath);
  }
}
