import React, { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

export default function TokenChart() {
  const chartContainerRef = useRef();

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // 1. Initialize the Chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#71717a', // zinc-500
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.03)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.03)' },
      },
      timeScale: {
        timeVisible: true,
        borderVisible: false,
      },
      rightPriceScale: {
        borderVisible: false,
      },
      crosshair: {
        vertLine: { color: '#71717a', labelBackgroundColor: '#121318' },
        horzLine: { color: '#71717a', labelBackgroundColor: '#121318' },
      }
    });

    // 2. Configure the Candlestick Series matching your brand colors
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#00f2a1',
      downColor: '#F23645',
      borderVisible: false,
      wickUpColor: '#00f2a1',
      wickDownColor: '#F23645',
    });

    // 3. Generate Realistic Bonding Curve Dummy Data
    const data = [];
    let time = Math.floor(Date.now() / 1000) - 86400; // Start 24h ago
    let price = 0.000050;

    for (let i = 0; i < 100; i++) {
      const volatility = price * 0.08;
      const open = price;
      // Slight upward bias to simulate a trending pump token
      const close = open + (Math.random() - 0.42) * volatility; 
      const high = Math.max(open, close) + Math.random() * (volatility * 0.5);
      const low = Math.min(open, close) - Math.random() * (volatility * 0.5);
      
      data.push({ time, open, high, low, close });
      time += 900; // 15m intervals
      price = close;
    }

    candlestickSeries.setData(data);

    // 4. Handle Responsive Resizing
    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    chart.timeScale().fitContent();

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  return <div ref={chartContainerRef} className="absolute inset-0 w-full h-full" />;
}