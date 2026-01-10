import React from 'react';

const clamp = (v, a, b) => Math.min(Math.max(v, a), b);

const PriceRangeSlider = ({ min = 0, max = 1000, value = [0, 1000], onChange = () => {} }) => {
  const [local, setLocal] = React.useState(value);

  React.useEffect(() => setLocal(value), [value]);

  const onMin = (e) => {
    const nv = clamp(Number(e.target.value), min, local[1]);
    setLocal([nv, local[1]]);
    onChange([nv, local[1]]);
  };

  const onMax = (e) => {
    const nv = clamp(Number(e.target.value), local[0], max);
    setLocal([local[0], nv]);
    onChange([local[0], nv]);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="w-20 text-xs text-[#666666] font-semibold">${local[0]}</div>
      <div className="relative flex-1 h-8 flex items-center">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1.5 bg-[#E5E5E5] rounded-full pointer-events-none z-0" />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1.5 bg-[#C5A059] rounded-full pointer-events-none z-10"
          style={{ left: `${((local[0] - min) / (max - min)) * 100}%`, right: `${100 - ((local[1] - min) / (max - min)) * 100}%` }}
        />
        <input 
          aria-label="Min price" 
          type="range" 
          min={min} 
          max={max} 
          value={local[0]} 
          onChange={onMin} 
          className="absolute w-full appearance-none bg-transparent pointer-events-auto z-20 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#C5A059] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#C5A059] [&::-moz-range-thumb]:cursor-pointer" 
        />
        <input 
          aria-label="Max price" 
          type="range" 
          min={min} 
          max={max} 
          value={local[1]} 
          onChange={onMax} 
          className="absolute w-full appearance-none bg-transparent pointer-events-auto z-30 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#C5A059] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#C5A059] [&::-moz-range-thumb]:cursor-pointer" 
        />
      </div>
      <div className="w-20 text-right text-xs text-[#666666] font-semibold">${local[1]}</div>
    </div>
  );
};

export default PriceRangeSlider;
