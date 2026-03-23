import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Gift, PartyPopper } from 'lucide-react';

interface WelcomeBonusDialogProps {
  open: boolean;
  onClose: () => void;
}

const WelcomeBonusDialog: React.FC<WelcomeBonusDialogProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-[90%] sm:max-w-md bg-card border-primary/30 text-center p-0 overflow-hidden rounded-xl">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 p-4 sm:p-8">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="relative">
              <Gift className="h-10 w-10 sm:h-16 sm:w-16 text-accent animate-bounce" />
              <PartyPopper className="h-5 w-5 sm:h-8 sm:w-8 text-primary absolute -top-1 -right-1 sm:-top-2 sm:-right-2" />
            </div>
          </div>

          <h2 className="text-lg sm:text-2xl font-display font-bold text-foreground mb-1">
            🎉 Welcome to GlobalPay Africa!
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground">
            You've just received a gift
          </p>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          
          <div className="bg-accent/10 border border-accent/30 rounded-xl p-3 sm:p-5">
            <p className="text-xs sm:text-sm text-muted-foreground mb-1">
              Your Free Bonus
            </p>
            <p className="text-2xl sm:text-4xl font-display font-bold text-accent">
              KSH 500
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
              ≈ $3.85 USD
            </p>
          </div>

          <div className="bg-secondary/50 rounded-lg p-2 sm:p-3">
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              🔒 Deposit at least <strong className="text-foreground">KSH 100</strong> to unlock your bonus and start withdrawing
            </p>
          </div>

          <Button onClick={onClose} className="w-full text-sm sm:text-base py-2 sm:py-3">
            Claim  Bonus Now 🚀
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeBonusDialog;