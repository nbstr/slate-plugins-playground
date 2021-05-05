import { ELEMENT_BLOCKQUOTE, ELEMENT_BLOCKQUOTE_LINE } from "../defaults";

let slatePluginsCommon = require("@udecode/slate-plugins-common");
let slatePluginsCore = require("@udecode/slate-plugins-core");

export const insertBlockquote = (editor, insertNodesOptions = {}) => {
  if (!editor.selection || slatePluginsCommon.isExpanded(editor.selection))
    return;

  const matchBlockquoteElements = node =>
    node.type ===
      slatePluginsCore.getSlatePluginType(editor, ELEMENT_BLOCKQUOTE) ||
    node.type ===
      slatePluginsCore.getSlatePluginType(editor, ELEMENT_BLOCKQUOTE_LINE);

  if (
    slatePluginsCommon.someNode(editor, {
      match: matchBlockquoteElements
    })
  ) {
    return;
  }

  if (!slatePluginsCommon.isSelectionAtBlockStart(editor)) {
    editor.insertBreak();
  }

  slatePluginsCommon.setNodes(
    editor,
    {
      type: slatePluginsCore.getSlatePluginType(
        editor,
        ELEMENT_BLOCKQUOTE_LINE
      ),
      children: [
        {
          text: ""
        }
      ]
    },
    insertNodesOptions
  );
  slatePluginsCommon.wrapNodes(
    editor,
    {
      type: slatePluginsCore.getSlatePluginType(editor, ELEMENT_BLOCKQUOTE),
      children: []
    },
    insertNodesOptions
  );
};
