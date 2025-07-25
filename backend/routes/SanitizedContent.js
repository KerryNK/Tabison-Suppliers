import React from 'react';
import DOMPurify from 'dompurify';

// To use this, you would first run: npm install dompurify

const SanitizedContent = ({ dirtyHtml }) => {
  // Sanitize the HTML content before rendering
  const cleanHtml = DOMPurify.sanitize(dirtyHtml);

  return (
    <div>
      <h3>Rendered User Content:</h3>
      <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
    </div>
  );
};

export default SanitizedContent;