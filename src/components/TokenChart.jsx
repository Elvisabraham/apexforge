import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries, HistogramSeries } from 'lightweight-charts';

export default function TokenChart({ currentToken, historicalData = [], liveTradeTick = null }) {
  const chartContainerRef = useRef();
  const legendRef = useRef();
  
  // High-performance refs to hold series without triggering React re-renders
  const seriesRef = useRef({ candle: null, volume: null });
  const currentCandleRef = useRef(null);

  // =========================================================================
  // 1. CHART INITIALIZATION (Mainnet Secure - Runs once on mount)
  // =========================================================================
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create Chart Instance
    const chart = createChart(chartContainerRef.current, {
      layout: { background: { type: ColorType.Solid, color: 'transparent' }, textColor: '#71717a', fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' },
      grid: { vertLines: { color: 'rgba(255, 255, 255, 0.03)' }, horzLines: { color: 'rgba(255, 255, 255, 0.03)' } },
      timeScale: { timeVisible: true, borderVisible: false, rightOffset: 10, barSpacing: 8 },
      rightPriceScale: { borderVisible: false, scaleMargins: { top: 0.15, bottom: 0.25 } },
      crosshair: { vertLine: { color: '#71717a' }, horzLine: { color: '#71717a' } }
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#00f2a1', downColor: '#F23645', borderVisible: false, wickUpColor: '#00f2a1', wickDownColor: '#F23645',
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: '#26a69a', priceFormat: { type: 'volume' }, priceScaleId: '', lastValueVisible: false, priceLineVisible: false,
    });
    volumeSeries.priceScale().applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });

    seriesRef.current = { candle: candlestickSeries, volume: volumeSeries };

    // Load REAL Historical Data from your database
    if (historicalData && historicalData.length > 0) {
      candlestickSeries.setData(historicalData.map(d => ({ time: d.time, open: d.open, high: d.high, low: d.low, close: d.close })));
      volumeSeries.setData(historicalData.map(d => ({ time: d.time, value: d.volume, color: d.close >= d.open ? 'rgba(0, 242, 161, 0.4)' : 'rgba(242, 54, 69, 0.4)' })));
      currentCandleRef.current = historicalData[historicalData.length - 1];
    }
    
    chart.timeScale().fitContent();

    // OHLC Legend Engine
    const updateLegend = (param) => {
      if (!legendRef.current) return;
      let candle = currentCandleRef.current;
      
      if (param && param.time && param.point.x > 0) {
        const crosshairCandle = param.seriesData.get(candlestickSeries);
        if (crosshairCandle) candle = crosshairCandle;
      }

      if (!candle) return;
      const colorClass = candle.close >= candle.open ? 'text-[#00f2a1]' : 'text-[#F23645]';
      
      legendRef.current.innerHTML = `
        <div class="flex items-center gap-3 text-[10px] font-mono tracking-tight bg-[#0c0d10]/80 backdrop-blur rounded px-2 py-0.5 border border-white/5">
          <span class="text-zinc-500">O<span class="${colorClass} ml-1">${candle.open.toFixed(8)}</span></span>
          <span class="text-zinc-500">H<span class="${colorClass} ml-1">${candle.high.toFixed(8)}</span></span>
          <span class="text-zinc-500">L<span class="${colorClass} ml-1">${candle.low.toFixed(8)}</span></span>
          <span class="text-zinc-500">C<span class="${colorClass} ml-1">${candle.close.toFixed(8)}</span></span>
        </div>
      `;
    };

    chart.subscribeCrosshairMove(updateLegend);
    updateLegend({}); 

    // Handle responsive resizing cleanly
    const handleResize = () => chart.applyOptions({ width: chartContainerRef.current.clientWidth, height: chartContainerRef.current.clientHeight });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove(); // Prevents memory leaks on mainnet
    };
  }, [historicalData]); // Re-mounts ONLY if the historical DB array completely changes

  // =========================================================================
  // 2. LIVE WEBSOCKET UPDATE ENGINE
  // =========================================================================
  useEffect(() => {
    if (!liveTradeTick || !seriesRef.current.candle || !currentCandleRef.current) return;

    const { candle, volume } = seriesRef.current;
    const lastCandle = currentCandleRef.current;
    
    const newPrice = Number(liveTradeTick.price);
    const tradeVolume = Number(liveTradeTick.volume || 0);
    const tradeTime = Math.floor(Date.now() / 1000); // Standard Unix Timestamp
    
    // Check if the trade falls in the current 1-minute candle
    const isSameMinute = Math.floor(tradeTime / 60) === Math.floor(lastCandle.time / 60);

    let updatedCandle;
    
    if (isSameMinute) {
      // Update existing candle wicks in real-time
      updatedCandle = {
        ...lastCandle,
        high: Math.max(lastCandle.high, newPrice),
        low: Math.min(lastCandle.low, newPrice),
        close: newPrice
      };
    } else {
      // Start a brand new 1-minute candle
      updatedCandle = {
        time: Math.floor(tradeTime / 60) * 60,
        open: lastCandle.close,
        high: Math.max(lastCandle.close, newPrice),
        low: Math.min(lastCandle.close, newPrice),
        close: newPrice
      };
    }

    candle.update(updatedCandle);
    currentCandleRef.current = updatedCandle;

  }, [liveTradeTick]); // Instantly updates when a WebSocket message arrives

  return (
    <div className="absolute inset-0 w-full h-full relative">
      <div ref={chartContainerRef} className="absolute inset-0 w-full h-full" />
      <div ref={legendRef} className="absolute top-[42px] left-3 z-10 pointer-events-none" />
    </div>
  );
}