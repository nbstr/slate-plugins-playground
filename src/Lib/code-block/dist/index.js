'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var slatePluginsCore = require('@udecode/slate-plugins-core');
var prismjs = require('prismjs');
var slate = require('slate');
var slatePluginsCommon = require('@udecode/slate-plugins-common');
var React = require('react');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () {
            return e[k];
          }
        });
      }
    });
  }
  n['default'] = e;
  return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/_interopNamespace(React);

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
  const code_block = slatePluginsCore.getSlatePluginOptions(editor, ELEMENT_CODE_BLOCK);
  return entry => {
    const ranges = [];
    const [node, path] = entry;

    if (slatePluginsCore.isElement(node) && node.type === code_block.type) {
      const text = slate.Node.string(node); // const langName: any = parent.lang || 'markup';

      const langName = '';
      const lang = prismjs.languages[langName];

      if (lang) {
        const tokens = prismjs.tokenize(text, lang);
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
  const code_block = slatePluginsCore.getSlatePluginOptions(editor, ELEMENT_CODE_BLOCK);
  const code_line = slatePluginsCore.getSlatePluginOptions(editor, ELEMENT_CODE_LINE);
  return {
    element: [...slatePluginsCommon.getElementDeserializer(Object.assign({
      type: code_block.type,
      rules: [{
        nodeNames: 'PRE'
      }, {
        className: slatePluginsCore.getSlateClass(code_block.type)
      }]
    }, code_block.deserialize)), ...slatePluginsCommon.getElementDeserializer(Object.assign({
      type: code_line.type,
      rules: [{
        className: slatePluginsCore.getSlateClass(code_line.type)
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
  if (at && slatePluginsCommon.someNode(editor, {
    at,
    match: {
      type: slatePluginsCore.getSlatePluginType(editor, ELEMENT_CODE_LINE)
    }
  })) {
    const selectionParent = slatePluginsCommon.getParent(editor, at);
    if (!selectionParent) return;
    const [, parentPath] = selectionParent;
    const codeLine = slatePluginsCommon.getAbove(editor, {
      at,
      match: {
        type: slatePluginsCore.getSlatePluginType(editor, ELEMENT_CODE_LINE)
      }
    }) || slatePluginsCommon.getParent(editor, parentPath);
    if (!codeLine) return;
    const [codeLineNode, codeLinePath] = codeLine;
    if (slatePluginsCore.isElement(codeLineNode) && codeLineNode.type !== slatePluginsCore.getSlatePluginType(editor, ELEMENT_CODE_LINE)) return;
    const codeBlock = slatePluginsCommon.getParent(editor, codeLinePath);
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
  return [...slatePluginsCommon.getNodes(editor, {
    at,
    match: {
      type: slatePluginsCore.getSlatePluginType(editor, ELEMENT_CODE_LINE)
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
  const codeLineStart = slate.Editor.start(editor, codeLinePath);

  if (!slatePluginsCommon.isExpanded(editor.selection)) {
    const cursor = (_a = editor.selection) === null || _a === void 0 ? void 0 : _a.anchor;
    const range = slate.Editor.range(editor, codeLineStart, cursor);
    const text = slate.Editor.string(editor, range);

    if (/\S/.test(text)) {
      slate.Transforms.insertText(editor, '  ', {
        at: editor.selection
      });
      return;
    }
  }

  slate.Transforms.insertText(editor, '  ', {
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
  const codeLineStart = slate.Editor.start(editor, codeLinePath);
  const codeLineEnd = codeLineStart && slate.Editor.after(editor, codeLineStart);
  const spaceRange = codeLineEnd && slate.Editor.range(editor, codeLineStart, codeLineEnd);
  const spaceText = slatePluginsCommon.getText(editor, spaceRange);

  if (/\s/.test(spaceText)) {
    slate.Transforms.delete(editor, {
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
      const codeBlock = slatePluginsCommon.getParent(editor, firstLinePath);

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

    slate.Transforms.select(editor, codeBlockPath);
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
    return /*#__PURE__*/React__namespace.createElement("span", {
      className: leaf === null || leaf === void 0 ? void 0 : leaf.className
    }, children);
  }

  return children;
};

const getIndentDepth = (editor, {
  codeLine
}) => {
  const [, codeLinePath] = codeLine;
  const text = slatePluginsCommon.getText(editor, codeLinePath);
  return text.search(/\S|$/);
};

/**
 * Insert a code line starting with indentation.
 */

const insertCodeLine = (editor, indentDepth = 0) => {
  if (editor.selection) {
    const indent = ' '.repeat(indentDepth);
    slatePluginsCommon.insertNodes(editor, {
      type: slatePluginsCore.getSlatePluginType(editor, ELEMENT_CODE_LINE),
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
  renderElement: slatePluginsCore.getRenderElement(KEYS_CODE_BLOCK),
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
  if (!editor.selection || slatePluginsCommon.isExpanded(editor.selection)) return;

  const matchCodeElements = node => node.type === slatePluginsCore.getSlatePluginType(editor, ELEMENT_CODE_BLOCK) || node.type === slatePluginsCore.getSlatePluginType(editor, ELEMENT_CODE_LINE);

  if (slatePluginsCommon.someNode(editor, {
    match: matchCodeElements
  })) {
    return;
  }

  if (!slatePluginsCommon.isSelectionAtBlockStart(editor)) {
    editor.insertBreak();
  }

  slatePluginsCommon.setNodes(editor, {
    type: slatePluginsCore.getSlatePluginType(editor, ELEMENT_CODE_LINE),
    children: [{
      text: ''
    }]
  }, insertNodesOptions);
  slatePluginsCommon.wrapNodes(editor, {
    type: slatePluginsCore.getSlatePluginType(editor, ELEMENT_CODE_BLOCK),
    children: []
  }, insertNodesOptions);
};

/**
 * Called by toolbars to make sure a code-block gets inserted below a paragraph
 * rather than awkwardly splitting the current selection.
 */

const insertEmptyCodeBlock = (editor, {
  defaultType = slatePluginsCommon.ELEMENT_DEFAULT,
  insertNodesOptions,
  level = 0
}) => {
  if (!editor.selection) return;

  if (slatePluginsCommon.isExpanded(editor.selection) || !slatePluginsCommon.isBlockAboveEmpty(editor)) {
    const selectionPath = slate.Editor.path(editor, editor.selection);
    const insertPath = slate.Path.next(selectionPath.slice(0, level + 1));
    slatePluginsCommon.insertNodes(editor, {
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
  slatePluginsCommon.unwrapNodes(editor, {
    match: {
      type: slatePluginsCore.getSlatePluginType(editor, ELEMENT_CODE_LINE)
    }
  });
  slatePluginsCommon.unwrapNodes(editor, {
    match: {
      type: slatePluginsCore.getSlatePluginType(editor, ELEMENT_CODE_BLOCK)
    },
    split: true
  });
};

const toggleCodeBlock = editor => {
  if (!editor.selection) return;
  const isActive = slatePluginsCommon.someNode(editor, {
    match: {
      type: slatePluginsCore.getSlatePluginType(editor, ELEMENT_CODE_BLOCK)
    }
  });
  unwrapCodeBlock(editor);
  slatePluginsCommon.setNodes(editor, {
    type: slatePluginsCore.getSlatePluginType(editor, ELEMENT_CODE_LINE)
  });

  if (!isActive) {
    const codeBlock = {
      type: slatePluginsCore.getSlatePluginType(editor, ELEMENT_CODE_BLOCK),
      children: []
    };
    slatePluginsCommon.wrapNodes(editor, codeBlock);
    const nodes = [...slatePluginsCommon.getNodes(editor, {
      match: {
        type: slatePluginsCore.getSlatePluginType(editor, ELEMENT_CODE_LINE)
      }
    })];
    const codeLine = {
      type: slatePluginsCore.getSlatePluginType(editor, ELEMENT_CODE_BLOCK),
      children: []
    };

    for (const [, path] of nodes) {
      // Transforms.wrapNodes(editor, codeLine, {
      slatePluginsCommon.setNodes(editor, codeLine, {
        at: path
      });
    }
  }
};

exports.CODE_BLOCK_LANGUAGES = CODE_BLOCK_LANGUAGES;
exports.DEFAULTS_CODE_BLOCK = DEFAULTS_CODE_BLOCK;
exports.ELEMENT_CODE_BLOCK = ELEMENT_CODE_BLOCK;
exports.ELEMENT_CODE_LINE = ELEMENT_CODE_LINE;
exports.KEYS_CODE_BLOCK = KEYS_CODE_BLOCK;
exports.MARK_PRISM = MARK_PRISM;
exports.createCodeBlockPlugin = createCodeBlockPlugin;
exports.deleteStartSpace = deleteStartSpace;
exports.getCodeBlockDecorate = getCodeBlockDecorate;
exports.getCodeBlockDeserialize = getCodeBlockDeserialize;
exports.getCodeBlockOnKeyDown = getCodeBlockOnKeyDown;
exports.getCodeBlockRenderLeaf = getCodeBlockRenderLeaf;
exports.getCodeLineEntry = getCodeLineEntry;
exports.getCodeLines = getCodeLines;
exports.getIndentDepth = getIndentDepth;
exports.indentCodeLine = indentCodeLine;
exports.insertCodeBlock = insertCodeBlock;
exports.insertCodeLine = insertCodeLine;
exports.insertEmptyCodeBlock = insertEmptyCodeBlock;
exports.outdentCodeLine = outdentCodeLine;
exports.toggleCodeBlock = toggleCodeBlock;
exports.unwrapCodeBlock = unwrapCodeBlock;
exports.withCodeBlock = withCodeBlock;
//# sourceMappingURL=index.js.map
