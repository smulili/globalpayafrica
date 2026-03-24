import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useCryptoPrices } from '@/hooks/useCryptoPrices';
import { ArrowDownToLine, ArrowUpFromLine, Gift, Lock, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import WelcomeBonusDialog from '@/components/WelcomeBonusDialog';

const USD_TO_KSH = 129;

const DashboardHome = () => {
  const { profile } = useAuth();
  const { prices, loading } = useCryptoPrices();
  const [showUsd, setShowUsd] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const navigate = useNavigate();

  const balanceKsh = profile?.balance_ksh || 0;
  const balanceUsd = (balanceKsh / USD_TO_KSH).toFixed(2);
  const bonusLocked = profile?.bonus_locked ?? true;
  const bonusAmount = profile?.bonus_ksh || 500;
  const totalKsh = bonusLocked ? balanceKsh : balanceKsh + bonusAmount;
  const totalUsd = (totalKsh / USD_TO_KSH).toFixed(2);

  useEffect(() => {
    if (profile) {
      const welcomeKey = `gpa_welcome_shown_${profile.user_id}`;
      if (!localStorage.getItem(welcomeKey)) {
        setShowWelcome(true);
        localStorage.setItem(welcomeKey, 'true');
      }
    }
  }, [profile]);

  const handleSendReceive = (type: 'deposit' | 'withdraw') => {
    navigate(`/dashboard/${type}`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <WelcomeBonusDialog open={showWelcome} onClose={() => setShowWelcome(false)} />

      {/* Referral Banner */}
      <div className="glass-card p-4 border-accent/30 bg-gradient-to-r from-accent/10 to-accent/5">
        <div className="flex items-center gap-3">
          <Gift className="h-8 w-8 text-accent shrink-0" />
          <div className="flex-1">
            <h3 className="font-display font-bold text-accent">Earn $50!</h3>
            <p className="text-sm text-muted-foreground">
              Refer 3 friends with successful deposits and withdrawals
            </p>
          </div>
          <Button variant="gold" size="sm" onClick={() => navigate('/dashboard/referrals')}>
            Refer Now
          </Button>
        </div>
      </div>

      {/* Balance Card */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Wallet className="h-4 w-4" /> Available Balance
          </p>
          <button
            onClick={() => setShowUsd(!showUsd)}
            className="text-xs bg-secondary px-3 py-1 rounded-full text-muted-foreground hover:text-foreground transition-colors"
          >
            {showUsd ? 'Show KSH' : 'Show USD'}
          </button>
        </div>
        <h2 className="text-4xl font-display font-bold text-foreground mb-1">
          {showUsd ? `$${balanceUsd}` : `KSH ${balanceKsh.toLocaleString()}`}
        </h2>
        <p className="text-xs text-muted-foreground">
          ≈ {showUsd ? `KSH ${balanceKsh.toLocaleString()}` : `$${balanceUsd}`} (1 USD = 129 KSH)
        </p>

        {/* Bonus Section */}
        {bonusLocked && (
          <div className="flex items-center gap-3 mt-4 bg-accent/10 border border-accent/20 rounded-lg p-4">
            <Lock className="h-5 w-5 text-accent shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-accent">
                KSH {bonusAmount.toLocaleString()} Promo Gift 🎁
              </p>
              <p className="text-xs text-muted-foreground">
                Do First Deposit at least KSH 100($0.78) to get free 500 KSH ($3.88) and withdraw instantly!
              </p>
            </div>
          </div>
        )}

        {!bonusLocked && bonusAmount > 0 && (
          <div className="flex items-center gap-3 mt-4 bg-primary/10 border border-primary/20 rounded-lg p-4">
            <Gift className="h-5 w-5 text-primary shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-primary">
                KSH {bonusAmount.toLocaleString()} Bonus Unlocked! 🎉
              </p>
              <p className="text-xs text-muted-foreground">
                Total balance: KSH {totalKsh.toLocaleString()} (≈ ${totalUsd})
              </p>
            </div>
          </div>
        )}
        

        <div className="grid grid-cols-2 gap-3 mt-6">
          <Button size="lg" onClick={() => handleSendReceive('deposit')} className="w-full">
            <ArrowDownToLine className="h-5 w-5 mr-2" />
            Deposit
          </Button>
          <Button size="lg" variant="outline" onClick={() => handleSendReceive('withdraw')} className="w-full">
            <ArrowUpFromLine className="h-5 w-5 mr-2" />
            Withdraw
          </Button>
        </div>
      </div>

      {/* How to Deposit */}
      <div className="glass-card p-5">
        <h3 className="font-display font-semibold text-foreground mb-3">How to Deposit</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>1. Click <strong className="text-foreground">Deposit</strong> and choose M-Pesa, Airtel Money, Bank or Crypto</p>
          <p>2. For M-Pesa / Airtel: Enter amount & phone → Receive STK push on your phone</p>
          <p>3. For Bank: Enter amount → Complete via Paystack checkout</p>
          <p>4. For Crypto: Send USDT/BTC to the provided network address</p>
          <p>5. Your balance updates once the transaction is confirmed</p>
        </div>
      </div>

      {/* Live Crypto Prices */}
      <div className="glass-card p-5">
        <h3 className="font-display font-semibold text-foreground mb-4">Live Prices</h3>
        {loading ? (
          <div className="text-center text-muted-foreground py-8">Loading prices...</div>
        ) : (
          <div className="space-y-2">
            {prices.map((coin) => (
              <div key={coin.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-3">
                  <img src={coin.image} alt={coin.name} className="h-8 w-8 rounded-full" />
                  <div>
                    <p className="font-medium text-foreground text-sm">{coin.name}</p>
                    <p className="text-xs text-muted-foreground uppercase">{coin.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground text-sm">
                    ${coin.current_price.toLocaleString()}
                  </p>
                  <div className={`flex items-center gap-1 text-xs ${coin.price_change_percentage_24h >= 0 ? 'text-primary' : 'text-destructive'}`}>
                    {coin.price_change_percentage_24h >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center py-6 border-t border-border">
        <div className="flex justify-center items-center gap-2 mb-2">
          <span className="text-2xl">🇰🇪</span>
          <span className="font-display font-bold text-accent text-sm">HII NI YETU. PAMOJA TWASONGA</span>
        </div>
        <p className="text-xs text-muted-foreground">
          © 2024 Global Pay Africa. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Send Money from M-Pesa to Crypto Instantly. Fast, secure payments across Africa.
        </p>
      </footer>
    </div>
  );
};

export default DashboardHome;
