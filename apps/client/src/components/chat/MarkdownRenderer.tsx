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
      className={`markdown-content ${className}`}
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
                <div
                  className="code-block-wrapper"
                  style={{ maxHeight: '400px', overflow: 'auto' }}
                >
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
          // Thêm styling cho các elements khác
          p: ({ children, ...props }) => (
            <p
              {...props}
              style={{
                marginBottom: '1em',
                lineHeight: '1.6',
                wordWrap: 'break-word',
              }}
            >
              {children}
            </p>
          ),
          ul: ({ children, ...props }) => (
            <ul
              {...props}
              style={{ marginBottom: '1em', paddingLeft: '1.5em' }}
            >
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol
              {...props}
              style={{ marginBottom: '1em', paddingLeft: '1.5em' }}
            >
              {children}
            </ol>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote
              {...props}
              style={{
                borderLeft: '4px solid',
                paddingLeft: '1em',
                marginLeft: '0',
                marginBottom: '1em',
                fontStyle: 'italic',
              }}
              className="text-accent-foreground !border-l-item-selected-indicator"
            >
              {children}
            </blockquote>
          ),
          table: ({ children, ...props }) => (
            <div style={{ overflowX: 'auto', marginBottom: '1em' }}>
              <table
                {...props}
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  border: '1px solid',
                }}
              >
                {children}
              </table>
            </div>
          ),
          th: ({ children, ...props }) => (
            <th
              {...props}
              style={{
                border: '1px solid ',
                padding: '8px 12px',
                fontWeight: 'bold',
                textAlign: 'left',
              }}
              className="bg-input"
            >
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td
              {...props}
              style={{
                border: '1px solid',
                padding: '8px 12px',
              }}
            >
              {children}
            </td>
          ),
        }}
      >
        {markdown}
      </Markdown>
    </div>
  );
}
