import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Users, 
  Store, 
  Activity, 
  Plus, 
  X, 
  Search, 
  Star, 
  Mail, 
  MapPin, 
  UserCheck, 
  Eye, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Loader from '../../components/ui/Loader.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import ROUTES from '../../constants/routes.js';
import {
  fetchStats,
  fetchUsers,
  fetchAdminStores,
  createAdminUser,
  createAdminStore,
  fetchUserDetails
} from '../../features/admin/adminThunks.js';
import { resetCreationStates, clearActiveUserDetail } from '../../features/admin/adminSlice.js';
import AddUserModal from '../../components/ui/AddUserModal.jsx';

export const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Auth state
  const { user: currentUser } = useSelector((state) => state.auth);
  
  // Admin slice state
  const {
    stats,
    usersList,
    usersPagination,
    storesList,
    storesPagination,
    activeUserDetail,
    loading,
    errors,
    createUserSuccess,
    createStoreSuccess
  } = useSelector((state) => state.admin);

  // Active Tab: 'stores' or 'users'
  const [activeTab, setActiveTab] = useState('stores');

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [ratingMin, setRatingMin] = useState('');
  const [ratingMax, setRatingMax] = useState('');

  // Pagination states
  const [storesPage, setStoresPage] = useState(1);
  const [usersPage, setUsersPage] = useState(1);

  // Form toggles
  const [showAddStore, setShowAddStore] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);

  // New store form state
  const [newStore, setNewStore] = useState({ name: '', email: '', address: '' });

  // Detail Modal State
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Auth Guard
  if (!currentUser) return null;
  if (currentUser.role !== 'ADMIN') {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  // Fetch initial dashboard stats & lists
  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  // Fetch stores based on filter params
  const loadStores = () => {
    dispatch(
      fetchAdminStores({
        search: searchTerm,
        ratingMin: ratingMin || undefined,
        ratingMax: ratingMax || undefined,
        page: storesPage,
        limit: 10,
      })
    );
  };

  // Fetch users based on filter params
  const loadUsers = () => {
    dispatch(
      fetchUsers({
        search: searchTerm,
        role: roleFilter || undefined,
        page: usersPage,
        limit: 10,
      })
    );
  };

  // Re-fetch list when tab, page, or filters change
  useEffect(() => {
    if (activeTab === 'stores') {
      loadStores();
    } else {
      loadUsers();
    }
  }, [activeTab, storesPage, usersPage]);

  // Handle Search/Filter Submit
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'stores') {
      setStoresPage(1);
      loadStores();
    } else {
      setUsersPage(1);
      loadUsers();
    }
  };

  // Reset filter inputs
  const handleFilterReset = () => {
    setSearchTerm('');
    setRoleFilter('');
    setRatingMin('');
    setRatingMax('');
    if (activeTab === 'stores') {
      setStoresPage(1);
      dispatch(fetchAdminStores({ page: 1, limit: 10 }));
    } else {
      setUsersPage(1);
      dispatch(fetchUsers({ page: 1, limit: 10 }));
    }
  };

  // Store Creation handler
  const handleCreateStore = async (e) => {
    e.preventDefault();
    dispatch(resetCreationStates());
    const result = await dispatch(createAdminStore(newStore));
    if (createAdminStore.fulfilled.match(result)) {
      setNewStore({ name: '', email: '', address: '' });
      setShowAddStore(false);
      setStoresPage(1);
      loadStores();
      dispatch(fetchStats());
    }
  };

  // User Creation handler
  const handleCreateUser = async (formData) => {
    dispatch(resetCreationStates());
    const result = await dispatch(createAdminUser(formData));
    if (createAdminUser.fulfilled.match(result)) {
      setShowAddUser(false);
      setUsersPage(1);
      loadUsers();
      dispatch(fetchStats());
    }
  };

  // User details modal view trigger
  const handleViewDetails = (userId) => {
    dispatch(clearActiveUserDetail());
    dispatch(fetchUserDetails(userId));
    setShowDetailModal(true);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto py-2">
      
      {/* Hero Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-brand-600 via-indigo-600 to-indigo-700 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-brand-500/10 dark:border-brand-500/5 transition-all">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2.5">
              <Shield className="w-6 h-6 text-brand-200" />
              <span>System Administrator Center</span>
            </h2>
            <p className="text-sm text-brand-100/90 dark:text-slate-300 mt-2 max-w-xl">
              Welcome back, {currentUser.name}. You have full operational control to manage accounts, deploy new stores, and audit submitted reviews.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddStore(true);
                setShowAddUser(false);
                dispatch(resetCreationStates());
              }}
              className="bg-white/10 hover:bg-white/20 border-white/20 text-white hover:text-white flex items-center gap-2"
            >
              <Plus size={16} />
              <span>Add Store</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddUser(true);
                setShowAddStore(false);
                dispatch(resetCreationStates());
              }}
              className="bg-white/10 hover:bg-white/20 border-white/20 text-white hover:text-white flex items-center gap-2"
            >
              <Plus size={16} />
              <span>Add User</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-xl shadow-sm flex items-center gap-4 transition-colors">
          <div className="p-3 bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400 rounded-lg">
            <Users size={22} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Total Users</span>
            {loading.stats ? (
              <Skeleton className="h-6 w-12 mt-1" />
            ) : (
              <span className="text-xl font-extrabold text-slate-800 dark:text-white">{stats.totalUsers}</span>
            )}
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-xl shadow-sm flex items-center gap-4 transition-colors">
          <div className="p-3 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 rounded-lg">
            <Store size={22} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Total Stores</span>
            {loading.stats ? (
              <Skeleton className="h-6 w-12 mt-1" />
            ) : (
              <span className="text-xl font-extrabold text-slate-800 dark:text-white">{stats.totalStores}</span>
            )}
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-xl shadow-sm flex items-center gap-4 transition-colors">
          <div className="p-3 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 rounded-lg">
            <Activity size={22} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Submitted Ratings</span>
            {loading.stats ? (
              <Skeleton className="h-6 w-12 mt-1" />
            ) : (
              <span className="text-xl font-extrabold text-slate-800 dark:text-white">{stats.totalRatings}</span>
            )}
          </div>
        </div>
      </div>

      {/* ===== MODAL: Add Store Form ===== */}
      {showAddStore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <section className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-xl relative w-full max-w-lg animate-in zoom-in-95 duration-200 transition-colors">
            <button
              onClick={() => setShowAddStore(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
              aria-label="Close form"
            >
              <X size={18} />
            </button>
            
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Store size={18} className="text-brand-500" />
              <span>Deploy New Store Location</span>
            </h3>

            <form onSubmit={handleCreateStore} className="flex flex-col gap-4">
              <Input
                label="Store Name"
                id="storeName"
                placeholder="e.g. Starbucks Coffee"
                required
                value={newStore.name}
                onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
              />
              <Input
                label="Store Email"
                id="storeEmail"
                type="email"
                placeholder="starbucks@example.com"
                required
                value={newStore.email}
                onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
              />
              <Input
                label="Store Address"
                id="storeAddress"
                placeholder="123 Market St, San Francisco, CA"
                required
                value={newStore.address}
                onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
              />

              <div className="flex justify-end gap-2 mt-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setShowAddStore(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={loading.createStore}
                >
                  Create Store
                </Button>
              </div>
            </form>
            {errors.createStore && <FormError error={errors.createStore} className="mt-3" />}
          </section>
        </div>
      )}

      {/* ===== MODAL: Add User Form (shared component) ===== */}
      <AddUserModal
        isOpen={showAddUser}
        onClose={() => setShowAddUser(false)}
        onSubmit={handleCreateUser}
        isLoading={loading.createUser}
        error={errors.createUser}
        title="Create New User Profile"
        submitLabel="Register User"
        showRoleSelect={true}
        defaultRole="USER"
      />

      {/* Unified Search & Filters Panel */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm transition-colors">
        <form onSubmit={handleFilterSubmit} className="flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/50">
            <Filter size={16} className="text-brand-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Listing Filters & Search</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-800 rounded-lg text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            {activeTab === 'users' ? (
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-800 rounded-lg text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="">All Roles</option>
                <option value="USER">USER</option>
                <option value="STORE_OWNER">STORE_OWNER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min Rating"
                  min="1"
                  max="5"
                  step="0.1"
                  value={ratingMin}
                  onChange={(e) => setRatingMin(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-800 rounded-lg text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none focus:ring-2 focus:ring-brand-500/20"
                />
                <input
                  type="number"
                  placeholder="Max Rating"
                  min="1"
                  max="5"
                  step="0.1"
                  value={ratingMax}
                  onChange={(e) => setRatingMax(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-800 rounded-lg text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            )}

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">Apply Filters</Button>
              <Button variant="secondary" type="button" onClick={handleFilterReset} className="px-3">
                Reset
              </Button>
            </div>
          </div>
        </form>
      </section>

      {/* Tabs & Table Listings */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm transition-colors overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={() => {
              setActiveTab('stores');
              setSearchTerm('');
            }}
            className={`flex-1 sm:flex-initial px-6 py-4 font-bold text-sm border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'stores'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Store size={16} />
            <span>Stores Directory</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('users');
              setSearchTerm('');
            }}
            className={`flex-1 sm:flex-initial px-6 py-4 font-bold text-sm border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'users'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Users size={16} />
            <span>User Accounts</span>
          </button>
        </div>

        {/* Tab Contents: Stores Table */}
        {activeTab === 'stores' ? (
          <div className="overflow-x-auto">
            {loading.stores ? (
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 text-xxs font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                    <th className="px-6 py-4">Store Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Address</th>
                    <th className="px-6 py-4 text-center">Avg Rating</th>
                    <th className="px-6 py-4 text-center">Total Reviews</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-28" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-36" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-48" /></td>
                      <td className="px-6 py-4 text-center"><Skeleton className="h-6 w-12 rounded-full mx-auto" /></td>
                      <td className="px-6 py-4 text-center"><Skeleton className="h-4 w-8 mx-auto" /></td>
                      <td className="px-6 py-4 text-center"><Skeleton className="h-6 w-6 rounded mx-auto" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : storesList.length === 0 ? (
              <div className="text-center py-16 text-slate-400 dark:text-slate-500 text-sm">
                No stores matching the criteria were found.
              </div>
            ) : (
              <>
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 text-xxs font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                      <th className="px-6 py-4">Store Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Address</th>
                      <th className="px-6 py-4 text-center">Avg Rating</th>
                      <th className="px-6 py-4 text-center">Total Reviews</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {storesList.map((store) => (
                      <tr key={store.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{store.name}</td>
                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{store.email}</td>
                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400 max-w-xs truncate">{store.address}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                            store.averageRating >= 4 
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                              : store.averageRating >= 3 
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                          }`}>
                            <Star size={12} fill="currentColor" />
                            {store.averageRating || '0.0'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-slate-600 dark:text-slate-400">
                          {store.total_review_user || 0}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => navigate(`/stores/${store.id}`)}
                            className="p-1.5 rounded-lg text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-brand-500 dark:hover:text-brand-400 transition-colors cursor-pointer"
                            title="Inspect Store details"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Stores Pagination */}
                {storesPagination.totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800/50 text-xs">
                    <span className="text-slate-400">
                      Showing Page {storesPagination.page} of {storesPagination.totalPages}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={storesPage === 1}
                        onClick={() => setStoresPage(prev => prev - 1)}
                      >
                        <ChevronLeft size={16} />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={storesPage === storesPagination.totalPages}
                        onClick={() => setStoresPage(prev => prev + 1)}
                      >
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          /* Tab Contents: Users Table */
          <div className="overflow-x-auto">
            {loading.users ? (
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 text-xxs font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                    <th className="px-6 py-4">Account Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Address</th>
                    <th className="px-6 py-4">Access Role</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-36" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-44" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-5 w-16 rounded-full" /></td>
                      <td className="px-6 py-4 text-center"><Skeleton className="h-6 w-6 rounded mx-auto" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : usersList.length === 0 ? (
              <div className="text-center py-16 text-slate-400 dark:text-slate-500 text-sm">
                No user profiles matching filters found.
              </div>
            ) : (
              <>
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 text-xxs font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                      <th className="px-6 py-4">Account Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Address</th>
                      <th className="px-6 py-4">Access Role</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{u.name}</td>
                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{u.email}</td>
                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400 max-w-xs truncate">{u.address || 'Not specified'}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xxs font-bold uppercase tracking-wider border ${
                            u.role === 'ADMIN' 
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                              : u.role === 'STORE_OWNER'
                              ? 'bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 border-indigo-500/20'
                              : 'bg-slate-500/10 text-slate-655 dark:text-slate-400 border-slate-500/20'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => navigate(`/profile/${u.id}`)}
                            className="p-1.5 rounded-lg text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-brand-500 dark:hover:text-brand-400 transition-colors cursor-pointer"
                            title="Inspect Profile details"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Users Pagination */}
                {usersPagination.totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800/50 text-xs">
                    <span className="text-slate-400">
                      Showing Page {usersPagination.page} of {usersPagination.totalPages}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={usersPage === 1}
                        onClick={() => setUsersPage(prev => prev - 1)}
                      >
                        <ChevronLeft size={16} />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={usersPage === usersPagination.totalPages}
                        onClick={() => setUsersPage(prev => prev + 1)}
                      >
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </section>

      {/* ===== USER DETAIL MODAL ===== */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 transition-colors">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-base">
                <UserCheck size={18} className="text-brand-500" />
                <span>Account Specifications</span>
              </h3>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  dispatch(clearActiveUserDetail());
                }}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {loading.userDetail ? (
                <div className="flex flex-col items-center justify-center py-8 gap-3">
                  <Loader size="md" />
                  <span className="text-xs text-slate-400">Retrieving profile parameters...</span>
                </div>
              ) : errors.userDetail ? (
                <div className="flex items-center gap-2 text-red-555 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 text-xs">
                  <ShieldAlert size={16} />
                  <span>{errors.userDetail}</span>
                </div>
              ) : activeUserDetail ? (
                <div className="space-y-4">
                  {/* General Profile Card */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/30 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="text-base font-extrabold text-slate-800 dark:text-white">{activeUserDetail.name}</span>
                        <span className="text-xxs font-bold text-slate-400 tracking-wide uppercase mt-0.5">{activeUserDetail.role}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xxs font-bold border ${
                        activeUserDetail.role === 'ADMIN'
                          ? 'bg-rose-50 text-rose-700 border-rose-200/50 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-800/20'
                          : activeUserDetail.role === 'STORE_OWNER'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200/50 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-800/20'
                          : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-350 dark:border-slate-700'
                      }`}>
                        Active
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200/30 dark:border-slate-800/30">
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-slate-400" />
                        <span>{activeUserDetail.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-slate-400" />
                        <span>{activeUserDetail.address || 'Address not listed'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Store Info Card (only for STORE_OWNER users) */}
                  {activeUserDetail.role === 'STORE_OWNER' && (
                    <div className="p-4 rounded-xl border border-brand-500/20 dark:border-brand-500/10 bg-brand-500/5 dark:bg-brand-500/2 transition-colors flex flex-col gap-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Owned Store Location</h4>
                      {activeUserDetail.store ? (
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-sm font-bold text-slate-800 dark:text-white">{activeUserDetail.store.name}</span>
                              <span className="text-xxs text-slate-400">{activeUserDetail.store.email}</span>
                            </div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400">
                              <Star size={12} fill="currentColor" />
                              {activeUserDetail.store.averageRating || '0.0'}
                            </span>
                          </div>

                          <div className="text-xxs text-slate-450 dark:text-slate-400 flex items-center justify-between border-t border-brand-500/10 pt-2.5">
                            <span>Rating average: <strong className="text-slate-700 dark:text-slate-350">{activeUserDetail.store.averageRating || '0.0'} / 5.0</strong></span>
                            <span>Total ratings count: <strong className="text-slate-700 dark:text-slate-350">{activeUserDetail.store.totalReviewUser || 0}</strong></span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs italic text-slate-400">No store location assigned to this owner profile.</span>
                      )}
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800/50 flex justify-end">
              <Button
                onClick={() => {
                  setShowDetailModal(false);
                  dispatch(clearActiveUserDetail());
                }}
              >
                Close View
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboardPage;
