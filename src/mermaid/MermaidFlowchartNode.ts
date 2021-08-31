// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { MermaidFlowchartNodeConfig } from './MermaidFlowchartNodeConfig';
import { MermaidFlowchartNodeShape } from './MermaidFlowchartNodeShape';

export class MermaidFlowchartNode {
  constructor(id: string, config: MermaidFlowchartNodeConfig) {
    this.id = id;
    this.config = config;
  }

  public readonly id: string;
  public readonly config: MermaidFlowchartNodeConfig;

  renderNodeDefinition(): string {
    let startTitleCharacter: string;
    let endTitleCharacter: string;
    switch (this.config.shape) {
      case MermaidFlowchartNodeShape.Rectangle:
        startTitleCharacter = '[';
        endTitleCharacter = ']';
        break;
      case MermaidFlowchartNodeShape.Diamond:
        startTitleCharacter = '{';
        endTitleCharacter = '}';
        break;
      default:
        throw Error(`unknown node shape: ${this.config.shape}`);
    }

    const nodeLine = `${this.id}${startTitleCharacter}${this.config.displayText}${endTitleCharacter}`;
    return nodeLine;
  }

  renderNodeStyle(): string | null {
    if (this.config.fillColor === null) {
      return null;
    }

    return `style ${this.id} fill:${this.config.fillColor}`;
  }
}
