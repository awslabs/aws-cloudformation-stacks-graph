// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { MermaidFlowchartNodeShape } from './MermaidFlowchartNodeShape';

export class MermaidFlowchartNodeConfig {
  displayText: string;
  fillColor: string = null;
  shape: MermaidFlowchartNodeShape = MermaidFlowchartNodeShape.Rectangle;
}
