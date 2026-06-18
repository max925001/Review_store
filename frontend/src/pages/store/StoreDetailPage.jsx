import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Store, 
  Users, 
  Star, 
  Mail, 
  MapPin, 
  Plus, 
  X, 
  Trash2, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight,
  Shield,
  ShieldAlert,
  MessageSquare
} from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import PasswordInput from '../../components/ui/PasswordInput.jsx';
import FormError from '../../components/ui/FormError.jsx';
import Loader from '../../components/ui/Loader.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import apiClient from '../../api/axios.js';
import ROUTES from '../../constants/routes.js';
import StoreReviewsList from '../../components/store/StoreReviewsList.jsx';
import StoreHeaderBanner from '../../components/store/StoreHeaderBanner.jsx';

export const StoreDetailPage = () => {
  const { id: storeId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);

  // States
  const [store, setStore] = useState(null);
  const [loadingStore, setLoadingStore] = useState(true);
  const [storeError, setStoreError] = useState(null);

  // Paginated Ratings
  const [ratings, setRatings] = useState([]);
  const [ratingsPagination, setRatingsPagination] = useState({ page: 1, totalPages: 1 });
  const [ratingsPage, setRatingsPage] = useState(1);
  const [loadingRatings, setLoadingRatings] = useState(true);

  // Modals
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [staffFormType, setStaffFormType] = useState('EMPLOYEE'); // 'EMPLOYEE' or 'OWNER'
  const [ownerMode, setOwnerMode] = useState('NEW'); // 'NEW' or 'EXISTING'
  
  // New Staff inputs
  const [staffData, setStaffData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    existingOwnerId: ''
  });
  const [addingStaff, setAddingStaff] = useState(false);
  const [staffError, setStaffError] = useState(null);

  // Access check
  const isOwner = currentUser?.role === 'STORE_OWNER';
  const isAdmin = currentUser?.role === 'ADMIN';
  const hasAccess = isAdmin || (isOwner && currentUser?.storeId === storeId);

  // Fetch store details
  const fetchStoreDetails = async () => {
    try {
      setLoadingStore(true);
      setStoreError(null);
      const res = await apiClient.get(`/admin/stores/${storeId}`);
      setStore(res.data.data);
    } catch (err) {
      setStoreError(err.response?.data?.message || 'Failed to fetch store details');
    } finally {
      setLoadingStore(false);
    }
  };

  // Fetch paginated store reviews
  const fetchRatings = async () => {
    try {
      setLoadingRatings(true);
      const res = await apiClient.get(`/admin/stores/${storeId}/ratings`, {
        params: { page: ratingsPage, limit: 5 }
      });
      setRatings(res.data.data.ratings);
      setRatingsPagination(res.data.data.pagination);
    } catch (err) {
      console.error('Failed to fetch ratings', err);
    } finally {
      setLoadingRatings(false);
    }
  };

  useEffect(() => {
    if (hasAccess) {
      fetchStoreDetails();
    }
  }, [storeId]);

  useEffect(() => {
    if (hasAccess) {
      fetchRatings();
    }
  }, [storeId, ratingsPage]);

  if (!currentUser) return null;

  // Render Access Denied
  if (!hasAccess) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-center">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Access Denied</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          You do not have permission to view this store location's details.
        </p>
        <Button onClick={() => navigate(-1)} className="mt-5 w-full">
          Go Back
        </Button>
      </div>
    );
  }

  // Handle Staff addition
  const handleAddStaffSubmit = async (e) => {
    e.preventDefault();
    setAddingStaff(true);
    setStaffError(null);

    try {
      if (staffFormType === 'EMPLOYEE') {
        // Add new employee
        await apiClient.post(`/owner/stores/${storeId}/employees`, {
          name: staffData.name,
          email: staffData.email,
          password: staffData.password,
          address: staffData.address
        });
      } else {
        // Owner logic (only Admin)
        if (ownerMode === 'EXISTING') {
          // Assign existing owner
          await apiClient.patch(`/admin/stores/${storeId}/assign-owner`, {
            ownerId: staffData.existingOwnerId
          });
        } else {
          // Create new user with STORE_OWNER role
          const createRes = await apiClient.post('/admin/users', {
            name: staffData.name,
            email: staffData.email,
            password: staffData.password,
            address: staffData.address,
            role: 'STORE_OWNER'
          });
          const newOwnerId = createRes.data.data.id;
          
          // Assign them to the store
          await apiClient.patch(`/admin/stores/${storeId}/assign-owner`, {
            ownerId: newOwnerId
          });
        }
      }

      // Reset
      setStaffData({ name: '', email: '', password: '', address: '', existingOwnerId: '' });
      setShowAddStaffModal(false);
      fetchStoreDetails();
    } catch (err) {
      setStaffError(err.response?.data?.message || 'Failed to complete operations');
    } finally {
      setAddingStaff(false);
    }
  };

  // Handle Owner removal (only Admin)
  const handleRemoveOwner = async (ownerId) => {
    if (!window.confirm('Are you sure you want to remove this owner from the store?')) return;
    try {
      await apiClient.patch(`/admin/stores/${storeId}/remove-owner`, { ownerId });
      fetchStoreDetails();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove owner');
    }
  };

  // Handle Employee removal (Admin & Store Owner)
  const handleRemoveEmployee = async (employeeUserId) => {
    if (!window.confirm('Are you sure you want to remove this employee from the store?')) return;
    try {
      await apiClient.delete(`/owner/stores/${storeId}/employees/${employeeUserId}`);
      fetchStoreDetails();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove employee');
    }
  };

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto py-2">
      
      {/* Back Button navigation */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors text-sm font-semibold focus:outline-none cursor-pointer"
      >
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>

      {loadingStore ? (
        <div className="space-y-6">
          {/* Store Info Banner Skeleton */}
          <StoreHeaderBanner isLoading={true} />

          {/* Staff Directory Skeleton */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <Skeleton variant="title" className="w-1/4 bg-slate-200 dark:bg-slate-800" />
              <Skeleton variant="rectangle" className="w-28 h-8 bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="p-4 border border-slate-100 dark:border-slate-800/60 rounded-xl flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <Skeleton variant="circle" className="w-10 h-10 bg-slate-200 dark:bg-slate-800" />
                    <div className="space-y-1 flex-1">
                      <Skeleton variant="title" className="w-1/2 bg-slate-200 dark:bg-slate-800" />
                      <Skeleton variant="text" className="w-1/3 bg-slate-200 dark:bg-slate-800" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Customer Reviews Skeleton */}
          <StoreReviewsList isLoading={true} />
        </div>
      ) : storeError ? (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-sm font-medium flex items-center gap-2">
          <ShieldAlert size={18} />
          <span>{storeError}</span>
        </div>
      ) : store ? (
        <>
          {/* Store Info Banner */}
          <StoreHeaderBanner store={store} />

          {/* Staff Directory Panel */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 text-base">
                <Users size={18} className="text-brand-500" />
                <span>Staff & Franchise Management</span>
              </h3>
              
              {/* Trigger Add Staff modal */}
              <Button
                size="sm"
                onClick={() => {
                  setStaffFormType(isOwner ? 'EMPLOYEE' : 'OWNER');
                  setStaffError(null);
                  setStaffData({ name: '', email: '', password: '', address: '', existingOwnerId: '' });
                  setShowAddStaffModal(true);
                }}
                className="flex items-center gap-1.5"
              >
                <Plus size={14} />
                <span>Add {isOwner ? 'Employee' : 'Staff'}</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              {/* Owners Column (Only viewable by admin or owners) */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield size={14} className="text-indigo-500" />
                  <span>Franchise Owners ({store.owners?.length || 0})</span>
                </h4>
                
                {store.owners?.length === 0 ? (
                  <p className="text-xs italic text-slate-400 py-3">No owners currently assigned.</p>
                ) : (
                  <div className="space-y-2">
                    {store.owners?.map(o => (
                      <div key={o.id} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex justify-between items-center transition-colors">
                        <div className="flex flex-col min-w-0">
                          <Link to={`/profile/${o.id}`} className="text-sm font-bold text-slate-800 dark:text-white hover:text-brand-500 dark:hover:text-brand-400 transition-colors truncate">
                            {o.name}
                          </Link>
                          <span className="text-xxs text-slate-400 mt-0.5 truncate">{o.email}</span>
                        </div>
                        {isAdmin && (
                          <button
                            onClick={() => handleRemoveOwner(o.id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
                            title="Remove Owner"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Employees Column */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Users size={14} className="text-brand-500" />
                  <span>Assigned Employees ({store.employeesList?.length || 0})</span>
                </h4>

                {store.employeesList?.length === 0 ? (
                  <p className="text-xs italic text-slate-400 py-3">No employees currently registered.</p>
                ) : (
                  <div className="space-y-2">
                    {store.employeesList?.map(e => (
                      <div key={e.id} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex justify-between items-center transition-colors">
                        <div className="flex flex-col min-w-0">
                          {isAdmin ? (
                            <Link to={`/profile/${e.id}`} className="text-sm font-bold text-slate-800 dark:text-white hover:text-brand-500 dark:hover:text-brand-400 transition-colors truncate">
                              {e.name}
                            </Link>
                          ) : (
                            <span className="text-sm font-bold text-slate-800 dark:text-white truncate">{e.name}</span>
                          )}
                          <span className="text-xxs text-slate-400 mt-0.5 truncate">{e.email}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveEmployee(e.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
                          title="Remove Employee"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </section>

          {/* Paginated Store Reviews Section */}
          <StoreReviewsList
            reviews={ratings}
            pagination={ratingsPagination}
            isLoading={loadingRatings}
            onPageChange={(page) => setRatingsPage(page)}
          />
        </>
      ) : null}

      {/* ===== CENTURED MODAL: Add Staff Member ===== */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 transition-colors">
            
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-base">
                <Plus size={18} className="text-brand-500" />
                <span>Register new {isOwner ? 'Employee' : 'Store Staff'}</span>
              </h3>
              <button
                onClick={() => setShowAddStaffModal(false)}
                className="p-1 rounded-full text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddStaffSubmit} className="p-6 space-y-4">
              
              {/* If Admin: offer Role Selector (Owner vs Employee) */}
              {isAdmin && (
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Staff Role
                  </label>
                  <select
                    value={staffFormType}
                    onChange={(e) => {
                      setStaffFormType(e.target.value);
                      setStaffError(null);
                    }}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:ring-2 focus:ring-brand-500/20 dark:bg-brand-950/60 dark:border-brand-900/40 dark:text-slate-100"
                  >
                    <option value="OWNER">Franchise Owner (OWNER)</option>
                    <option value="EMPLOYEE">Store Employee (EMPLOYEE)</option>
                  </select>
                </div>
              )}

              {/* If Admin and OWNER selected: offer mode switch (Existing vs Create New) */}
              {isAdmin && staffFormType === 'OWNER' && (
                <div className="flex gap-4 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs font-semibold">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="ownerMode"
                      checked={ownerMode === 'NEW'}
                      onChange={() => setOwnerMode('NEW')}
                    />
                    <span>Create New Owner</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="ownerMode"
                      checked={ownerMode === 'EXISTING'}
                      onChange={() => setOwnerMode('EXISTING')}
                    />
                    <span>Assign Existing Owner (UUID)</span>
                  </label>
                </div>
              )}

              {/* Form Input fields */}
              {(staffFormType === 'EMPLOYEE' || ownerMode === 'NEW') ? (
                <>
                  <Input
                    label="Full Name"
                    id="staffName"
                    placeholder="Enter full name"
                    required
                    value={staffData.name}
                    onChange={(e) => setStaffData({ ...staffData, name: e.target.value })}
                  />
                  <Input
                    label="Email Address"
                    id="staffEmail"
                    type="email"
                    placeholder="email@example.com"
                    required
                    value={staffData.email}
                    onChange={(e) => setStaffData({ ...staffData, email: e.target.value })}
                  />
                  <PasswordInput
                    label="Password"
                    id="staffPassword"
                    placeholder="••••••••"
                    required
                    value={staffData.password}
                    onChange={(e) => setStaffData({ ...staffData, password: e.target.value })}
                  />
                  <Input
                    label="Address"
                    id="staffAddress"
                    placeholder="Enter location address"
                    required
                    value={staffData.address}
                    onChange={(e) => setStaffData({ ...staffData, address: e.target.value })}
                  />
                </>
              ) : (
                <Input
                  label="Owner User ID (UUID)"
                  id="existingOwnerId"
                  placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                  required
                  value={staffData.existingOwnerId}
                  onChange={(e) => setStaffData({ ...staffData, existingOwnerId: e.target.value })}
                />
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={addingStaff}
                >
                  Register Staff
                </Button>
              </div>

              {staffError && <FormError error={staffError} className="mt-2" />}
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default StoreDetailPage;
