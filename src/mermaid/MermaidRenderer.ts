// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import child_process from 'child_process';
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

    child_process.execSync(
      `npx mmdc --input '${MermaidRenderer.TempMermaidDefinitionFilePath}' --output '${outputFilePath}' --pdfFit --configFile='./mermaidRenderConfig.json'`
    );
  }

  cleanIntermediateFiles(): void {
    fs.unlinkSync(MermaidRenderer.TempMermaidDefinitionFilePath);
  }
}
