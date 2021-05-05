import {
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  ELEMENT_LI,
  ELEMENT_OL,
  ELEMENT_TODO_LI,
  ELEMENT_UL,
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  toggleList,
  unwrapList,
  createSlatePluginsOptions
} from "@udecode/slate-plugins";

import {
  ELEMENT_CODE_BLOCK,
  insertCodeBlock
} from "../../Lib/code-block/src";

import {
  ELEMENT_BLOCKQUOTE,
  insertBlockquote
} from "../../Lib/block-quote-md/src";

const options = createSlatePluginsOptions();

const preFormat = editor => unwrapList(editor);

export const optionsAutoformat = {
  rules: [
    {
      type: options[ELEMENT_H1].type,
      markup: "#",
      preFormat
    },
    {
      type: options[ELEMENT_H2].type,
      markup: "##",
      preFormat
    },
    {
      type: options[ELEMENT_H3].type,
      markup: "###",
      preFormat
    },
    {
      type: options[ELEMENT_H4].type,
      markup: "####",
      preFormat
    },
    {
      type: options[ELEMENT_H5].type,
      markup: "#####",
      preFormat
    },
    {
      type: options[ELEMENT_H6].type,
      markup: "######",
      preFormat
    },
    {
      type: options[ELEMENT_LI].type,
      markup: ["*", "-"],
      preFormat,
      format: editor => {
        toggleList(editor, { type: options[ELEMENT_UL].type });
      }
    },
    {
      type: options[ELEMENT_LI].type,
      markup: ["1.", "1)"],
      preFormat,
      format: editor => {
        toggleList(editor, { type: options[ELEMENT_OL].type });
      }
    },
    {
      type: options[ELEMENT_TODO_LI].type,
      markup: ["[]"]
    },
    {
      type: options[ELEMENT_BLOCKQUOTE].type,
      markup: [">"],
      preFormat,
      triggerAtBlockStart: false,
      format: editor => {
        insertBlockquote(editor, { select: true });
      }
    },
    {
      type: options[MARK_BOLD].type,
      between: ["**", "**"],
      mode: "inline",
      insertTrigger: true
    },
    {
      type: options[MARK_BOLD].type,
      between: ["__", "__"],
      mode: "inline",
      insertTrigger: true
    },
    {
      type: options[MARK_ITALIC].type,
      between: ["*", "*"],
      mode: "inline",
      insertTrigger: true
    },
    {
      type: options[MARK_ITALIC].type,
      between: ["_", "_"],
      mode: "inline",
      insertTrigger: true
    },
    {
      type: options[MARK_CODE].type,
      between: ["`", "`"],
      mode: "inline",
      insertTrigger: true
    },
    {
      type: options[MARK_STRIKETHROUGH].type,
      between: ["~~", "~~"],
      mode: "inline",
      insertTrigger: true
    },
    {
      type: options[ELEMENT_CODE_BLOCK].type,
      markup: "``",
      trigger: "`",
      triggerAtBlockStart: false,
      preFormat,
      format: editor => {
        insertCodeBlock(editor, { select: true });
      }
    }
  ]
};
