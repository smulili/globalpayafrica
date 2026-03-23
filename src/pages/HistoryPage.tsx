import React, { useEffect, useState } from 'react';
import { History as HistoryIcon, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const HistoryPage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchTx = async () => {
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setTransactions(data || []);
      setLoading(false);
    };
    fetchTx();
  }, [user]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <HistoryIcon className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-display font-bold text-foreground">Transaction History</h1>
      </div>

      {loading ? (
        <div className="glass-card p-8 text-center text-muted-foreground">Loading...</div>
      ) : transactions.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <HistoryIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No transactions yet</p>
          <p className="text-sm text-muted-foreground mt-1">Your deposit and withdrawal history will appear here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.map((tx) => (
            <div key={tx.id} className="glass-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {tx.type === 'deposit' || tx.type === 'receive' ? (
                  <ArrowDownToLine className="h-5 w-5 text-primary" />
                ) : (
                  <ArrowUpFromLine className="h-5 w-5 text-destructive" />
                )}
                <div>
                  <p className="font-medium text-foreground text-sm capitalize">{tx.type}</p>
                  <p className="text-xs text-muted-foreground">{tx.method} • {new Date(tx.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-foreground text-sm">KSH {tx.amount_ksh}</p>
                <p className={`text-xs capitalize ${tx.status === 'completed' ? 'text-primary' : tx.status === 'failed' ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {tx.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
