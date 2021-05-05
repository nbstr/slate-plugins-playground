import { InsertNodesOptions } from '@udecode/slate-plugins-common';
import { SlatePluginOptions } from '@udecode/slate-plugins-core';
export interface WithCodeBlockOptions {
}
export interface CodeBlockInsertOptions extends Pick<SlatePluginOptions, 'defaultType'> {
    level?: number;
    insertNodesOptions?: Omit<InsertNodesOptions, 'match'>;
}
//# sourceMappingURL=types.d.ts.map