import { useState } from 'react';

function PDFJSViewer() {
  const [pdfFile, setPdfFile] = useState('/temp/4.pdf');

  return (
    <div className="flex h-full flex-col">
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setPdfFile('/temp/4.pdf')}>View Sample 1</button>
        <button onClick={() => setPdfFile('/temp/48.pdf')}>
          View Sample 2
        </button>
      </div>
      {/* we can't add features because of iframe */}
      <iframe
        id="pdf-js-viewer"
        src={`/pdfjs/web/viewer.html?file=${encodeURIComponent(pdfFile)}`}
        title="webviewer"
        width="100%"
        height="100%"
      ></iframe>
    </div>
  );
}

export default PDFJSViewer;
