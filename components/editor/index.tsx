'use client';

import { forwardRef } from 'react';

import '@mdxeditor/editor/style.css';
import './dark-editor.css';
import {
  BoldItalicUnderlineToggles,
  ChangeCodeMirrorLanguage,
  codeBlockPlugin,
  codeMirrorPlugin,
  CodeToggle,
  ConditionalContents,
  CreateLink,
  diffSourcePlugin,
  headingsPlugin,
  imagePlugin,
  InsertCodeBlock,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  markdownShortcutPlugin,
  MDXEditor,
  MDXEditorMethods,
  quotePlugin,
  Separator,
  tablePlugin,
  toolbarPlugin,
  UndoRedo,
} from '@mdxeditor/editor';
import { basicDark } from 'cm6-theme-basic-dark';
import { useTheme } from 'next-themes';

import { cn } from '@/lib/utils';

interface EditorProps {
  value: string;
  fieldChange: (value: string) => void;
  className?: string;
}

const Editor = forwardRef<MDXEditorMethods, EditorProps>(
  ({ value, fieldChange, className, ...props }, ref) => {
    const { resolvedTheme } = useTheme();
    const themeExtension = resolvedTheme === 'dark' ? [basicDark] : [];

    return (
      <MDXEditor
        key={resolvedTheme}
        markdown={value}
        ref={ref}
        onChange={fieldChange}
        className={cn(
          'dark-editor markdown-editor w-full border light-border-2 background-light800_dark200',
          className,
        )}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          quotePlugin(),
          markdownShortcutPlugin(),
          tablePlugin(),
          imagePlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: '' }),
          codeMirrorPlugin({
            codeBlockLanguages: {
              css: 'css',
              txt: 'txt',
              sql: 'sql',
              html: 'html',
              saas: 'saas',
              scss: 'scss',
              bash: 'bash',
              json: 'json',
              js: 'javascript',
              ts: 'typescript',
              '': 'unspecified',
              tsx: 'TypeScript (React)',
              jsx: 'JavaScript (React)',
            },
            autoLoadLanguageSupport: true,
            codeMirrorExtensions: themeExtension,
          }),
          diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: '' }),
          toolbarPlugin({
            toolbarContents: () => (
              <ConditionalContents
                options={[
                  {
                    when: (editor) => editor?.editorType === 'codeblock',
                    contents: () => <ChangeCodeMirrorLanguage />,
                  },
                  {
                    fallback: () => (
                      <>
                        <UndoRedo />
                        <Separator />

                        <BoldItalicUnderlineToggles />
                        <CodeToggle />
                        <Separator />

                        <ListsToggle />
                        <Separator />

                        <CreateLink />
                        <InsertImage />
                        <Separator />

                        <InsertTable />
                        <InsertThematicBreak />
                        <Separator />

                        <InsertCodeBlock />
                      </>
                    ),
                  },
                ]}
              />
            ),
          }),
        ]}
        {...props}
      />
    );
  },
);

Editor.displayName = 'Editor';
export default Editor;
