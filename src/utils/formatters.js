/**
 * Formats low-decimal micro prices with subscript zeros matching Phantom UI
 * Example: 0.000003418 -> $0.0₅3418
 */
export const formatPhantomPrice = (price) => {
  if (price === null || price === undefined || isNaN(price)) return '$0.00';
  const num = Number(price);
  if (num === 0) return '$0.00';
  
  if (num >= 0.001) {
    return `$${num.toLocaleString('en-US', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 4 
    })}`;
  }

  const str = num.toFixed(10);
  const matches = str.match(/^0\.(0+)(\d+)/);
  
  if (matches) {
    const zeroCount = matches[1].length;
    const significantDigits = matches[2].substring(0, 4);
    const subscriptDigits = ['₀','₁','₂','₃','₄','₅','₆','₇','₈','₉'];
    const subStr = String(zeroCount).split('').map(d => subscriptDigits[parseInt(d, 10)]).join('');
    
    return `$0.0${subStr}${significantDigits}`;
  }

  return `$${num}`;
};