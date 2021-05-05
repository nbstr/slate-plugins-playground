import { SPEditor } from '@udecode/slate-plugins-core';
import { Location } from 'slate';
/**
 * If at (default = selection) is in ul>li>p, return li and ul node entries.
 */
export declare const getCodeLineEntry: (editor: SPEditor, { at }?: {
    at?: Location | null | undefined;
}) => {
    codeBlock: import("slate").NodeEntry<import("@udecode/slate-plugins-core").TAncestor<{}>>;
    codeLine: import("slate").NodeEntry<import("@udecode/slate-plugins-core").TAncestor<{}>>;
} | undefined;
//# sourceMappingURL=getCodeLineEntry.d.ts.map