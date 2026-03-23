import React from 'react';
import { Gift } from 'lucide-react';

const EarnPage = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Gift className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-display font-bold text-foreground">Earn</h1>
      </div>
      <div className="glass-card p-8 text-center">
        <Gift className="h-12 w-12 text-accent mx-auto mb-3" />
        <h3 className="font-display font-bold text-foreground text-lg mb-2">Earning opportunities coming soon!</h3>
        <p className="text-muted-foreground text-sm">Stay tuned for staking, rewards, and more ways to earn.</p>
      </div>
    </div>
  );
};

export default EarnPage;
