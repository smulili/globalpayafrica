import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowUpFromLine, Smartphone, Coins, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const USER_ID = "54c60bee-5d16-4245-9ea9-75b8be7fc21a";

const WithdrawPage = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [method, setMethod] = useState<'mobile' | 'crypto' | null>(null);

  // 🔔 FAKE LIVE WITHDRAWALS
  useEffect(() => {
    const interval = setInterval(() => {
      const amounts = [2, 31, 5, 1, 4, 24, 3, 50, 1, 4];
      const amt = amounts[Math.floor(Math.random() * amounts.length)];

      toast.success(`User ${USER_ID.slice(0, 6)}*** withdrew $${amt}`, {
        position: "top-right",
        duration: 3000,
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full px-4 md:px-10 lg:px-20 space-y-8">

      {/* 🔥 TOP BANNER */}
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
            Earn 500 KES ($4) BONUS 🎉
          </p>

          <p className="text-sm text-white/90 mt-1 mb-4">
            Withdraw instantly after deposit
          </p>

          <Button
            size="lg"
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-3 rounded-xl shadow-lg"
            onClick={() => navigate('/dashboard/deposit')}
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
              <Smartphone className="h-10 w-10 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-display font-semibold text-foreground mb-1">M-Pesa</h3>
              <p className="text-sm text-muted-foreground">Withdraw to your M-Pesa number</p>
            </button>

            <button
              onClick={() => setMethod('crypto')}
              className="glass-card p-6 text-left hover:border-primary/50 transition-all group"
            >
              <Coins className="h-10 w-10 text-accent mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-display font-semibold text-foreground mb-1">Crypto (USDT)</h3>
              <p className="text-sm text-muted-foreground">Send USDT to any wallet</p>
            </button>
          </div>

          {/* PROCEDURE */}
          <div className="glass-card p-4 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground mb-2">Withdrawal Procedure:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Deposit first to unlock withdrawals</li>
              <li>Select M-Pesa or Crypto</li>
              <li>Minimum withdrawal is KSH 49</li>
              <li>Withdrawals are processed instantly</li>
            </ul>
          </div>
        </>
      ) : (
        /* 🔥 BLOCKING BANNER */
        <div className="glass-card p-8 text-center space-y-4">

          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto" />

          <h2 className="text-xl font-bold text-foreground">
            Insufficient Funds
          </h2>

          <p className="text-sm text-muted-foreground">
            You cannot withdraw at the moment.
          </p>

          <p className="text-sm font-semibold text-primary">
  Deposit at least <span className="text-yellow-500">100 KSH ($0.78)</span> 
  to unlock your <span className="text-green-500">FREE 500 KSH ($3.88) bonus</span>.
</p>

          <Button
            size="lg"
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold w-full"
            onClick={() => navigate('/dashboard/deposit')}
          >
            Deposit Now
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMethod(null)}
            className="w-full"
          >
            ← Back
          </Button>

        </div>
      )}
    </div>
  );
};

export default WithdrawPage;