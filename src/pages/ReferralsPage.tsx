import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Copy, Check, Users, Gift } from 'lucide-react';
import { toast } from 'sonner';

const ReferralsPage = () => {
  const { profile } = useAuth();
  const [copied, setCopied] = React.useState(false);
  const referralCode = profile?.referral_code || 'LOADING...';
  const referralCount = profile?.referral_count || 0;

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success('Referral code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Users className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-display font-bold text-foreground">Referrals</h1>
      </div>

      <div className="glass-card p-6 border-accent/30 bg-gradient-to-r from-accent/10 to-accent/5">
        <div className="flex items-center gap-3 mb-4">
          <Gift className="h-8 w-8 text-accent" />
          <div>
            <h3 className="font-display font-bold text-accent text-lg">Earn $50</h3>
            <p className="text-sm text-muted-foreground">Refer 3 friends who make successful deposits and withdrawals</p>
          </div>
        </div>

        <div className="bg-secondary/50 rounded-lg p-4 mb-4">
          <p className="text-xs text-muted-foreground mb-2">Your Referral Code</p>
          <div className="flex items-center gap-3">
            <code className="text-2xl font-display font-bold text-foreground tracking-wider flex-1">{referralCode}</code>
            <Button variant="outline" size="icon" onClick={copyCode}>
              {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-secondary/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-display font-bold text-foreground">{referralCount}</p>
            <p className="text-xs text-muted-foreground">Friends Referred</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-display font-bold text-foreground">{Math.max(0, 3 - referralCount)}</p>
            <p className="text-xs text-muted-foreground">More to Earn $50</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-5">
        <h3 className="font-display font-semibold text-foreground mb-3">How it works</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>1. Share your referral code with friends</p>
          <p>2. They create an account and enter your code</p>
          <p>3. Once 3 friends make successful deposits & withdrawals</p>
          <p>4. You earn <strong className="text-accent">$50</strong> credited to your balance!</p>
        </div>
      </div>
    </div>
  );
};

export default ReferralsPage;
