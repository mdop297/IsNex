import {
  BlockNoteSchema,
  createHeadingBlockSpec,
  defaultBlockSpecs,
} from '@blocknote/core';
import '@blocknote/core/fonts/inter.css';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import { useCreateBlockNote } from '@blocknote/react';
import { useTheme } from 'next-themes';
import { createCodeBlockSpec } from '@blocknote/core';
import { codeBlockOptions } from '@blocknote/code-block';

export default function App() {
  const { theme } = useTheme();
  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    initialContent: [{}],
    // TODO: check this issue for a fix: https://github.com/TypeCellOS/BlockNote/issues/2169
    pasteHandler: ({ event, editor, defaultPasteHandler }) => {
      if (event.clipboardData?.types.includes('text/plain')) {
        editor.pasteMarkdown(event.clipboardData.getData('text/plain'));
        return true;
      }
      return defaultPasteHandler();
    },
    schema: BlockNoteSchema.create().extend({
      ...defaultBlockSpecs,
      blockSpecs: {
        codeBlock: createCodeBlockSpec(codeBlockOptions),
        heading: createHeadingBlockSpec({
          levels: [1, 2, 3],
        }),
        image: {
          ...defaultBlockSpecs.image,
          config: {
            ...defaultBlockSpecs.image.config,
            propSchema: {
              ...defaultBlockSpecs.image.config.propSchema,
              previewWidth: {
                ...defaultBlockSpecs.image.config.propSchema.previewWidth,
                default: 512 as const,
              },
            },
          },
        },
      },
    }),

    tables: {
      splitCells: true,
      cellBackgroundColor: true,
      cellTextColor: true,
      headers: true,
    },
  });

  // Renders the editor instance using a React component.
  return (
    <div className="h-full overflow-auto minimal-scrollbar">
      <BlockNoteView
        editor={editor}
        theme={theme === 'dark' ? 'dark' : 'light'}
        className="bg-secondary"
      />
    </div>
  );
}
