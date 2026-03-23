import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, ArrowRight, Smartphone, Coins, CreditCard } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="GlobalPay Logo"/>
            <span className="font-display font-bold text-xl text-foreground">
              Global<span className="text-primary">Pay</span> Africa
            </span>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => navigate('/auth')}>Sign In</Button>
            <Button onClick={() => navigate('/auth')}>Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-4 leading-tight">
          Send Money from M-Pesa<br />
          <span className="text-primary">to Crypto Instantly</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Fast, secure payments across Africa using mobile money, cards, and crypto.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Button size="lg" onClick={() => navigate('/auth')}>
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/auth')}>
            Create Wallet
          </Button>
        </div>

        {/* Payment Methods */}
        <div className="flex flex-wrap justify-center gap-6 text-muted-foreground">
          <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full">
            <Smartphone className="h-5 w-5 text-primary" />
            <span className="text-sm">M-Pesa</span>
          </div>
          <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full">
            <Smartphone className="h-5 w-5 text-primary" />
            <span className="text-sm">Airtel Money</span>
          </div>
          <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full">
            <CreditCard className="h-5 w-5 text-primary" />
            <span className="text-sm">Visa / Mastercard</span>
          </div>
          <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full">
            <Coins className="h-5 w-5 text-accent" />
            <span className="text-sm">USDT / BTC</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-card p-6 text-center">
            <img src="/logo2.png" alt="GlobalPay Logo" className="h-8 w-auto" />
            <h3 className="font-display font-semibold text-foreground mb-2">Secure & Trusted</h3>
            <p className="text-sm text-muted-foreground">Bank-grade encryption for all transactions</p>
          </div>
          <div className="glass-card p-6 text-center">
            <Coins className="h-10 w-10 text-accent mx-auto mb-3" />
            <h3 className="font-display font-semibold text-foreground mb-2">Multiple Crypto Networks</h3>
            <p className="text-sm text-muted-foreground">ERC20, TRC20, Solana, BEP20 and more</p>
          </div>
          <div className="glass-card p-6 text-center">
            <Smartphone className="h-10 w-10 text-primary mx-auto mb-3" />
            <h3 className="font-display font-semibold text-foreground mb-2">Mobile Money Integration</h3>
            <p className="text-sm text-muted-foreground">Deposit and withdraw via M-Pesa instantly</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-3">
            <span className="text-3xl">🇰🇪</span>
            <span className="font-display font-bold text-accent">HII NI YETU. PAMOJA TWASONGA</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 Global Pay Africa. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
