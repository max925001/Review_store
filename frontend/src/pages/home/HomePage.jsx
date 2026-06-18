import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { 
  Search, 
  Star, 
  MapPin, 
  MessageSquare, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import FormError from '../../components/ui/FormError.jsx';
import Loader from '../../components/ui/Loader.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import apiClient from '../../api/axios.js';

export const HomePage = () => {
  const { user } = useSelector((state) => state.auth);

  // Listing states
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Search and Suggestions
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);

  // Review Modal States
  const [ratingStore, setRatingStore] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratingError, setRatingError] = useState(null);
  const [ratingSuccess, setRatingSuccess] = useState(null);

  // Debouncing search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      // Reset page when search term changes
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch paginated stores
  const fetchStores = async (page = 1, searchQuery = '') => {
    setLoading(true);
    try {
      const res = await apiClient.get('/stores', {
        params: {
          page,
          limit: 6,
          search: searchQuery,
          sortBy: 'name',
          order: 'asc'
        }
      });
      setStores(res.data.data.stores);
      setTotalPages(res.data.data.pagination.totalPages);
      setTotalCount(res.data.data.pagination.total);
      setCurrentPage(res.data.data.pagination.page);
    } catch (err) {
      console.error('Failed to fetch stores:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch suggestions based on debounced search
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!search.trim()) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await apiClient.get('/stores/suggestions', {
          params: { search }
        });
        setSuggestions(res.data.data);
      } catch (err) {
        console.error('Failed to fetch suggestions', err);
      }
    };

    fetchSuggestions();
  }, [debouncedSearch]);

  // Fetch store list on load and when debouncedSearch or page changes
  useEffect(() => {
    fetchStores(currentPage, debouncedSearch);
  }, [currentPage, debouncedSearch]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = (storeName) => {
    setSearch(storeName);
    setShowSuggestions(false);
  };

  const handleClearSearch = () => {
    setSearch('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Open review modal
  const openReviewModal = (store) => {
    setRatingStore(store);
    setRatingValue(5); // Default to 5 stars
    setRatingComment('');
    setRatingError(null);
    setRatingSuccess(null);
  };

  // Submit review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!ratingStore) return;
    if (ratingValue < 1 || ratingValue > 5) {
      setRatingError('Please select a rating between 1 and 5 stars.');
      return;
    }

    setSubmittingRating(true);
    setRatingError(null);

    try {
      await apiClient.post(`/stores/${ratingStore.id}/ratings`, {
        rating: ratingValue,
        comment: ratingComment
      });

      setRatingSuccess('Thank you! Your review has been submitted successfully.');
      
      // Refresh the stores listing to show updated ratings immediately
      fetchStores(currentPage, debouncedSearch);

      // Close modal after brief success window
      setTimeout(() => {
        setRatingStore(null);
        setRatingSuccess(null);
      }, 1500);

    } catch (err) {
      setRatingError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingRating(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto py-2 px-1">
      


      {/* Search Bar Section */}
      <section className="relative w-full max-w-xl" ref={suggestionsRef}>
        <div className="relative flex items-center">
          <Search size={18} className="absolute left-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search stores by name, email, or address..."
            className="w-full pl-11 pr-10 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl text-sm text-slate-800 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-200 placeholder-slate-400 dark:placeholder-slate-550"
          />
          {search && (
            <button
              onClick={handleClearSearch}
              className="absolute right-4 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Autocomplete Dropdown suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden z-30 animate-in fade-in slide-in-from-top-1 duration-150 transition-all">
            <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800/50 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Store Suggestions
            </div>
            <ul className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {suggestions.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => handleSuggestionClick(s.name)}
                    className="w-full px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-brand-50/50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Star size={12} className="text-amber-500 shrink-0" />
                    <span className="truncate">{s.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Main Grid Store Directory */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-extrabold text-slate-800 dark:text-white text-lg tracking-tight">
            Store Directory ({totalCount} locations)
          </h3>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-5 relative"
              >
                <div className="space-y-3 w-full">
                  <div className="flex justify-between items-start gap-3">
                    <Skeleton variant="title" className="h-5 w-2/3" />
                    <Skeleton variant="circle" className="h-6 w-12 rounded-full" />
                  </div>
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-2">
                      <Skeleton variant="circle" className="h-4 w-4 rounded" />
                      <Skeleton variant="text" className="h-3 w-5/6" />
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
                  <Skeleton variant="text" className="h-3 w-1/4" />
                  <Skeleton variant="rectangle" className="h-8 w-24 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : stores.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/60 text-center text-slate-450 dark:text-slate-500 text-sm">
            No stores matched your search or filtering options.
          </div>
        ) : (
          <>
            {/* Grid of Stores */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stores.map((store) => {
                const ratingNum = Number(store.avgrating) || 0;
                
                return (
                  <div 
                    key={store.id} 
                    className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 sm:p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between gap-5 relative group"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-3">
                        <h4 className="font-extrabold text-slate-800 dark:text-white text-base group-hover:text-brand-500 transition-colors line-clamp-1 leading-snug">
                          {store.name}
                        </h4>
                        
                        {/* Rating Badge */}
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xxs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0 select-none">
                          <Star size={10} fill="currentColor" />
                          <span>{ratingNum.toFixed(1)}</span>
                        </div>
                      </div>

                      {/* Email/Address details */}
                      <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <div className="flex items-start gap-1.5 min-w-0">
                          <MapPin size={14} className="text-slate-450 dark:text-slate-500 shrink-0 mt-0.5" />
                          <span className="line-clamp-2 leading-relaxed">{store.address}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 text-xs">
                      
                      {/* Review count indicator */}
                      <span className="text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1">
                        <MessageSquare size={13} />
                        <span>{store.total_review_user || 0} reviews</span>
                      </span>

                      {/* Add Review Actions */}
                      {store.isStaff ? (
                        <span className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-500 font-bold text-xxs select-none uppercase tracking-wider border border-slate-100 dark:border-slate-900">
                          My Store
                        </span>
                      ) : store.hasReviewed ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xxs select-none uppercase tracking-wider border border-emerald-500/20">
                          Reviewed
                        </span>
                      ) : (
                        <Button 
                          size="sm"
                          onClick={() => openReviewModal(store)}
                          className="font-bold text-xs rounded-lg active:scale-95 transition-transform"
                        >
                          Add Review
                        </Button>
                      )}

                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-800/80 pt-5 text-xs text-slate-450 dark:text-slate-500">
                <span>
                  Showing page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* ===== CENTURED OVERLAY MODAL: Star Rating & Review ===== */}
      {ratingStore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 transition-colors">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/50 flex justify-between items-center">
              <div className="space-y-0.5">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  Write a Store Review
                </h3>
                <p className="text-xxs text-slate-450 dark:text-slate-500">
                  Share your opinion on {ratingStore.name}
                </p>
              </div>
              <button
                onClick={() => setRatingStore(null)}
                className="p-1 rounded-full text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            {ratingSuccess ? (
              <div className="p-8 text-center space-y-3 flex flex-col items-center justify-center">
                <CheckCircle size={44} className="text-emerald-500 animate-bounce" />
                <h4 className="font-bold text-slate-800 dark:text-white text-sm">Review Submitted!</h4>
                <p className="text-xs text-slate-450 dark:text-slate-500 leading-relaxed max-w-xs mx-auto">
                  {ratingSuccess}
                </p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="p-6 space-y-4">
                
                {/* Interactive Star Selection */}
                <div className="flex flex-col items-center gap-2 py-3 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/40 rounded-2xl">
                  <span className="text-xxs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500">
                    Tap to Rate (1-5 Stars)
                  </span>
                  
                  <div className="flex gap-2 justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRatingValue(star)}
                        className="p-1 text-slate-300 hover:scale-110 active:scale-95 transition-transform cursor-pointer focus:outline-none"
                      >
                        <Star
                          size={32}
                          className={`${
                            star <= (hoverRating || ratingValue)
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-slate-200 dark:text-slate-800'
                          } transition-colors duration-150`}
                        />
                      </button>
                    ))}
                  </div>

                  <span className="text-xs font-extrabold text-slate-650 dark:text-slate-350 select-none">
                    {ratingValue === 5 ? 'Excellent (5/5)' :
                     ratingValue === 4 ? 'Good (4/5)' :
                     ratingValue === 3 ? 'Average (3/5)' :
                     ratingValue === 2 ? 'Fair (2/5)' :
                     ratingValue === 1 ? 'Poor (1/5)' : 'Select Rating'}
                  </span>
                </div>

                {/* Comment Textarea */}
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Write a Comment (Optional)
                  </label>
                  <textarea
                    value={ratingComment}
                    onChange={(e) => setRatingComment(e.target.value)}
                    rows={4}
                    placeholder="Tell others about your experience with this store location..."
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:bg-brand-950/60 dark:border-brand-900/40 dark:text-slate-100 transition-all duration-150 resize-none placeholder-slate-400 dark:placeholder-slate-550"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setRatingStore(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={submittingRating}
                    className="font-bold text-xs"
                  >
                    Submit Review
                  </Button>
                </div>

                {ratingError && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-red-500 mt-2 bg-red-50 dark:bg-red-950/20 p-2.5 rounded-lg border border-red-100 dark:border-red-900/30">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{ratingError}</span>
                  </div>
                )}
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default HomePage;
