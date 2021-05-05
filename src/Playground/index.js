import React, { useState } from "react";
import {
  SlatePlugins,
  createReactPlugin,
  createHistoryPlugin,
  createParagraphPlugin,
  createItalicPlugin,
  createUnderlinePlugin,
  createStrikethroughPlugin,
  createCodePlugin,
  createHeadingPlugin,
  createBoldPlugin,
  createSlatePluginsComponents,
  createSlatePluginsOptions,
  createAutoformatPlugin
} from "@udecode/slate-plugins";
import { createCodeBlockPlugin } from "../Lib/code-block/src";
import { createBlockquotePlugin } from "../Lib/block-quote-md/src";
import { optionsAutoformat } from "./config/autoformatRules";

import { initialValueBasic } from "./helper";

const components = createSlatePluginsComponents();
const options = createSlatePluginsOptions();

const pluginsBasic = [
  // editor
  createReactPlugin(), // withReact
  createHistoryPlugin(), // withHistory

  // elements
  createParagraphPlugin(), // paragraph element
  createBlockquotePlugin(), // blockquote element
  createCodeBlockPlugin(), // code block element
  createHeadingPlugin(), // heading elements

  // marks
  createBoldPlugin(), // bold mark
  createItalicPlugin(), // italic mark
  createUnderlinePlugin(), // underline mark
  createStrikethroughPlugin(), // strikethrough mark
  createCodePlugin(), // code mark
  createAutoformatPlugin(optionsAutoformat)
];

// Quick helper to create a block element with (marked) text

const Playground = () => {
  const editableProps = {
    placeholder: "Type…",
    style: {}
  };
  const [debugValue, setDebugValue] = useState(null);

  return (
    <>
      <h1>Playground.</h1>
      <SlatePlugins
        id="0"
        editableProps={editableProps}
        initialValue={initialValueBasic}
        plugins={pluginsBasic}
        components={components}
        options={options}
        onChange={newValue => {
          setDebugValue(newValue);
        }}
      />
      <pre>
        <code>{JSON.stringify(debugValue)}</code>
      </pre>
    </>
  );
};

export default Playground;
