import {
  ELEMENT_PARAGRAPH,
  ELEMENT_H1,
  ELEMENT_H2,
  MARK_BOLD,
  MARK_ITALIC,
  MARK_CODE,
  MARK_UNDERLINE,
  MARK_STRIKETHROUGH
} from "@udecode/slate-plugins";

const createElement = (
  text = "",
  {
    type = ELEMENT_PARAGRAPH,
    mark
  }: {
    type?: string,
    mark?: string
  } = {}
) => {
  const leaf = { text };
  if (mark) {
    leaf[mark] = true;
  }

  return {
    type,
    children: [leaf]
  };
};

export const initialValueBasic = [
  createElement("⚡️ Elements", { type: ELEMENT_H1 }),
  {
    type: ELEMENT_PARAGRAPH,
    children: [
      {
        text: "You can experiment here, add a blockquote 👇"
      }
    ]
  },
  {
    type: ELEMENT_PARAGRAPH,
    children: [
      {
        text: ""
      }
    ]
  },
  createElement("💅 Marks", { type: ELEMENT_H1 }),
  createElement("💧 Basic Marks", { type: ELEMENT_H2 }),
  createElement(
    "The basic marks consist of text formatting such as bold, italic, underline, strikethrough, subscript, superscript, and code."
  ),
  createElement(
    "You can customize the type, the component and the hotkey for each of these."
  ),
  createElement("This text is bold.", { mark: MARK_BOLD }),
  createElement("This text is italic.", { mark: MARK_ITALIC }),
  createElement("This text is underlined.", {
    mark: MARK_UNDERLINE
  }),
  {
    type: ELEMENT_PARAGRAPH,
    children: [
      {
        text: "This text is bold, italic and underlined.",
        [MARK_BOLD]: true,
        [MARK_ITALIC]: true,
        [MARK_UNDERLINE]: true
      }
    ]
  },
  createElement("This is a strikethrough text.", {
    mark: MARK_STRIKETHROUGH
  }),
  createElement("This is an inline code.", { mark: MARK_CODE })
];
