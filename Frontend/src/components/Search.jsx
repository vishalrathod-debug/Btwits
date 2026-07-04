import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchUsers } from "../services/api";

function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 LIVE DEBOUNCED SEARCH EFFECT WITH MINIMUM LENGTH GUARD
  useEffect(() => {
    // 🚨 REQUIRE AT LEAST 2 CHARACTERS TO PREVENT FRIVOLOUS API CALLS
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await searchUsers(query);
        const users = data?.users || data?.data?.users || data || [];
        setResults(Array.isArray(users) ? users : []);
      } catch (err) {
        console.error("Search fetch failure:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="flex flex-col items-center bg-gray-50 min-h-screen p-4 sm:p-6 antialiased">
      <div className="w-full max-w-2xl space-y-6">
        
        {/* 🔥 HEADER BAR & BAR CONTROL */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4 sticky top-4 z-10 backdrop-blur-md">
          <h2 className="font-extrabold text-xl text-gray-900 tracking-tight">Explore Ecosystem</h2>
          
          <div className="relative flex items-center">
            <span className="absolute left-4 text-gray-400 text-lg">🔍</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, handle, or bio keyword..."
              className="w-full bg-gray-50 text-sm border border-gray-200 rounded-xl pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400 text-gray-800 transition-all font-medium"
            />
            {query && (
              <button 
                onClick={() => setQuery("")}
                className="absolute right-3.5 text-xs font-bold text-gray-400 bg-gray-200/50 hover:bg-gray-200 p-1 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 🔥 DYNAMIC RESULTS STACK CONTAINER */}
        <div className="space-y-3">
          {loading ? (
            /* 🚀 PRODUCTION-LEVEL UPGRADE: ANIMATED LOADING SKELETON */
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="h-3.5 bg-gray-200 rounded-sm w-1/4" />
                    <div className="h-3 bg-gray-200 rounded-sm w-3/4" />
                  </div>
                  <div className="w-20 h-8 bg-gray-200 rounded-xl shrink-0" />
                </div>
              ))}
            </div>
          ) : query.trim().length < 2 ? (
            /* EMPTY OR INSUFFICIENT CHARACTER INITIAL BOARD PLACEHOLDER */
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm text-gray-400 space-y-1">
              <span className="text-3xl">✨</span>
              <p className="text-sm font-medium text-gray-500">Discover Creators & Peer Connections</p>
              <p className="text-xs text-gray-400">Type at least 2 characters of a username or handle to filter records.</p>
            </div>
          ) : results.length === 0 ? (
            /* NO RESULTS MATCH FOUND MATRIX */
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm text-gray-400 space-y-1">
              <span className="text-3xl">📭</span>
              <p className="text-sm font-medium text-gray-500">No matches discovered</p>
              <p className="text-xs text-gray-400">Double-check spelling inputs or look for key phrase patterns.</p>
            </div>
          ) : (
            /* ITERATIVE ACCOUNTS MATRIX STREAM LIST */
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50 overflow-hidden">
              {results.map((targetUser) => (
                <div 
                  key={targetUser._id} 
                  onClick={() => navigate(`/profile/${targetUser._id}`)}
                  className="flex items-center justify-between p-4 hover:bg-gray-50/80 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={targetUser.avatar || "https://via.placeholder.com/48"}
                      alt={targetUser.username}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 shrink-0 hover:opacity-90 transition-opacity"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-gray-900 text-[15px] group-hover:underline">
                        @{targetUser.username}
                      </span>
                      {targetUser.bio ? (
                        <span className="text-xs text-gray-500 truncate max-w-sm sm:max-w-md mt-0.5 leading-normal">
                          {targetUser.bio}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300 italic mt-0.5">No profile bio description setup.</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Stops double route firing from container wrapper click handler
                      navigate(`/profile/${targetUser._id}`);
                    }}
                    className="text-xs font-bold bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 active:scale-95 transition-all cursor-pointer shadow-xs whitespace-nowrap shrink-0"
                  >
                    View Hub
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Search;