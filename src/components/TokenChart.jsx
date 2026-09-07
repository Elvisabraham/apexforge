import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries, HistogramSeries } from 'lightweight-charts';

export default function TokenChart({ currentToken, chartMode = 'price' }) {
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
        fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif', 
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.03)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.03)' },
      },
      localization: {
        // DYNAMIC FORMATTER: Changes based on Price or MCap mode
        priceFormatter: (value) => {
          if (chartMode === 'mcap') {
            if (value >= 1000000) return '$' + (value / 1000000).toFixed(2) + 'M';
            if (value >= 1000) return '$' + (value / 1000).toFixed(2) + 'K';
            return '$' + value.toFixed(2);
          } else {
            if (value < 0.001) return '$' + value.toFixed(6);
            if (value < 1) return '$' + value.toFixed(4);
            return '$' + value.toFixed(2);
          }
        },
      },
      timeScale: {
        timeVisible: true,
        borderVisible: false,
        rightOffset: 10,
        barSpacing: 8,
      },
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: {
          top: 0.1,
          bottom: 0.25, 
        },
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

    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: '#26a69a',
      priceFormat: { type: 'volume' },
      priceScaleId: '', 
      lastValueVisible: false, // FIX: This completely removes the weird second red label
      priceLineVisible: false,
    });
    
    volumeSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    // Extract exact numbers for Price vs Market Cap
    const rawPrice = parseFloat(String(currentToken?.price || '0.05439').replace(/[^0-9.]/g, ''));
    let rawMcap = 10880; 
    if (currentToken?.mcap) {
      const mStr = String(currentToken.mcap).toUpperCase();
      const mNum = parseFloat(mStr.replace(/[^0-9.]/g, ''));
      if (mStr.includes('M')) rawMcap = mNum * 1000000;
      else if (mStr.includes('K')) rawMcap = mNum * 1000;
      else rawMcap = mNum;
    }

    // Set the target based on the current mode
    const targetValue = chartMode === 'mcap' ? rawMcap : rawPrice;
    
    const candleData = [];
    const volumeData = [];
    let time = Math.floor(Date.now() / 1000); 
    let closePrice = targetValue; 

    for (let i = 0; i < 500; i++) {
      // FIX: Lowered volatility to 1.2% so candles stay tall and beautiful
      const volatility = closePrice * 0.012; 
      const openPrice = closePrice - (Math.random() - 0.45) * volatility; 
      const high = Math.max(openPrice, closePrice) + (Math.random() * volatility * 0.5);
      const low = Math.min(openPrice, closePrice) - (Math.random() * volatility * 0.5);
      
      const isGreen = closePrice >= openPrice;
      const volumeAmount = Math.floor(Math.random() * 50000) + 10000;

      candleData.unshift({ time: time - (i * 900), open: openPrice, high, low, close: closePrice });
      volumeData.unshift({
        time: time - (i * 900),
        value: volumeAmount,
        color: isGreen ? 'rgba(0, 242, 161, 0.4)' : 'rgba(242, 54, 69, 0.4)'
      });

      closePrice = openPrice; 
    }

    candlestickSeries.setData(candleData);
    volumeSeries.setData(volumeData);
    
    chart.timeScale().fitContent();

    const handleResize = () => {
      if (!chartContainerRef.current) return;
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [currentToken, chartMode]); // Re-draws chart anytime the token OR the mode changes

  return <div ref={chartContainerRef} className="absolute inset-0 w-full h-full" />;
}