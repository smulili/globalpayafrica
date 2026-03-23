import React from 'react';
import { Headphones, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SupportPage = () => {
  const whatsappNumber = '+12139370975';
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}`;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Headphones className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-display font-bold text-foreground">Support</h1>
      </div>

      <div className="glass-card p-6 text-center">
        <MessageCircle className="h-12 w-12 text-success mx-auto mb-3" />
        <h3 className="font-display font-bold text-foreground text-lg mb-2">Need Help?</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Our support team is available 24/7 via WhatsApp
        </p>
        <Button
          size="lg"
          variant="success"
          onClick={() => window.open(whatsappUrl, '_blank')}
        >
          <MessageCircle className="mr-2 h-5 w-5" />
          Chat on WhatsApp
        </Button>
        <p className="text-xs text-muted-foreground mt-3">{}</p>
      </div>
    </div>
  );
};

export default SupportPage;
