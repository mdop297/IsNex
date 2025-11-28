import '@blocknote/core/fonts/inter.css';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import {
  BasicTextStyleButton,
  BlockTypeSelect,
  ColorStyleButton,
  CreateLinkButton,
  FileCaptionButton,
  FileReplaceButton,
  FormattingToolbar,
  FormattingToolbarController,
  NestBlockButton,
  TextAlignButton,
  UnnestBlockButton,
  useCreateBlockNote,
} from '@blocknote/react';

import {
  BlockNoteSchema,
  createHeadingBlockSpec,
  defaultBlockSpecs,
} from '@blocknote/core';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';
import { useTheme } from 'next-themes';
import { createCodeBlockSpec } from '@blocknote/core';
import { codeBlockOptions } from '@blocknote/code-block';
import '@/app/globals.css';

export default function App() {
  const { theme } = useTheme();

  const editor = useCreateBlockNote({
    domAttributes: {
      block: {
        class: 'blocknote-style',
      },
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
    pasteHandler: ({ event, editor, defaultPasteHandler }) => {
      if (event.clipboardData?.types.includes('text/plain')) {
        editor.pasteMarkdown(event.clipboardData.getData('text/plain'));
        return true;
      }
      return defaultPasteHandler({
        prioritizeMarkdownOverHTML: true,
        plainTextAsMarkdown: true,
      });
    },
    tables: {
      splitCells: true,
      cellBackgroundColor: true,
      cellTextColor: true,
      headers: true,
    },
  });

  // Renders the editor instance.
  return (
    <div className="h-full overflow-auto minimal-scrollbar">
      <BlockNoteView
        editor={editor}
        formattingToolbar={false}
        theme={theme === 'dark' ? 'dark' : 'light'}
        data-theming-css-variables
      >
        <FormattingToolbarController
          formattingToolbar={() => (
            <FormattingToolbar>
              <BlockTypeSelect key={'blockTypeSelect'} />

              {/* Extra button to toggle blue text & background */}
              {/* <BlueButton key={"customButton"} /> */}

              <FileCaptionButton key={'fileCaptionButton'} />
              <FileReplaceButton key={'replaceFileButton'} />

              <BasicTextStyleButton
                basicTextStyle={'bold'}
                key={'boldStyleButton'}
              />
              <BasicTextStyleButton
                basicTextStyle={'italic'}
                key={'italicStyleButton'}
              />
              <BasicTextStyleButton
                basicTextStyle={'underline'}
                key={'underlineStyleButton'}
              />
              <BasicTextStyleButton
                basicTextStyle={'strike'}
                key={'strikeStyleButton'}
              />
              {/* Extra button to toggle code styles */}
              <BasicTextStyleButton
                key={'codeStyleButton'}
                basicTextStyle={'code'}
              />

              <TextAlignButton
                textAlignment={'left'}
                key={'textAlignLeftButton'}
              />
              <TextAlignButton
                textAlignment={'center'}
                key={'textAlignCenterButton'}
              />
              <TextAlignButton
                textAlignment={'right'}
                key={'textAlignRightButton'}
              />

              <ColorStyleButton key={'colorStyleButton'} />

              <NestBlockButton key={'nestBlockButton'} />
              <UnnestBlockButton key={'unnestBlockButton'} />

              <CreateLinkButton key={'createLinkButton'} />
            </FormattingToolbar>
          )}
        />
      </BlockNoteView>
    </div>
  );
}
