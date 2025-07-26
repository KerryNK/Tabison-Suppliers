import DOMPurify from 'dompurify';

// Function to sanitize HTML content
const sanitizeHtml = (html) => {
  return DOMPurify.sanitize(html);
};

export default sanitizeHtml;
