// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as cfn from '@aws-sdk/client-cloudformation';
import { defaultProvider } from '@aws-sdk/credential-provider-node';

import * as mermaid from './mermaid';
import { MermaidFlowchartNodeShape } from './mermaid';

export class CloudFormationGraph {
  async query(profile: string, region: string): Promise<mermaid.MermaidConfig> {
    const client = new cfn.CloudFormationClient({
      credentials: defaultProvider({
        profile: profile
      }),
      region: region
    });

    console.log('Getting Stack Information');
    const summaries = await CloudFormationGraph.getStackSummaries(client);
    console.log('Getting Stack Exports');
    const exports = await CloudFormationGraph.getStackExports(client);
    console.log('Getting Stack Imports');
    const imports = await CloudFormationGraph.getStackImports(client, exports);

    // Minimize the length of the NodeIDs since mermaid has a length limitation
    const stackNodeIds: Map<string, string> = new Map<string, string>();
    summaries.forEach((summary, index) => {
      const nodeId = `S${index}`;
      stackNodeIds.set(summary.StackId, nodeId);
    });

    const nodes: Map<string, mermaid.MermaidFlowchartNode> = new Map<
      string,
      mermaid.MermaidFlowchartNode
    >();

    const flowchart = new mermaid.MermaidFlowchart();
    summaries.forEach((summary) => {
      const nodeId = stackNodeIds.get(summary.StackId);

      const node = flowchart.addNode(nodeId, {
        displayText: summary.StackName,
        fillColor: null,
        shape: MermaidFlowchartNodeShape.Rectangle
      });
      nodes.set(summary.StackId, node);
    });

    // Import/Export Dependencies
    imports.forEach((i) => {
      const parentNode = nodes.get(i.exportingStackId);
      i.importingStackNames.forEach((importingStackName) => {
        const childStack = summaries.find(
          (s) => s.StackName === importingStackName
        );
        if (childStack) {
          const childNode = nodes.get(childStack.StackId);
          // Dont add duplicate relationships
          if (flowchart.hasRelationship(parentNode, childNode) == false) {
            flowchart.addRelationship(parentNode, childNode);
          }
        }
      });
    });

    // Nested Stack dependencies
    summaries.forEach((s) => {
      if (
        s.ParentId !== undefined &&
        s.ParentId !== null &&
        s.ParentId !== ''
      ) {
        if (s.ParentId === s.StackId) {
          // This is the root of the nested stack
          // We do not need to draw a dependency here
          return;
        }

        const parentNode = nodes.get(s.ParentId);
        const childNode = nodes.get(s.StackId);

        console.log(
          `found a nested stack: ${s.StackName} from ${s.StackId} to ${s.ParentId}`
        );

        if (parentNode && childNode) {
          if (flowchart.hasRelationship(parentNode, childNode) == false) {
            flowchart.addRelationship(parentNode, childNode);
          }
        }
      }
    });

    return flowchart.renderMermaidConfig();
  }

  private static async getStackSummaries(
    client: cfn.CloudFormationClient
  ): Promise<Array<cfn.StackSummary>> {
    let nextToken: string = null;
    const summaries: Array<cfn.StackSummary> = new Array<cfn.StackSummary>();
    while (true) {
      const listStacksCommand = new cfn.ListStacksCommand({
        NextToken: nextToken
      });

      const result: cfn.ListStacksOutput = await client.send(listStacksCommand);
      summaries.push(...result.StackSummaries);

      nextToken = result.NextToken;
      if (nextToken == null) {
        break;
      }
    }

    return summaries;
  }

  private static async getStackExports(
    client: cfn.CloudFormationClient
  ): Promise<Array<cfn.Export>> {
    let nextToken: string = null;
    const exports: Array<cfn.Export> = new Array<cfn.Export>();

    while (true) {
      const listExportsCommand = new cfn.ListExportsCommand({
        NextToken: nextToken
      });

      const result: cfn.ListExportsCommandOutput = await client.send(
        listExportsCommand
      );
      exports.push(...result.Exports);

      nextToken = result.NextToken;
      if (nextToken == null) {
        break;
      }
    }

    return exports;
  }

  private static async getStackImports(
    client: cfn.CloudFormationClient,
    exports: Array<cfn.Export>
  ): Promise<Array<StackAssociation>> {
    const associations: Array<StackAssociation> = new Array<StackAssociation>();

    for (let x = 0; x < exports.length; x++) {
      const exp = exports[x];

      const stackNamesUsingExport =
        await CloudFormationGraph.getStackNamesUsingExport(client, exp.Name);

      const association: StackAssociation = new StackAssociation();
      association.exportingStackId = exp.ExportingStackId;
      association.exportingStackName = exp.Name;
      association.importingStackNames = stackNamesUsingExport;
      associations.push(association);
    }

    return associations;
  }

  private static async getStackNamesUsingExport(
    client: cfn.CloudFormationClient,
    exportName: string
  ): Promise<Array<string>> {
    console.log(`Looking for stacks importing: ${exportName}`);
    let nextToken: string = null;
    const stackNamesUsingExport: Array<string> = new Array<string>();

    try {
      while (true) {
        const listImports = new cfn.ListImportsCommand({
          NextToken: nextToken,
          ExportName: exportName
        });

        const response: cfn.ListImportsOutput = await client.send(listImports);
        stackNamesUsingExport.push(...response.Imports);

        nextToken = response.NextToken;
        if (nextToken == null) {
          break;
        }
      }
    } catch (error: unknown) {
      // This throws an error if there are no imports
    }

    return stackNamesUsingExport;
  }
}

class StackAssociation {
  exportingStackId: string;
  exportingStackName: string;
  importingStackNames: Array<string>;
}
