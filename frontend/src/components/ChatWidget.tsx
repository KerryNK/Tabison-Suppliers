import React, { useEffect } from "react";

const ChatWidget: React.FC = () => {
  useEffect(() => {
    // Tawk.to example (replace with your property ID)
    if (window && !(window as any).Tawk_API) {
      const s = document.createElement("script");
      s.async = true;
      s.src = "https://embed.tawk.to/your_property_id/1hxxxxxxx"; // Replace with your Tawk.to property ID
      s.charset = "UTF-8";
      s.setAttribute("crossorigin", "*");
      document.body.appendChild(s);
    }
  }, []);
  return null;
};

export default ChatWidget;
