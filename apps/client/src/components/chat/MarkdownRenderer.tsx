import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import 'katex/dist/katex.min.css';

type MarkdownRendererProps = {
  children: string;
  maxHeight?: string; // Thêm prop để control chiều cao tối đa
  className?: string;
};

export function MarkdownRenderer({
  children: markdown,
  maxHeight,
  className = '',
}: MarkdownRendererProps) {
  return (
    <div
      className={`markdown ${className}`}
      style={{
        maxHeight: maxHeight || 'none',
        overflowY: maxHeight ? 'auto' : 'visible',
      }}
    >
      <Markdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeKatex]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');

            if (match) {
              return (
                <div className="code-block-wrapper">
                  <SyntaxHighlighter
                    style={dracula}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      margin: 0,
                      borderRadius: '6px',
                      fontSize: '14px',
                    }}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              );
            }
            return (
              <code
                className={`${className} inline-code bg-input`}
                {...props}
                style={{
                  padding: '2px 4px',
                  borderRadius: '3px',
                  fontSize: '0.875em',
                  wordBreak: 'break-word',
                }}
              >
                {children}
              </code>
            );
          },
          p: ({ children, ...props }) => <p {...props}>{children}</p>,
          ul: ({ children, ...props }) => <ul {...props}>{children}</ul>,
          ol: ({ children, ...props }) => <ol {...props}>{children}</ol>,
          blockquote: ({ children, ...props }) => (
            <blockquote
              {...props}
              className="text-accent-foreground !border-l-item-selected-indicator border-l-2 pl-2.5"
            >
              {children}
            </blockquote>
          ),
          table: ({ children, ...props }) => (
            <div>
              <table {...props}>{children}</table>
            </div>
          ),
          th: ({ children, ...props }) => (
            <th {...props} className="bg-input">
              {children}
            </th>
          ),
          td: ({ children, ...props }) => <td {...props}>{children}</td>,
        }}
      >
        {markdown}
      </Markdown>
    </div>
  );
}
