import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';

export default function TokenChart() {
  const chartContainerRef = useRef();

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const width = chartContainerRef.current.clientWidth || 600;
    const height = chartContainerRef.current.clientHeight || 350;

    const chart = createChart(chartContainerRef.current, {
      width,
      height,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#71717a',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.03)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.03)' },
      },
      timeScale: {
        timeVisible: true,
        borderVisible: false,
        barSpacing: 12,
        minBarSpacing: 4,
        rightOffset: 8,
      },
      rightPriceScale: {
        borderVisible: false,
      },
      crosshair: {
        vertLine: { color: '#71717a', labelBackgroundColor: '#121318' },
        horzLine: { color: '#71717a', labelBackgroundColor: '#121318' },
      }
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#00f2a1',
      downColor: '#F23645',
      borderVisible: false,
      wickUpColor: '#00f2a1',
      wickDownColor: '#F23645',
    });

    // Generate 250 candles to fill wide screens
    const data = [];
    let time = Math.floor(Date.now() / 1000) - (250 * 900);
    let price = 0.000035;

    for (let i = 0; i < 250; i++) {
      const volatility = price * 0.07;
      const open = price;
      const close = open + (Math.random() - 0.47) * volatility;
      const high = Math.max(open, close) + Math.random() * (volatility * 0.4);
      const low = Math.min(open, close) - Math.random() * (volatility * 0.4);

      data.push({ time, open, high, low, close });
      time += 900;
      price = Math.max(0.00001, close);
    }

    candlestickSeries.setData(data);
    chart.timeScale().fitContent();

    const handleResize = () => {
      if (!chartContainerRef.current) return;
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
      });
      chart.timeScale().fitContent();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  return <div ref={chartContainerRef} className="absolute inset-0 w-full h-full" />;
}