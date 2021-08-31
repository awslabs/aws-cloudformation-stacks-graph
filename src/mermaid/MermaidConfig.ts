// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { MermaidConfigSettings } from './MermaidConfigSettings';

export interface MermaidConfig {
  code: string;
  mermaid: MermaidConfigSettings;
  updateEditor: boolean;
}
