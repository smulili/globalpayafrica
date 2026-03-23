import React from 'react';
import { Gamepad2 } from 'lucide-react';

const GamesPage = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Gamepad2 className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-display font-bold text-foreground">Games</h1>
      </div>
      <div className="glass-card p-8 text-center">
        <Gamepad2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <h3 className="font-display font-bold text-foreground text-lg mb-2">Coming Soon!</h3>
        <p className="text-muted-foreground text-sm">Exciting games with real rewards are on the way.</p>
      </div>
    </div>
  );
};

export default GamesPage;
