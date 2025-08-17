'use client';
import YooptaEditor, {
  createYooptaEditor,
  YooptaContentValue,
  // YooptaOnChangeOptions,
} from '@yoopta/editor';

import Paragraph from '@yoopta/paragraph';
import Blockquote from '@yoopta/blockquote';
import Embed from '@yoopta/embed';
import Image from '@yoopta/image';
import Link from '@yoopta/link';
import Callout from '@yoopta/callout';
import Video from '@yoopta/video';
import File from '@yoopta/file';
import Accordion from '@yoopta/accordion';
import { NumberedList, BulletedList, TodoList } from '@yoopta/lists';
import {
  Bold,
  Italic,
  CodeMark,
  Underline,
  Strike,
  Highlight,
} from '@yoopta/marks';
import { HeadingOne, HeadingThree, HeadingTwo } from '@yoopta/headings';
import Code from '@yoopta/code';
import Table from '@yoopta/table';
import Divider from '@yoopta/divider';
import ActionMenuList, {
  DefaultActionMenuRender,
} from '@yoopta/action-menu-list';
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar';
import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool';

import { useMemo, useRef, useState } from 'react';
import { WITH_BASIC_INIT_VALUE } from './initValue';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { ScrollBar } from '../ui/scroll-area';

const plugins = [
  Paragraph,
  Table,
  Divider.extend({
    elementProps: {
      divider: (props) => ({
        ...props,
        color: '#007aff',
      }),
    },
  }),
  Accordion,
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  Blockquote,
  Callout,
  NumberedList,
  BulletedList,
  TodoList,
  Code,
  Link,
  Embed,
  Image.extend({
    options: {
      async onUpload(file: File) {
        const localUrl = URL.createObjectURL(file);

        return {
          src: localUrl,
          alt: null,
        };
      },
    },
  }),
  Video,
  File,
];

const TOOLS = {
  ActionMenu: {
    render: DefaultActionMenuRender,
    // render: NotionActionMenu,
    tool: ActionMenuList,
  },
  Toolbar: {
    render: DefaultToolbarRender,
    tool: Toolbar,
  },
  LinkTool: {
    render: DefaultLinkToolRender,
    tool: LinkTool,
  },
};

const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];

function NoteEditor() {
  const [value, setValue] = useState(WITH_BASIC_INIT_VALUE);
  const editor = useMemo(() => createYooptaEditor(), []);
  const selectionRef = useRef(null);

  const onChange = (
    newValue: YooptaContentValue,
    // options: YooptaOnChangeOptions,
  ) => {
    setValue(newValue);
  };

  return (
    <div className="flex justify-center w-full h-full " ref={selectionRef}>
      <ScrollArea className="w-full h-full overflow-y-auto">
        <div className="flex justify-center text-foreground">
          <YooptaEditor
            editor={editor}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            plugins={plugins as any}
            tools={TOOLS}
            marks={MARKS}
            selectionBoxRoot={selectionRef}
            value={value}
            onChange={onChange}
            autoFocus
            style={{
              width: '90%',
              padding: '20px',
              minWidth: '150px',
            }}
          />
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}

export default NoteEditor;
