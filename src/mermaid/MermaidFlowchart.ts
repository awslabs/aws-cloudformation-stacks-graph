// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { MermaidConfig } from './MermaidConfig';
import { MermaidFlowchartNode } from './MermaidFlowchartNode';
import { MermaidFlowchartNodeConfig } from './MermaidFlowchartNodeConfig';
import { MermaidFlowchartRelationship } from './MermaidFlowchartRelationship';

export class MermaidFlowchart {
  private _nodes: Map<string, MermaidFlowchartNode>;
  private _relationships: Array<MermaidFlowchartRelationship>;

  constructor() {
    this._nodes = new Map<string, MermaidFlowchartNode>();
    this._relationships = new Array<MermaidFlowchartRelationship>();
  }

  addNode(
    id: string,
    config: MermaidFlowchartNodeConfig
  ): MermaidFlowchartNode {
    const nodeExists = this.getNode(id);
    if (nodeExists !== null) {
      throw new Error(`node with id ${id} already exists`);
    }

    const node = new MermaidFlowchartNode(id, config);
    this._nodes.set(id, node);
    return node;
  }

  hasRelationship(
    parentNode: MermaidFlowchartNode,
    childNode: MermaidFlowchartNode
  ): boolean {
    const exists = this._relationships.some((r) => {
      if (parentNode.id == r.parent.id && childNode.id == r.child.id) {
        return true;
      }
      return false;
    });
    return exists;
  }

  addRelationship(
    parentNode: MermaidFlowchartNode,
    childNode: MermaidFlowchartNode
  ): void {
    const relationship = new MermaidFlowchartRelationship(
      parentNode,
      childNode
    );
    this._relationships.push(relationship);
  }

  renderMermaidConfig(): MermaidConfig {
    const graphConfig = new Array<string>();

    // Render the nodes themselves
    this._nodes.forEach((node) => {
      const nodeDef = node.renderNodeDefinition();
      graphConfig.push(nodeDef);
    });

    // Render the relationships
    this._relationships.forEach((relationship) => {
      const relationshipDef = relationship.renderRelationship();
      graphConfig.push(relationshipDef);
    });

    // Style the nodes
    this._nodes.forEach((node) => {
      const nodeStyle = node.renderNodeStyle();
      if (nodeStyle != null) {
        graphConfig.push(nodeStyle);
      }
    });

    const indentedConfig = graphConfig.map((line) => `    ${line}`);

    const mermaidCode = Array<string>();
    mermaidCode.push('graph LR');
    mermaidCode.push(...indentedConfig);
    const mermaidCodeText: string = mermaidCode.join('\n');

    const config = {
      code: mermaidCodeText,
      mermaid: {
        theme: 'default'
      },
      updateEditor: false
    };

    return config;
  }

  private getNode(id: string): MermaidFlowchartNode | null {
    const node = this._nodes.get(id);
    if (node) {
      return node;
    }

    return null;
  }
}
