import { SPEditor } from '@udecode/slate-plugins-core';
import { CodeBlockInsertOptions } from '../types';
/**
 * Called by toolbars to make sure a code-block gets inserted below a paragraph
 * rather than awkwardly splitting the current selection.
 */
export declare const insertEmptyCodeBlock: (editor: SPEditor, { defaultType, insertNodesOptions, level, }: CodeBlockInsertOptions) => void;
//# sourceMappingURL=insertEmptyCodeBlock.d.ts.map