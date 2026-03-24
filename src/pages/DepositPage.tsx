import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowDownToLine, Smartphone, Coins, Copy, Check, Loader2, CreditCard, Building2, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useSearchParams } from 'react-router-dom';
import PaystackPop from '@paystack/inline-js';

// ===== CRYPTO NETWORKS =====
const USDT_NETWORKS = [
  { name: 'ERC 20 (Ethereum)', address: '0xeA64EA750eA1958f17C853a72cDBc83f8d6C71f7' },
  { name: 'Solana', address: 'HQHjVNhMKwPrUxnsnAgqUAVRrMLhLr6nnK1zWA3z2uha' },
  { name: 'Tron (TRC 20)', address: 'TMCas22AMA9xuuESyEGJugjwC4eMK81HJa' },
  { name: 'XPL', address: '0xeA64EA750eA1958f17C853a72cDBc83f8d6C71f7' },
  { name: 'BEP 20 (BSC)', address: '0xeA64EA750eA1958f17C853a72cDBc83f8d6C71f7' },
];

const BTC_ADDRESS = 'bc1qjczcmj5cpzmlju38m7ck7pqssq3zecz5dma0ww';

// ===== PAYMENT CHANNELS =====
type PaymentChannel = 'mpesa' | 'airtel' | 'bank' | null;

const PAYMENT_CHANNELS = [
  { id: 'mpesa' as PaymentChannel, name: 'M-Pesa', icon: Phone, description: 'STK Push to your phone', color: 'text-primary', bgColor: 'bg-primary/10 border-primary/20' },
  { id: 'airtel' as PaymentChannel, name: 'Airtel Money', icon: Smartphone, description: 'STK Push to your phone', color: 'text-destructive', bgColor: 'bg-destructive/10 border-destructive/20' },
  { id: 'bank' as PaymentChannel, name: 'Bank / Card', icon: Building2, description: 'Pay via bank or card', color: 'text-accent', bgColor: 'bg-accent/10 border-accent/20' },
];

// ===== SLIDER IMAGES =====
const SLIDER_IMAGES = [
  "https://static.vecteezy.com/system/resources/thumbnails/049/102/349/original/pay-text-on-coins-stack-increase-with-business-data-hologram-business-growth-concept-free-video.jpg",
  "https://content.mtfxgroup.com/uploads/image_2024_12_11_T15_28_05_064_Z_45054807eb.jpg", // correct direct URL
];

// ===== SLIDER BANNER =====
const SliderBanner = () => {
  const [index, setIndex] = useState(0);

  // 2 months countdown in seconds (~60 days)
  const TWO_MONTHS_SECONDS = 60 * 24 * 60 * 60;
  const [countdown, setCountdown] = useState(TWO_MONTHS_SECONDS);

  useEffect(() => {
    const interval = setInterval(() => setIndex((prev) => (prev + 1) % SLIDER_IMAGES.length), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const days = Math.floor(countdown / (24 * 3600));
  const hours = Math.floor((countdown % (24 * 3600)) / 3600);
  const minutes = Math.floor((countdown % 3600) / 60);
  const seconds = countdown % 60;

  return (
    <div className="relative w-full h-64 overflow-hidden shadow-lg">
      <img
        src={SLIDER_IMAGES[index]}
        alt="Banner"
        className="w-full h-full object-cover transition-opacity duration-1000"
      />
      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center px-0">
        <h1 className="text-3xl md:text-5xl font-extrabold text-yellow-400">GET 500 KSH($3.88)</h1>
        <p className="text-xl font-bold text-white mt-2">After Your First Deposit 🎉</p>
        <div className="flex items-center gap-3 mt-4">
          <Button
            size="lg"
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-3 rounded-xl shadow-lg"
            onClick={() => toast.success('Bonus  claimed!')}
          >
            Claim
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-white border-white hover:bg-white/10 rounded-xl px-6 py-3"
            disabled
          >
            {days}d {hours}h {minutes}m {seconds}s
          </Button>
        </div>
      </div>
    </div>
  );
};

// ===== DEPOSIT PAGE =====
const DepositPage = () => {
  const [method, setMethod] = useState<'mobile' | 'crypto' | null>(null);
  const [channel, setChannel] = useState<PaymentChannel>(null);
  const [copiedAddr, setCopiedAddr] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { profile, refreshProfile } = useAuth();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const reference = searchParams.get('reference') || searchParams.get('trxref');
    if (reference) verifyPayment(reference);
  }, [searchParams]);

  const copyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopiedAddr(addr);
    toast.success('Address copied!');
    setTimeout(() => setCopiedAddr(null), 2000);
  };

  const verifyPayment = async (reference: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('paystack-verify', { body: { reference } });
      if (error) throw error;
      if (data.status === 'completed') {
        toast.success(`Deposit of KSH ${data.amount_ksh} confirmed! 🎉`);
        await refreshProfile();
      } else if (data.status === 'failed') {
        toast.error('Payment failed');
      } else {
        toast.info('Payment still processing, check again later');
      }
    } catch (err: any) {
      toast.error(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const payWithPaystack = () => {
    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum < 10) {
      toast.error('Minimum deposit is KSH 10');
      return;
    }
    if (!profile?.email) {
      toast.error('User email not found');
      return;
    }

    const handler = PaystackPop.setup({
      key: 'pk_live_db02edc656718a8a184b9e1c7f0632396d3f3bfa',
      email: profile.email,
      amount: amountNum * 100,
      currency: 'KES',
      channels: ['card', 'bank', 'ussd', 'mobile_money'],
      ref: '' + Math.floor(Math.random() * 1000000000 + 1),
      onClose: () => toast.error('Payment cancelled'),
      callback: (response: any) => verifyPayment(response.reference),
    });

    handler.openIframe();
  };

  const amountNum = parseFloat(amount) || 0;
  const usdEquiv = (amountNum / 129).toFixed(2);

  return (
    <div className="max-w-full mx-auto space-y-6">
      <SliderBanner />

      <div className="flex items-center gap-3 mb-2 px-4">
        <ArrowDownToLine className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-display font-bold text-foreground">Deposit</h1>
      </div>

      {!method ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4">
          <button
            onClick={() => setMethod('mobile')}
            className="glass-card p-6 text-left hover:border-primary/50 transition-all group"
          >
            <Smartphone className="h-10 w-10 text-primary mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-display font-semibold text-foreground mb-1">Mobile Money</h3>
            <p className="text-sm text-muted-foreground">M-Pesa, Airtel Money, Bank</p>
            <p className="text-xs text-primary mt-2">STK Push & Paystack Checkout</p>
          </button>
          <button
            onClick={() => setMethod('crypto')}
            className="glass-card p-6 text-left hover:border-primary/50 transition-all group"
          >
            <Coins className="h-10 w-10 text-accent mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-display font-semibold text-foreground mb-1">Crypto (USDT / BTC)</h3>
            <p className="text-sm text-muted-foreground">Send to network address</p>
            <p className="text-xs text-accent mt-2">Multiple networks available</p>
          </button>
        </div>
      ) : method === 'mobile' ? (
        <MobileDeposit
          channel={channel}
          setChannel={setChannel}
          amount={amount}
          setAmount={setAmount}
          amountNum={amountNum}
          usdEquiv={usdEquiv}
          loading={loading}
          payWithPaystack={payWithPaystack}
        />
      ) : (
        <CryptoDeposit copiedAddr={copiedAddr} copyAddress={copyAddress} onBack={() => setMethod(null)} />
      )}
    </div>
  );
};

// ===== MOBILE DEPOSIT COMPONENT =====
const MobileDeposit = ({
  channel,
  setChannel,
  amount,
  setAmount,
  amountNum,
  usdEquiv,
  loading,
  payWithPaystack,
}: any) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="font-display font-semibold text-foreground">Mobile Money Deposit</h3>
      <Button variant="ghost" size="sm" onClick={() => setChannel(null)}>← Back</Button>
    </div>

    {!channel ? (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">Choose your payment method:</p>
        <div className="grid grid-cols-1 gap-3">
          {PAYMENT_CHANNELS.map((ch) => (
            <button
              key={ch.id}
              onClick={() => setChannel(ch.id)}
              className={`glass-card p-4 text-left hover:scale-[1.02] transition-all flex items-center gap-4 border ${ch.bgColor}`}
            >
              <div className={`p-3 rounded-xl ${ch.bgColor}`}>
                <ch.icon className={`h-6 w-6 ${ch.color}`} />
              </div>
              <div className="flex-1">
                <h4 className={`font-display font-semibold ${ch.color}`}>{ch.name}</h4>
                <p className="text-xs text-muted-foreground">{ch.description}</p>
              </div>
              <span className="text-muted-foreground">→</span>
            </button>
          ))}
        </div>
      </div>
    ) : (
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {PAYMENT_CHANNELS.find(c => c.id === channel) && (() => {
              const ch = PAYMENT_CHANNELS.find(c => c.id === channel)!;
              return (
                <>
                  <ch.icon className={`h-5 w-5 ${ch.color}`} />
                  <span className={`font-display font-semibold ${ch.color}`}>{ch.name}</span>
                </>
              );
            })()}
          </div>
          <Button variant="ghost" size="sm" onClick={() => setChannel(null)}>Change</Button>
        </div>

        <div>
          <Label htmlFor="deposit-amount">Amount (KSH)</Label>
          <Input
            id="deposit-amount"
            type="number"
            min="10"
            placeholder="Enter amount (min KSH 10)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-secondary border-border text-lg"
          />
          {amountNum > 0 && <p className="text-xs text-muted-foreground mt-1">≈ ${usdEquiv} USD</p>}
        </div>

        {amountNum >= 10 && (
          <div className="bg-secondary/50 rounded-lg p-3 text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="text-foreground">KSH {amountNum.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fee (1%)</span>
              <span className="text-foreground">KSH {(amountNum * 0.01).toFixed(2)}</span>
            </div>
            <div className="border-t border-border pt-1 flex justify-between font-semibold">
              <span className="text-muted-foreground">You receive</span>
              <span className="text-primary">KSH {(amountNum * 0.99).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">USD equivalent</span>
              <span className="text-muted-foreground">${usdEquiv}</span>
            </div>
          </div>
        )}

        <Button
          size="lg"
          className="w-full"
          disabled={loading || amountNum < 10}
          onClick={payWithPaystack}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              {channel === 'bank' ? <CreditCard className="mr-2 h-5 w-5" /> : <Phone className="mr-2 h-5 w-5" />}
              {channel === 'bank'
                ? `Pay KSH ${amountNum.toLocaleString()} via Bank/Card`
                : `Pay KSH ${amountNum.toLocaleString()} via ${channel === 'mpesa' ? 'M-Pesa' : 'Airtel Money'}`
              }
            </>
          )}
        </Button>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <span>🔒 Secured by</span>
          <span className="font-semibold text-foreground">Paystack</span>
        </div>
      </div>
    )}
  </div>
);

// ===== CRYPTO DEPOSIT COMPONENT =====
const CryptoDeposit = ({
  copiedAddr,
  copyAddress,
  onBack,
}: {
  copiedAddr: string | null;
  copyAddress: (addr: string) => void;
  onBack: () => void;
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="font-display font-semibold text-foreground">Send Crypto to Deposit</h3>
      <Button variant="ghost" size="sm" onClick={onBack}>← Back</Button>
    </div>

    <div className="glass-card p-5">
      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
        <Coins className="h-4 w-4 text-primary" /> USDT Networks
      </h4>
      <div className="space-y-3">
        {USDT_NETWORKS.map((net) => (
          <div key={net.name} className="bg-secondary/50 rounded-lg p-3">
            <p className="text-xs text-primary font-medium mb-1">{net.name}</p>
            <div className="flex items-center gap-2">
              <code className="text-xs text-foreground bg-background/50 px-2 py-1 rounded flex-1 overflow-hidden text-ellipsis">
                {net.address}
              </code>
              <button
                onClick={() => copyAddress(net.address)}
                className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
              >
                {copiedAddr === net.address ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="glass-card p-5">
      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
        <Coins className="h-4 w-4 text-accent" /> BTC
      </h4>
      <div className="bg-secondary/50 rounded-lg p-3">
        <p className="text-xs text-accent font-medium mb-1">Bitcoin Network</p>
        <div className="flex items-center gap-2">
          <code className="text-xs text-foreground bg-background/50 px-2 py-1 rounded flex-1 overflow-hidden text-ellipsis">
            {BTC_ADDRESS}
          </code>
          <button
            onClick={() => copyAddress(BTC_ADDRESS)}
            className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
          >
            {copiedAddr === BTC_ADDRESS ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>

    <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
      <p className="text-xs text-accent">
        ⚠️ Only send USDT or BTC to the correct network address. Sending to the wrong network may result in permanent loss of funds. A deposit fee of 1% applies.
      </p>
    </div>
  </div>
);

export default DepositPage;