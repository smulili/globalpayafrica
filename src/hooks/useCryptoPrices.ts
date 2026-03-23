import React, { useEffect, useState } from 'react';

interface CoinPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}

const COINS = ['bitcoin', 'ethereum', 'tether', 'binancecoin', 'solana', 'ripple', 'cardano', 'dogecoin'];

export const useCryptoPrices = () => {
  const [prices, setPrices] = useState<CoinPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [usdToKsh, setUsdToKsh] = useState(129);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${COINS.join(',')}&order=market_cap_desc`
        );
        const data = await res.json();
        setPrices(data);
      } catch (err) {
        console.error('Failed to fetch prices:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  return { prices, loading, usdToKsh };
};
