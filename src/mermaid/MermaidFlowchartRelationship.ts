// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { MermaidFlowchartNode } from './MermaidFlowchartNode';

export class MermaidFlowchartRelationship {
  constructor(parent: MermaidFlowchartNode, child: MermaidFlowchartNode) {
    this.parent = parent;
    this.child = child;
  }

  public readonly parent: MermaidFlowchartNode;
  public readonly child: MermaidFlowchartNode;

  renderRelationship(): string {
    return `${this.parent.id} --> ${this.child.id}`;
  }
}
