import { InsertNodesOptions } from '@udecode/slate-plugins-common';
import { SPEditor } from '@udecode/slate-plugins-core';
/**
 * Insert a code block: set the node to code line and wrap it with a code block.
 * If the cursor is not at the block start, insert break before.
 */
export declare const insertCodeBlock: (editor: SPEditor, insertNodesOptions?: Omit<InsertNodesOptions, 'match'>) => void;
//# sourceMappingURL=insertCodeBlock.d.ts.map