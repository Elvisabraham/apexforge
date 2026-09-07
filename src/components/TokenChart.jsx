import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries, HistogramSeries } from 'lightweight-charts';

export default function TokenChart({ currentToken, chartMode = 'price' }) {
  const chartContainerRef = useRef();
  const legendRef = useRef(); // High-performance DOM ref for the OHLC legend

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
          top: 0.15, // Pushed down slightly to make room for the OHLC legend
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
      lastValueVisible: false, 
      priceLineVisible: false,
    });
    
    volumeSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    // 1. DATA GENERATION
    const rawPrice = parseFloat(String(currentToken?.price || '0.05439').replace(/[^0-9.]/g, ''));
    let rawMcap = 10880; 
    if (currentToken?.mcap) {
      const mStr = String(currentToken.mcap).toUpperCase();
      const mNum = parseFloat(mStr.replace(/[^0-9.]/g, ''));
      if (mStr.includes('M')) rawMcap = mNum * 1000000;
      else if (mStr.includes('K')) rawMcap = mNum * 1000;
      else rawMcap = mNum;
    }

    const targetValue = chartMode === 'mcap' ? rawMcap : rawPrice;
    
    const candleData = [];
    const volumeData = [];
    let time = Math.floor(Date.now() / 1000); 
    let closePrice = targetValue; 

    for (let i = 0; i < 500; i++) {
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

    // 2. HIGH-PERFORMANCE OHLC LEGEND ENGINE
    const lastCandle = candleData[candleData.length - 1];
    const lastVol = volumeData[volumeData.length - 1];

    const formatDecimals = (val) => chartMode === 'mcap' ? (val >= 1000 ? (val/1000).toFixed(2)+'K' : val.toFixed(2)) : val.toFixed(5);
    const formatVol = (val) => val >= 1000000 ? (val / 1000000).toFixed(2) + 'M' : (val >= 1000 ? (val / 1000).toFixed(2) + 'K' : val);

    const updateLegend = (param) => {
      if (!legendRef.current) return;
      
      const validCrosshair = !(param === undefined || param.time === undefined || param.point.x < 0 || param.point.y < 0);
      let candle = lastCandle;
      let vol = lastVol.value;

      if (validCrosshair) {
        const crosshairCandle = param.seriesData.get(candlestickSeries);
        const crosshairVol = param.seriesData.get(volumeSeries);
        if (crosshairCandle) candle = crosshairCandle;
        if (crosshairVol) vol = crosshairVol.value;
      }

      const colorClass = candle.close >= candle.open ? 'text-[#00f2a1]' : 'text-[#F23645]';

      // Directly update DOM for maximum performance
      legendRef.current.innerHTML = `
        <div class="flex items-center gap-3 text-[10px] font-mono tracking-tight bg-[#0c0d10]/80 backdrop-blur rounded px-2 py-0.5 border border-white/5">
          <span class="text-zinc-500">O<span class="${colorClass} ml-1">${formatDecimals(candle.open)}</span></span>
          <span class="text-zinc-500">H<span class="${colorClass} ml-1">${formatDecimals(candle.high)}</span></span>
          <span class="text-zinc-500">L<span class="${colorClass} ml-1">${formatDecimals(candle.low)}</span></span>
          <span class="text-zinc-500">C<span class="${colorClass} ml-1">${formatDecimals(candle.close)}</span></span>
          <span class="text-zinc-500 ml-1">Vol<span class="text-zinc-300 ml-1">${formatVol(vol)}</span></span>
        </div>
      `;
    };

    chart.subscribeCrosshairMove(updateLegend);
    updateLegend({}); // Initial render

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
  }, [currentToken, chartMode]); 

  return (
    <div className="absolute inset-0 w-full h-full relative">
      <div ref={chartContainerRef} className="absolute inset-0 w-full h-full" />
      {/* Absolute positioning keeps the legend hovering beautifully over the grid */}
      <div ref={legendRef} className="absolute top-[42px] left-3 z-10 pointer-events-none" />
    </div>
  );
}