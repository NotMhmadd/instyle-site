import React, { useState, useEffect, useMemo } from 'react';
import { PAINTINGS } from '../data/paintings';
import { PRINTS } from '../data/prints';
import {
  Star,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  Filter,
  Trophy,
  Award,
  Medal,
  ChevronDown,
  Check,
  Palette,
  Home,
  Frame,
  Image as ImageIcon,
  RotateCcw
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Combine all artworks with a type identifier
const ALL_ARTWORKS = [
  ...PAINTINGS.map(p => ({ ...p, type: 'painting', typeLabel: 'Oil Painting' })),
  ...PRINTS.map(p => ({ ...p, type: 'print', typeLabel: 'Print' }))
];

// Users who can rate
const RATERS = [
  { id: 'aly', name: 'Aly', color: 'bg-purple-500', ringColor: 'ring-purple-400', textColor: 'text-purple-600', hoverBg: 'hover:bg-purple-50', activeBg: 'bg-purple-500' },
  { id: 'mohamad', name: 'Mohamad', color: 'bg-emerald-500', ringColor: 'ring-emerald-400', textColor: 'text-emerald-600', hoverBg: 'hover:bg-emerald-50', activeBg: 'bg-emerald-500' }
];

// Sorting options (removed price/title since prints don't have those)
const SORT_OPTIONS = [
  { id: 'code-asc', label: 'Code A-Z', icon: Filter },
  { id: 'code-desc', label: 'Code Z-A', icon: Filter },
  { id: 'average-desc', label: 'Highest Average', icon: TrendingUp },
  { id: 'average-asc', label: 'Lowest Average', icon: TrendingDown },
  { id: 'aly-desc', label: "Aly's Highest", icon: Star },
  { id: 'aly-asc', label: "Aly's Lowest", icon: Star },
  { id: 'mohamad-desc', label: "Mohamad's Highest", icon: Star },
  { id: 'mohamad-asc', label: "Mohamad's Lowest", icon: Star },
  { id: 'difference-desc', label: 'Biggest Disagreement', icon: ArrowUpDown },
  { id: 'difference-asc', label: 'Most Agreement', icon: ArrowUpDown },
];

// Quick 1-Click Rating Buttons Component
const QuickRatingButtons = ({ currentRating, onRate, rater }) => {
  return (
    <div className="flex flex-wrap gap-1.5 justify-center">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => (
        <button
          key={score}
          onClick={() => onRate(score)}
          className={`w-8 h-8 rounded-lg text-sm font-bold transition-all duration-150 
            ${currentRating === score 
              ? `${rater.activeBg} text-white shadow-md ring-2 ${rater.ringColor} ring-offset-1 scale-110` 
              : `bg-gray-100 text-gray-600 ${rater.hoverBg} hover:scale-105 hover:shadow-sm`
            }`}
        >
          {score}
        </button>
      ))}
    </div>
  );
};

// Compact Art Card with 1-click rating
const ArtCard = ({ art, ratings, onRate, rank }) => {
  const alyRating = ratings?.aly ?? null;
  const mohamadRating = ratings?.mohamad ?? null;
  
  // Calculate average
  const ratingValues = [alyRating, mohamadRating].filter(r => r !== null);
  const average = ratingValues.length > 0 
    ? (ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length).toFixed(1)
    : null;
  
  // Calculate difference
  const difference = alyRating !== null && mohamadRating !== null
    ? Math.abs(alyRating - mohamadRating)
    : null;
  
  const getRankBadge = () => {
    if (rank === 1) return { icon: Trophy, color: 'bg-amber-400', text: '1st' };
    if (rank === 2) return { icon: Award, color: 'bg-gray-400', text: '2nd' };
    if (rank === 3) return { icon: Medal, color: 'bg-amber-600', text: '3rd' };
    return null;
  };
  
  const rankBadge = getRankBadge();
  
  const handleQuickRate = (raterId, score) => {
    onRate(art.code, {
      ...ratings,
      [raterId]: score
    });
  };

  const handleClearRating = (raterId) => {
    const newRatings = { ...ratings };
    delete newRatings[raterId];
    onRate(art.code, newRatings);
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
      {/* Image Section - Full image, no cropping */}
      <div className="relative bg-gray-50 flex items-center justify-center min-h-[200px]">
        <img 
          src={art.image} 
          alt={art.code}
          className="w-full h-auto max-h-[300px] object-contain"
          loading="lazy"
        />
        
        {/* Type Badge */}
        <div className={`absolute top-3 left-3 ${art.type === 'painting' ? 'bg-amber-500' : 'bg-blue-500'} text-white px-2.5 py-1 rounded-full flex items-center gap-1.5 text-xs font-semibold shadow-lg`}>
          {art.type === 'painting' ? <Palette className="w-3.5 h-3.5" /> : <Frame className="w-3.5 h-3.5" />}
          {art.code}
        </div>
        
        {/* Rank Badge */}
        {rankBadge && (
          <div className={`absolute top-3 right-3 ${rankBadge.color} text-white px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg`}>
            <rankBadge.icon className="w-3.5 h-3.5" />
            <span className="text-xs font-bold">{rankBadge.text}</span>
          </div>
        )}
        
        {/* Average Badge (when no rank badge) */}
        {average && !rankBadge && (
          <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold">{average}</span>
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Header with code and average */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-base text-gray-900">{art.code}</h3>
          {average && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 px-3 py-1 rounded-full text-sm font-bold border border-amber-200">
              ⭐ {average}
            </div>
          )}
        </div>
        
        {/* Difference Indicator */}
        {difference !== null && (
          <div className={`text-center py-1.5 rounded-lg text-xs font-semibold mb-3 ${
            difference === 0 
              ? 'bg-green-100 text-green-700 border border-green-200'
              : difference <= 2
                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                : difference <= 4
                  ? 'bg-amber-50 text-amber-600 border border-amber-200'
                  : 'bg-red-50 text-red-600 border border-red-200'
          }`}>
            {difference === 0 ? '🎯 Perfect Agreement!' : `Δ ${difference} point${difference !== 1 ? 's' : ''} difference`}
          </div>
        )}
        
        {/* Quick Rating Section - 1 Click Experience */}
        <div className="space-y-4 mt-auto">
          {RATERS.map(rater => (
            <div key={rater.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full ${rater.color} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                    {rater.name[0]}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{rater.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {ratings?.[rater.id] && (
                    <>
                      <span className={`text-base font-bold ${rater.textColor}`}>
                        {ratings[rater.id]}/10
                      </span>
                      <button
                        onClick={() => handleClearRating(rater.id)}
                        className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Clear rating"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <QuickRatingButtons
                currentRating={ratings?.[rater.id]}
                onRate={(score) => handleQuickRate(rater.id, score)}
                rater={rater}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Stats Dashboard Component
const StatsDashboard = ({ artworks, allRatings }) => {
  const stats = useMemo(() => {
    const ratedArtworks = artworks.filter(p => {
      const r = allRatings[p.code];
      return r?.aly !== undefined || r?.mohamad !== undefined;
    });
    
    let alyTotal = 0, alyCount = 0;
    let mohamadTotal = 0, mohamadCount = 0;
    let agreements = 0;
    let totalDifference = 0;
    let bothRatedCount = 0;
    
    artworks.forEach(p => {
      const r = allRatings[p.code];
      if (r?.aly !== undefined) {
        alyTotal += r.aly;
        alyCount++;
      }
      if (r?.mohamad !== undefined) {
        mohamadTotal += r.mohamad;
        mohamadCount++;
      }
      if (r?.aly !== undefined && r?.mohamad !== undefined) {
        bothRatedCount++;
        const diff = Math.abs(r.aly - r.mohamad);
        totalDifference += diff;
        if (diff <= 1) agreements++;
      }
    });
    
    return {
      totalArtworks: artworks.length,
      ratedCount: ratedArtworks.length,
      alyAverage: alyCount > 0 ? (alyTotal / alyCount).toFixed(1) : '-',
      mohamadAverage: mohamadCount > 0 ? (mohamadTotal / mohamadCount).toFixed(1) : '-',
      agreementRate: bothRatedCount > 0 ? Math.round((agreements / bothRatedCount) * 100) : 0,
      avgDifference: bothRatedCount > 0 ? (totalDifference / bothRatedCount).toFixed(1) : '-',
      alyCount,
      mohamadCount,
      bothRatedCount
    };
  }, [artworks, allRatings]);
  
  const progressPercent = Math.round((stats.ratedCount / stats.totalArtworks) * 100);
  
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 mb-6 shadow-xl">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Progress */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1 font-medium">Progress</p>
          <p className="text-2xl font-bold text-white mb-2">
            {stats.ratedCount}<span className="text-slate-400 text-lg">/{stats.totalArtworks}</span>
          </p>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">{progressPercent}% complete</p>
        </div>
        
        {/* Aly's Average */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold shadow">A</div>
            <p className="text-xs text-slate-400 font-medium">Aly's Avg</p>
          </div>
          <p className="text-2xl font-bold text-purple-400">{stats.alyAverage}</p>
          <p className="text-xs text-slate-500">{stats.alyCount} rated</p>
        </div>
        
        {/* Mohamad's Average */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold shadow">M</div>
            <p className="text-xs text-slate-400 font-medium">Mohamad's Avg</p>
          </div>
          <p className="text-2xl font-bold text-emerald-400">{stats.mohamadAverage}</p>
          <p className="text-xs text-slate-500">{stats.mohamadCount} rated</p>
        </div>
        
        {/* Agreement */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-2 font-medium">Agreement Rate</p>
          <p className="text-2xl font-bold text-blue-400">{stats.agreementRate}%</p>
          <p className="text-xs text-slate-500">{stats.bothRatedCount} both rated</p>
        </div>
      </div>
    </div>
  );
};

// Main Ratings Page Component
export default function RatingsPage() {
  const [allRatings, setAllRatings] = useState(() => {
    const saved = localStorage.getItem('instyle-arts-ratings');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [sortBy, setSortBy] = useState('code-asc');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [filterBy, setFilterBy] = useState('all'); // all, rated, unrated
  const [typeFilter, setTypeFilter] = useState('all'); // all, painting, print
  
  // Save ratings to localStorage
  useEffect(() => {
    localStorage.setItem('instyle-arts-ratings', JSON.stringify(allRatings));
  }, [allRatings]);
  
  const handleRate = (artCode, ratings) => {
    setAllRatings(prev => ({
      ...prev,
      [artCode]: ratings
    }));
  };
  
  // Filter and sort artworks
  const sortedArtworks = useMemo(() => {
    let filtered = [...ALL_ARTWORKS];
    
    // Apply type filter
    if (typeFilter === 'painting') {
      filtered = filtered.filter(p => p.type === 'painting');
    } else if (typeFilter === 'print') {
      filtered = filtered.filter(p => p.type === 'print');
    }
    
    // Apply rating status filter
    if (filterBy === 'rated') {
      filtered = filtered.filter(p => {
        const r = allRatings[p.code];
        return r?.aly !== undefined || r?.mohamad !== undefined;
      });
    } else if (filterBy === 'unrated') {
      filtered = filtered.filter(p => {
        const r = allRatings[p.code];
        return r?.aly === undefined && r?.mohamad === undefined;
      });
    }
    
    // Calculate averages
    const withAverages = filtered.map(p => {
      const r = allRatings[p.code] || {};
      const values = [r.aly, r.mohamad].filter(v => v !== undefined);
      const average = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : null;
      const difference = r.aly !== undefined && r.mohamad !== undefined 
        ? Math.abs(r.aly - r.mohamad) 
        : null;
      
      return { ...p, ratings: r, average, difference };
    });
    
    // Sort
    const [field, direction] = sortBy.split('-');
    withAverages.sort((a, b) => {
      let aVal, bVal;
      
      switch (field) {
        case 'code':
          // Natural sort for codes like OP1, OP2, PR10, PR2
          const extractNum = (code) => {
            const match = code.match(/(\D+)(\d+)/);
            if (match) {
              return { prefix: match[1], num: parseInt(match[2]) };
            }
            return { prefix: code, num: 0 };
          };
          const aCode = extractNum(a.code);
          const bCode = extractNum(b.code);
          if (aCode.prefix !== bCode.prefix) {
            const cmp = aCode.prefix.localeCompare(bCode.prefix);
            return direction === 'asc' ? cmp : -cmp;
          }
          return direction === 'asc' ? aCode.num - bCode.num : bCode.num - aCode.num;
        case 'average':
          aVal = a.average ?? -1;
          bVal = b.average ?? -1;
          break;
        case 'aly':
          aVal = a.ratings.aly ?? -1;
          bVal = b.ratings.aly ?? -1;
          break;
        case 'mohamad':
          aVal = a.ratings.mohamad ?? -1;
          bVal = b.ratings.mohamad ?? -1;
          break;
        case 'difference':
          aVal = a.difference ?? -1;
          bVal = b.difference ?? -1;
          break;
        default:
          return 0;
      }
      
      return direction === 'desc' ? bVal - aVal : aVal - bVal;
    });
    
    return withAverages;
  }, [allRatings, sortBy, filterBy, typeFilter]);
  
  // Get current sort option
  const currentSortOption = SORT_OPTIONS.find(o => o.id === sortBy);
  
  // Count by type
  const paintingsCount = ALL_ARTWORKS.filter(a => a.type === 'painting').length;
  const printsCount = ALL_ARTWORKS.filter(a => a.type === 'print').length;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-2.5 rounded-xl shadow-lg">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">InStyle Arts Ratings</h1>
                <p className="text-sm text-gray-500">{ALL_ARTWORKS.length} artworks • Click to rate 1-10</p>
              </div>
            </div>
            
            <Link 
              to="/"
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-gray-700 transition-colors text-sm font-medium"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Dashboard */}
        <StatsDashboard artworks={ALL_ARTWORKS} allRatings={allRatings} />
        
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Type Filter */}
          <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200">
            {[
              { id: 'all', label: 'All', count: ALL_ARTWORKS.length, icon: ImageIcon },
              { id: 'painting', label: 'Paintings', count: paintingsCount, icon: Palette },
              { id: 'print', label: 'Prints', count: printsCount, icon: Frame }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setTypeFilter(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  typeFilter === tab.id
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${typeFilter === tab.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
          
          {/* Rating Status Filter */}
          <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200">
            {[
              { id: 'all', label: 'All' },
              { id: 'rated', label: 'Rated' },
              { id: 'unrated', label: 'Unrated' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterBy(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterBy === tab.id
                    ? 'bg-slate-800 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Sort Dropdown */}
          <div className="relative ml-auto">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200 hover:border-gray-300 transition-all text-sm"
            >
              {currentSortOption && <currentSortOption.icon className="w-4 h-4 text-gray-500" />}
              <span className="font-medium text-gray-700">{currentSortOption?.label}</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
            </button>
            
            {showSortMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setShowSortMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20">
                  {SORT_OPTIONS.map(option => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setSortBy(option.id);
                        setShowSortMenu(false);
                      }}
                      className={`w-full flex items-center gap-2 px-4 py-2 text-left text-sm transition-colors ${
                        sortBy === option.id
                          ? 'bg-amber-50 text-amber-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <option.icon className="w-4 h-4" />
                      {option.label}
                      {sortBy === option.id && <Check className="w-4 h-4 ml-auto" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Results Count */}
        <p className="text-sm text-gray-500 mb-4 font-medium">
          Showing {sortedArtworks.length} artwork{sortedArtworks.length !== 1 ? 's' : ''}
        </p>
        
        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {sortedArtworks.map((art, index) => (
            <ArtCard
              key={art.code}
              art={art}
              ratings={allRatings[art.code] || {}}
              onRate={handleRate}
              rank={sortBy === 'average-desc' && art.average !== null ? index + 1 : null}
            />
          ))}
        </div>
        
        {sortedArtworks.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No artworks found</h3>
            <p className="text-sm text-gray-500">Try changing your filter settings</p>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-slate-800 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-400">InStyle Arts Ratings</p>
          <p className="text-xs text-slate-500 mt-1">Click any number 1-10 to rate instantly</p>
        </div>
      </footer>
    </div>
  );
}
