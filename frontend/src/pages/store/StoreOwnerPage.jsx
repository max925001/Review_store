import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { 
  Award, Star, ShoppingBag, Users, Store, Shield, 
  Plus, Trash2, MessageSquare, Calendar, 
  ChevronLeft, ChevronRight
} from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import ROUTES from '../../constants/routes.js';
import {
  fetchStoreDetails,
  fetchStoreRatings,
  fetchStoreEmployees,
  addEmployee,
  removeEmployee,
} from '../../features/storeOwner/storeOwnerThunks.js';
import {
  clearStoreOwnerErrors,
  resetAddEmployeeState,
} from '../../features/storeOwner/storeOwnerSlice.js';
import StoreReviewsList from '../../components/store/StoreReviewsList.jsx';
import StoreHeaderBanner from '../../components/store/StoreHeaderBanner.jsx';
import AddUserModal from '../../components/ui/AddUserModal.jsx';

export const StoreOwnerPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.auth);
  const {
    storeDetails,
    ratings,
    ratingsPagination,
    employees,
    loading,
    errors,
    addEmployeeSuccess,
  } = useSelector((state) => state.storeOwner);

  const [activeTab, setActiveTab] = useState('employees'); // 'employees' or 'reviews'
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const [formErrors, setFormErrors] = useState({});

  const storeId = user?.storeId;

  // Fetch initial data
  useEffect(() => {
    if (storeId) {
      dispatch(fetchStoreDetails(storeId));
      dispatch(fetchStoreEmployees(storeId));
      dispatch(fetchStoreRatings({ storeId, page: currentPage, limit: 5 }));
    }
  }, [dispatch, storeId, currentPage]);

  // Handle add employee success
  useEffect(() => {
    if (addEmployeeSuccess) {
      setShowAddModal(false);
      setFormErrors({});
      dispatch(resetAddEmployeeState());
    }
  }, [addEmployeeSuccess, dispatch]);

  if (!user) return null;

  // Guard: Must be store owner
  if (user.role !== 'STORE_OWNER') {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  // Guard: Must be assigned to a store
  if (!storeId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto text-center px-4 py-8">
        <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-full flex items-center justify-center mb-6 shadow-md">
          <Shield size={32} />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          Dashboard Pending
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
          Welcome, <span className="font-semibold text-slate-800 dark:text-slate-200">{user.name}</span>. You are registered as a Store Owner, but your profile has not been linked to a store location by the system administrator yet.
        </p>
        <div className="bg-slate-100 dark:bg-brand-900/20 border border-slate-200 dark:border-brand-800/40 rounded-xl p-4 mt-6 text-xs text-left text-slate-500 dark:text-slate-400 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <span>Please contact the administrator or provide your ID <code className="bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800 font-mono text-[10px] select-all">{user.id}</code> to complete store owner assignment.</span>
        </div>
        <Button
          variant="secondary"
          onClick={() => navigate(ROUTES.HOME)}
          className="mt-6 w-full"
        >
          Return to Home Page
        </Button>
      </div>
    );
  }

  const handleAddEmployeeSubmit = (formData) => {
    dispatch(clearStoreOwnerErrors());
    dispatch(addEmployee({ storeId, employeeData: formData }));
  };

  const handleDeleteConfirm = (employeeId) => {
    dispatch(removeEmployee({ storeId, employeeId }));
    setConfirmDeleteId(null);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto py-4 px-4 sm:px-6">
      
      {/* Hero Header Banner */}
      <StoreHeaderBanner
        store={storeDetails}
        isLoading={loading.details}
        subtitle={`Store Owner Profile for user ${user.name}. Manage employees and analyze real-time ratings.`}
      />

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Rating Card */}
        <div className="p-5 bg-white/80 dark:bg-brand-900/30 border border-slate-200/60 dark:border-brand-800/40 rounded-2xl shadow-sm backdrop-blur-md flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 rounded-xl">
            <Star size={22} fill="currentColor" />
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Average Rating</span>
            {loading.details ? (
              <Skeleton variant="text" className="h-5 w-16 mt-1" />
            ) : (
              <span className="text-xl font-extrabold text-slate-800 dark:text-white">
                {storeDetails?.avgrating !== undefined ? Number(storeDetails.avgrating).toFixed(1) : '0.0'} / 5.0
              </span>
            )}
          </div>
        </div>

        {/* Reviews Card */}
        <div className="p-5 bg-white/80 dark:bg-brand-900/30 border border-slate-200/60 dark:border-brand-800/40 rounded-2xl shadow-sm backdrop-blur-md flex items-center gap-4">
          <div className="p-3 bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400 rounded-xl">
            <ShoppingBag size={22} />
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Reviews</span>
            {loading.details ? (
              <Skeleton variant="text" className="h-5 w-20 mt-1" />
            ) : (
              <span className="text-xl font-extrabold text-slate-800 dark:text-white">
                {storeDetails?.total_review_user || 0} Submitted
              </span>
            )}
          </div>
        </div>

        {/* Employees Card */}
        <div className="p-5 bg-white/80 dark:bg-brand-900/30 border border-slate-200/60 dark:border-brand-800/40 rounded-2xl shadow-sm backdrop-blur-md flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 rounded-xl">
            <Users size={22} />
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Employees</span>
            {loading.employees ? (
              <Skeleton variant="text" className="h-5 w-16 mt-1" />
            ) : (
              <span className="text-xl font-extrabold text-slate-800 dark:text-white">
                {employees.length} Staff
              </span>
            )}
          </div>
        </div>

      </div>

      {/* Tab Selectors */}
      <div className="flex border-b border-slate-200/60 dark:border-brand-800/40">
        <button
          onClick={() => setActiveTab('employees')}
          className={`px-5 py-3.5 text-sm font-semibold border-b-2 transition-all duration-200 flex items-center gap-2 cursor-pointer ${
            activeTab === 'employees'
              ? 'border-brand-500 text-brand-650 dark:text-brand-400'
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <Users size={16} />
          <span>Employees List</span>
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-5 py-3.5 text-sm font-semibold border-b-2 transition-all duration-200 flex items-center gap-2 cursor-pointer ${
            activeTab === 'reviews'
              ? 'border-brand-500 text-brand-650 dark:text-brand-400'
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <MessageSquare size={16} />
          <span>Customer Feedback</span>
        </button>
      </div>

      {/* Employees Directory Tab */}
      {activeTab === 'employees' && (
        <div className="flex flex-col gap-6">
          
          {/* Header Action Row */}
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <span>Branch Staff Directory</span>
            </h3>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setShowAddModal(true);
                dispatch(clearStoreOwnerErrors());
              }}
              className="flex items-center gap-1.5"
            >
              <Plus size={16} />
              <span>Add Employee</span>
            </Button>
          </div>

          {/* Centered Add Employee Modal */}
          <AddUserModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddEmployeeSubmit}
            isLoading={loading.addEmployee}
            error={errors.addEmployee}
            title="Register New Employee"
            submitLabel="Save Employee"
          />

          {/* Employees List Grid */}
          {loading.employees ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-5 border border-slate-100 dark:border-brand-900/30 rounded-2xl flex flex-col gap-3">
                  <Skeleton variant="title" className="w-1/2" />
                  <Skeleton variant="text" className="w-3/4" />
                  <Skeleton variant="text" className="w-1/3" />
                </div>
              ))}
            </div>
          ) : employees.length === 0 ? (
            <div className="text-center py-10 bg-white/40 dark:bg-brand-900/10 border border-dashed border-slate-200 dark:border-brand-900/25 rounded-2xl">
              <Users size={32} className="mx-auto text-slate-300 dark:text-brand-800 mb-3" />
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                No employees registered
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Add staff members using the "Add Employee" button.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {employees.map((emp) => (
                <div
                  key={emp.userId}
                  className="p-5 bg-white/80 dark:bg-brand-900/20 border border-slate-200/60 dark:border-brand-900/30 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 backdrop-blur-md flex flex-col justify-between gap-4"
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm">
                        {emp.name}
                      </h4>
                      <span className="text-[9px] uppercase font-extrabold tracking-wider bg-emerald-50 dark:bg-emerald-950/35 text-emerald-600 dark:text-emerald-450 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-950/20">
                        {emp.role === 'EMPLOYEE_USER' ? 'Staff' : emp.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-450 dark:text-slate-400 font-mono">
                      {emp.email}
                    </p>
                    {emp.address && (
                      <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed mt-1">
                        {emp.address}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-brand-900/20">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Calendar size={12} />
                      <span>Joined {new Date(emp.createdAt).toLocaleDateString()}</span>
                    </span>

                    {confirmDeleteId === emp.userId ? (
                      <div className="flex gap-2">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteConfirm(emp.userId)}
                          className="py-1 px-2.5 text-xxs"
                          isLoading={loading.removeEmployee}
                        >
                          Confirm
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setConfirmDeleteId(null)}
                          className="py-1 px-2.5 text-xxs"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(emp.userId)}
                        className="text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg cursor-pointer"
                        title="Remove Employee"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {errors.removeEmployee && (
            <div className="p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{errors.removeEmployee}</span>
            </div>
          )}
        </div>
      )}

      {/* Customer Feedback Tab */}
      {activeTab === 'reviews' && (
        <StoreReviewsList
          title="Customer Review Panel"
          reviews={ratings}
          pagination={ratingsPagination}
          isLoading={loading.ratings}
          error={errors.ratings}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}

    </div>
  );
};

export default StoreOwnerPage;
