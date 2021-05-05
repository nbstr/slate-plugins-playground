import { getSlatePluginOptions, isElement, getSlateClass, getSlatePluginType, getRenderElement } from '@udecode/slate-plugins-core';
import { languages, tokenize } from 'prismjs';
import { Node, Editor, Transforms, Path } from 'slate';
import { getElementDeserializer, someNode, getParent, getAbove, getNodes, isExpanded, getText, insertNodes, isSelectionAtBlockStart, setNodes, wrapNodes, ELEMENT_DEFAULT, isBlockAboveEmpty, unwrapNodes } from '@udecode/slate-plugins-common';
import * as React from 'react';

const ELEMENT_CODE_BLOCK = 'code_block';
const ELEMENT_CODE_LINE = 'code_line';
const KEYS_CODE_BLOCK = [ELEMENT_CODE_BLOCK, ELEMENT_CODE_LINE];
const DEFAULTS_CODE_BLOCK = {
  hotkey: ['mod+opt+8', 'mod+shift+8']
}; // `
// javascript:
// abap: ABAP
// arduino: Arduino
// bash: Bash
// basic: BASIC
// c: C
// clojure: Clojure
// coffeescript: CoffeeScript
// cpp: C++
// csharp: C#
// css: CSS
// dart: Dart
// diff: Diff
// docker: Docker
// elixir: Elixir
// elm: Elm
// erlang: Erlang
// flow: Flow
// fortran: Fortran
// fsharp: F#
// gherkin: Gherkin
// glsl: GLSL
// go: Go
// graphql: GraphQL
// groovy: Groovy
// haskell
// less
// livescript
// lua
// makefile
// markup
// matlab
// nix
// objectivec
// ocaml
// pascal
// perl
// prolog
// purebasic
// r
// reason
// scss
// scala
// scheme
// sql
// swift
// vbnet
// verilog
// vhdl
// visual-basic
// wasm
// `;

const CODE_BLOCK_LANGUAGES = {
  antlr4: 'ANTLR4',
  bash: 'Bash',
  c: 'C',
  csharp: 'C#',
  css: 'CSS',
  coffeescript: 'CoffeeScript',
  cmake: 'CMake',
  django: 'Django',
  docker: 'Docker',
  ejs: 'EJS',
  erlang: 'Erlang',
  git: 'Git',
  go: 'Go',
  graphql: 'GraphQL',
  groovy: 'Groovy',
  html: 'HTML',
  java: 'Java',
  javascript: 'JavaScript',
  json: 'JSON',
  kotlin: 'Kotlin',
  latex: 'LaTeX',
  less: 'Less',
  lua: 'Lua',
  makefile: 'Makefile',
  markdown: 'Markdown',
  matlab: 'MATLAB',
  markup: 'Markup',
  objectivec: 'Objective-C',
  perl: 'Perl',
  php: 'PHP',
  powershell: 'PowerShell',
  properties: '.properties',
  protobuf: 'Protocol Buffers',
  python: 'Python',
  r: 'R',
  jsx: 'React JSX',
  tsx: 'React TSX',
  ruby: 'Ruby',
  sass: 'Sass (Sass)',
  scss: 'Sass (Scss)',
  scala: 'Scala',
  scheme: 'Scheme',
  sql: 'SQL',
  shell: 'Shell',
  swift: 'Swift',
  svg: 'SVG',
  typescript: 'TypeScript',
  wasm: 'WebAssembly',
  yaml: 'YAML',
  xml: 'XML'
};

// import 'prismjs/components/prism-antlr4';
const getCodeBlockDecorate = () => editor => {
  const code_block = getSlatePluginOptions(editor, ELEMENT_CODE_BLOCK);
  return entry => {
    const ranges = [];
    const [node, path] = entry;

    if (isElement(node) && node.type === code_block.type) {
      const text = Node.string(node); // const langName: any = parent.lang || 'markup';

      const langName = '';
      const lang = languages[langName];

      if (lang) {
        const tokens = tokenize(text, lang);
        let offset = 0;

        for (const element of tokens) {
          if (typeof element === 'string') {
            offset += element.length;
          } else {
            const token = element;
            ranges.push({
              anchor: {
                path,
                offset
              },
              focus: {
                path,
                offset: offset + token.length
              },
              className: `prism-token token ${token.type} `,
              prism: true
            });
            offset += token.length;
          }
        }
      }
    }

    return ranges;
  };
};

const getCodeBlockDeserialize = () => editor => {
  const code_block = getSlatePluginOptions(editor, ELEMENT_CODE_BLOCK);
  const code_line = getSlatePluginOptions(editor, ELEMENT_CODE_LINE);
  return {
    element: [...getElementDeserializer(Object.assign({
      type: code_block.type,
      rules: [{
        nodeNames: 'PRE'
      }, {
        className: getSlateClass(code_block.type)
      }]
    }, code_block.deserialize)), ...getElementDeserializer(Object.assign({
      type: code_line.type,
      rules: [{
        className: getSlateClass(code_line.type)
      }]
    }, code_line.deserialize))]
  };
};

/**
 * If at (default = selection) is in ul>li>p, return li and ul node entries.
 */

const getCodeLineEntry = (editor, {
  at = editor.selection
} = {}) => {
  if (at && someNode(editor, {
    at,
    match: {
      type: getSlatePluginType(editor, ELEMENT_CODE_LINE)
    }
  })) {
    const selectionParent = getParent(editor, at);
    if (!selectionParent) return;
    const [, parentPath] = selectionParent;
    const codeLine = getAbove(editor, {
      at,
      match: {
        type: getSlatePluginType(editor, ELEMENT_CODE_LINE)
      }
    }) || getParent(editor, parentPath);
    if (!codeLine) return;
    const [codeLineNode, codeLinePath] = codeLine;
    if (isElement(codeLineNode) && codeLineNode.type !== getSlatePluginType(editor, ELEMENT_CODE_LINE)) return;
    const codeBlock = getParent(editor, codeLinePath);
    if (!codeBlock) return;
    return {
      codeBlock,
      codeLine
    };
  }
};

/**
 * Get code line entries
 */

const getCodeLines = (editor, {
  at = editor.selection
} = {}) => {
  if (!at) return;
  return [...getNodes(editor, {
    at,
    match: {
      type: getSlatePluginType(editor, ELEMENT_CODE_LINE)
    }
  })];
};

/**
 * Indent if:
 * - the selection is expanded
 * - the selected code line has no whitespace character
 * Indentation = 2 spaces.
 */

const indentCodeLine = (editor, {
  codeLine
}) => {
  var _a;

  const [, codeLinePath] = codeLine;
  const codeLineStart = Editor.start(editor, codeLinePath);

  if (!isExpanded(editor.selection)) {
    const cursor = (_a = editor.selection) === null || _a === void 0 ? void 0 : _a.anchor;
    const range = Editor.range(editor, codeLineStart, cursor);
    const text = Editor.string(editor, range);

    if (/\S/.test(text)) {
      Transforms.insertText(editor, '  ', {
        at: editor.selection
      });
      return;
    }
  }

  Transforms.insertText(editor, '  ', {
    at: codeLineStart
  });
};

/**
 * If there is a whitespace character at the start of the code line,
 * delete it.
 */

const deleteStartSpace = (editor, {
  codeLine
}) => {
  const [, codeLinePath] = codeLine;
  const codeLineStart = Editor.start(editor, codeLinePath);
  const codeLineEnd = codeLineStart && Editor.after(editor, codeLineStart);
  const spaceRange = codeLineEnd && Editor.range(editor, codeLineStart, codeLineEnd);
  const spaceText = getText(editor, spaceRange);

  if (/\s/.test(spaceText)) {
    Transforms.delete(editor, {
      at: spaceRange
    });
    return true;
  }

  return false;
};

/**
 * Outdent the code line.
 * Remove 2 whitespace characters if any.
 */

const outdentCodeLine = (editor, {
  codeBlock,
  codeLine
}) => {
  const deleted = deleteStartSpace(editor, {
    codeBlock,
    codeLine
  });
  deleted && deleteStartSpace(editor, {
    codeBlock,
    codeLine
  });
};

/**
 * - Shift+Tab: outdent code line.
 * - Tab: indent code line.
 */

const getCodeBlockOnKeyDown = () => editor => e => {
  if (e.key === 'Tab') {
    const shiftTab = e.shiftKey;
    const res = getCodeLineEntry(editor, {});

    if (res) {
      const {
        codeBlock,
        codeLine
      } = res;
      e.preventDefault(); // outdent with shift+tab

      if (shiftTab) {
        // TODO: outdent multiple lines
        outdentCodeLine(editor, {
          codeBlock,
          codeLine
        });
      } // indent with tab


      const tab = !e.shiftKey;

      if (tab) {
        // TODO: indent multiple lines
        indentCodeLine(editor, {
          codeBlock,
          codeLine
        });
      }

      return;
    }

    const codeLines = getCodeLines(editor, {});

    if (codeLines && (codeLines === null || codeLines === void 0 ? void 0 : codeLines[0])) {
      e.preventDefault();
      const [, firstLinePath] = codeLines[0];
      const codeBlock = getParent(editor, firstLinePath);

      for (const codeLine of codeLines) {
        if (shiftTab) {
          // TODO: outdent multiple lines
          outdentCodeLine(editor, {
            codeBlock,
            codeLine
          });
        } // indent with tab


        const tab = !e.shiftKey;

        if (tab) {
          // TODO: indent multiple lines
          indentCodeLine(editor, {
            codeBlock,
            codeLine
          });
        }
      }
    }
  } // FIXME: would prefer this as mod+a, but doesn't work


  if (e.key === 'a' && (e.metaKey || e.ctrlKey)) {
    const res = getCodeLineEntry(editor, {});
    if (!res) return;
    const {
      codeBlock
    } = res;
    const [, codeBlockPath] = codeBlock; // select the whole code block

    Transforms.select(editor, codeBlockPath);
    e.preventDefault();
    e.stopPropagation();
  } // Note: rather than handling mod+enter/mod+shift+enter here, we recommend
  // using the exit-break plugin/ If not using exit-break, follow similar logic
  // to exit-break to add behavior to exit the code-block

};

const MARK_PRISM = 'prism';
const getCodeBlockRenderLeaf = () => () => ({
  leaf,
  children
}) => {
  if (leaf[MARK_PRISM] && !!leaf.text) {
    return /*#__PURE__*/React.createElement("span", {
      className: leaf === null || leaf === void 0 ? void 0 : leaf.className
    }, children);
  }

  return children;
};

const getIndentDepth = (editor, {
  codeLine
}) => {
  const [, codeLinePath] = codeLine;
  const text = getText(editor, codeLinePath);
  return text.search(/\S|$/);
};

/**
 * Insert a code line starting with indentation.
 */

const insertCodeLine = (editor, indentDepth = 0) => {
  if (editor.selection) {
    const indent = ' '.repeat(indentDepth);
    insertNodes(editor, {
      type: getSlatePluginType(editor, ELEMENT_CODE_LINE),
      children: [{
        text: indent
      }]
    });
  }
};

const withCodeBlock = () => editor => {
  const {
    insertBreak
  } = editor;

  const insertBreakCodeBlock = () => {
    if (!editor.selection) return;
    const res = getCodeLineEntry(editor, {});
    if (!res) return;
    const {
      codeBlock,
      codeLine
    } = res;
    const indentDepth = getIndentDepth(editor, {
      codeBlock,
      codeLine
    });
    insertCodeLine(editor, indentDepth);
    return true;
  };

  editor.insertBreak = () => {
    if (insertBreakCodeBlock()) return;
    insertBreak();
  };

  return editor;
};

/**
 * Enables support for pre-formatted code blocks.
 */

const createCodeBlockPlugin = () => ({
  pluginKeys: KEYS_CODE_BLOCK,
  renderElement: getRenderElement(KEYS_CODE_BLOCK),
  renderLeaf: getCodeBlockRenderLeaf(),
  deserialize: getCodeBlockDeserialize(),
  decorate: getCodeBlockDecorate(),
  onKeyDown: getCodeBlockOnKeyDown(),
  withOverrides: withCodeBlock()
});

/**
 * Insert a code block: set the node to code line and wrap it with a code block.
 * If the cursor is not at the block start, insert break before.
 */

const insertCodeBlock = (editor, insertNodesOptions = {}) => {
  if (!editor.selection || isExpanded(editor.selection)) return;

  const matchCodeElements = node => node.type === getSlatePluginType(editor, ELEMENT_CODE_BLOCK) || node.type === getSlatePluginType(editor, ELEMENT_CODE_LINE);

  if (someNode(editor, {
    match: matchCodeElements
  })) {
    return;
  }

  if (!isSelectionAtBlockStart(editor)) {
    editor.insertBreak();
  }

  setNodes(editor, {
    type: getSlatePluginType(editor, ELEMENT_CODE_LINE),
    children: [{
      text: ''
    }]
  }, insertNodesOptions);
  wrapNodes(editor, {
    type: getSlatePluginType(editor, ELEMENT_CODE_BLOCK),
    children: []
  }, insertNodesOptions);
};

/**
 * Called by toolbars to make sure a code-block gets inserted below a paragraph
 * rather than awkwardly splitting the current selection.
 */

const insertEmptyCodeBlock = (editor, {
  defaultType = ELEMENT_DEFAULT,
  insertNodesOptions,
  level = 0
}) => {
  if (!editor.selection) return;

  if (isExpanded(editor.selection) || !isBlockAboveEmpty(editor)) {
    const selectionPath = Editor.path(editor, editor.selection);
    const insertPath = Path.next(selectionPath.slice(0, level + 1));
    insertNodes(editor, {
      type: defaultType,
      children: [{
        text: ''
      }]
    }, {
      at: insertPath,
      select: true
    });
  }

  insertCodeBlock(editor, insertNodesOptions);
};

const unwrapCodeBlock = editor => {
  unwrapNodes(editor, {
    match: {
      type: getSlatePluginType(editor, ELEMENT_CODE_LINE)
    }
  });
  unwrapNodes(editor, {
    match: {
      type: getSlatePluginType(editor, ELEMENT_CODE_BLOCK)
    },
    split: true
  });
};

const toggleCodeBlock = editor => {
  if (!editor.selection) return;
  const isActive = someNode(editor, {
    match: {
      type: getSlatePluginType(editor, ELEMENT_CODE_BLOCK)
    }
  });
  unwrapCodeBlock(editor);
  setNodes(editor, {
    type: getSlatePluginType(editor, ELEMENT_CODE_LINE)
  });

  if (!isActive) {
    const codeBlock = {
      type: getSlatePluginType(editor, ELEMENT_CODE_BLOCK),
      children: []
    };
    wrapNodes(editor, codeBlock);
    const nodes = [...getNodes(editor, {
      match: {
        type: getSlatePluginType(editor, ELEMENT_CODE_LINE)
      }
    })];
    const codeLine = {
      type: getSlatePluginType(editor, ELEMENT_CODE_BLOCK),
      children: []
    };

    for (const [, path] of nodes) {
      // Transforms.wrapNodes(editor, codeLine, {
      setNodes(editor, codeLine, {
        at: path
      });
    }
  }
};

export { CODE_BLOCK_LANGUAGES, DEFAULTS_CODE_BLOCK, ELEMENT_CODE_BLOCK, ELEMENT_CODE_LINE, KEYS_CODE_BLOCK, MARK_PRISM, createCodeBlockPlugin, deleteStartSpace, getCodeBlockDecorate, getCodeBlockDeserialize, getCodeBlockOnKeyDown, getCodeBlockRenderLeaf, getCodeLineEntry, getCodeLines, getIndentDepth, indentCodeLine, insertCodeBlock, insertCodeLine, insertEmptyCodeBlock, outdentCodeLine, toggleCodeBlock, unwrapCodeBlock, withCodeBlock };
//# sourceMappingURL=index.es.js.map
