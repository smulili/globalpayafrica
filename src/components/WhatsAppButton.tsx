import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const url = 'https://wa.me/12139370975';

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-success flex items-center justify-center shadow-lg shadow-success/30 hover:scale-110 transition-transform"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-7 w-7 text-success-foreground" />
    </a>
  );
};

export default WhatsAppButton;
