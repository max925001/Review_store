import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  User, Mail, Shield, Calendar, MapPin, ArrowLeft, 
  Star, Store, ShieldAlert, Lock, CheckCircle, AlertCircle, X 
} from 'lucide-react';
import Loader from '../../components/ui/Loader.jsx';
import Button from '../../components/ui/Button.jsx';
import PasswordInput from '../../components/ui/PasswordInput.jsx';
import apiClient from '../../api/axios.js';
import { changePasswordApi } from '../../features/auth/authApi.js';

export const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Logged in user info
  const { user: currentUser } = useSelector((state) => state.auth);

  // Inspected user info states
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Change Password Form State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const validatePasswordForm = () => {
    const errs = {};
    if (!passwordData.oldPassword) {
      errs.oldPassword = 'Current password is required';
    }
    if (!passwordData.newPassword) {
      errs.newPassword = 'New password is required';
    } else {
      const password = passwordData.newPassword;
      if (password.length < 8 || password.length > 16) {
        errs.newPassword = 'Password must be between 8 and 16 characters';
      } else if (!/[A-Z]/.test(password)) {
        errs.newPassword = 'Password must contain at least one uppercase letter';
      } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errs.newPassword = 'Password must contain at least one special character';
      }
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);
    
    if (!validatePasswordForm()) return;
    
    try {
      setUpdatingPassword(true);
      await changePasswordApi({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordSuccess('Your account password has been updated successfully.');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setFieldErrors({});
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess(null);
      }, 1500);
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update password. Please check your credentials.');
    } finally {
      setUpdatingPassword(false);
    }
  };

  // Access validation: Only Admins can inspect other profile IDs
  const canInspect = !id || currentUser?.role === 'ADMIN';

  const fetchProfileUser = async () => {
    if (!id) {
      // Use logged in user
      setProfileUser(currentUser);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get(`/admin/users/${id}`);
      setProfileUser(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retrieve user profile specifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canInspect) {
      fetchProfileUser();
    }
  }, [id, currentUser]);

  if (!currentUser) return null;

  // Render Access Denied for non-admins trying to inspect other users
  if (!canInspect) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-center">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Access Denied</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          You do not have permission to view other user profile details.
        </p>
        <Button onClick={() => navigate(-1)} className="mt-5 w-full">
          Go Back
        </Button>
      </div>
    );
  }

  // Format date nicely
  const joinDate = profileUser?.createdAt 
    ? new Date(profileUser.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // Map roles to cleaner display names
  const roleDisplayNames = {
    ADMIN: 'System Administrator',
    STORE_OWNER: 'Store Owner',
    USER: 'Customer / User'
  };

  const roleColors = {
    ADMIN: 'from-purple-500/10 to-indigo-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-900/50',
    STORE_OWNER: 'from-blue-500/10 to-cyan-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900/50',
    USER: 'from-emerald-500/10 to-teal-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50'
  };

  const initials = profileUser?.name
    ? profileUser.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : 'U';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Back Button (only when viewing someone else's profile) */}
      {id && (
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors text-sm font-semibold focus:outline-none cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
      )}

      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
          {id ? 'Inspect User Account' : 'Profile Settings'}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {id ? 'Viewing platform account specifications.' : 'Manage your personal profile details and account information.'}
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[200px] gap-3">
          <Loader size="md" />
          <span className="text-xs text-slate-400">Retrieving account parameters...</span>
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-650 dark:text-rose-400 text-sm font-medium flex items-center gap-2">
          <ShieldAlert size={18} />
          <span>{error}</span>
        </div>
      ) : profileUser ? (
        <div className="space-y-6">
          {/* Main Profile Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm transition-all duration-200">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar circle */}
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold tracking-wider shadow-lg shadow-brand-500/20 shrink-0">
                {initials}
              </div>

              {/* Core Info */}
              <div className="flex-1 text-center sm:text-left space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">{profileUser.name}</h2>
                    <span className={`inline-flex items-center px-3 py-1 mt-1 text-xs font-semibold rounded-full border bg-gradient-to-r ${roleColors[profileUser.role] || roleColors.USER}`}>
                      {roleDisplayNames[profileUser.role] || profileUser.role}
                    </span>
                  </div>
                  {!id && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowPasswordModal(true);
                        setPasswordError(null);
                        setPasswordSuccess(null);
                        setFieldErrors({});
                        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                      }}
                      className="flex items-center gap-1.5 self-center sm:self-start"
                    >
                      <Lock size={14} />
                      <span>Change Password</span>
                    </Button>
                  )}
                </div>

                <hr className="border-slate-100 dark:border-slate-800" />

                {/* Profile Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <Mail size={18} className="text-slate-400 dark:text-slate-500" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xxs uppercase tracking-wider text-slate-400 font-bold">Email Address</span>
                      <span className="text-sm font-medium break-all">{profileUser.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <Shield size={18} className="text-slate-400 dark:text-slate-500" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xxs uppercase tracking-wider text-slate-400 font-bold">Account Role</span>
                      <span className="text-sm font-medium">{profileUser.role}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <Calendar size={18} className="text-slate-400 dark:text-slate-500" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xxs uppercase tracking-wider text-slate-400 font-bold">Member Since</span>
                      <span className="text-sm font-medium">{joinDate}</span>
                    </div>
                  </div>

                  {profileUser.address && (
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                        <MapPin size={18} className="text-slate-400 dark:text-slate-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xxs uppercase tracking-wider text-slate-400 font-bold">Location / Address</span>
                        <span className="text-sm font-medium truncate max-w-[200px]" title={profileUser.address}>{profileUser.address}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Owned Store Details Panel (For STORE_OWNER user role) */}
          {profileUser.role === 'STORE_OWNER' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm transition-colors space-y-4">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/80 text-base">
                <Store size={18} className="text-brand-500" />
                <span>Owned Store Location</span>
              </h3>
              
              {profileUser.store ? (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/50 dark:bg-slate-950/10 p-5 rounded-xl border border-slate-200/40 dark:border-slate-800">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Link to={`/stores/${profileUser.store.id}`} className="text-lg font-extrabold text-slate-800 dark:text-white hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
                        {profileUser.store.name}
                      </Link>
                      <p className="text-xs text-slate-400">{profileUser.store.email}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <MapPin size={14} className="text-slate-400" />
                      <span>{profileUser.store.address}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Average Rating</span>
                      <div className="flex items-baseline gap-1.5 mt-1">
                        <span className="text-xl font-extrabold text-slate-800 dark:text-white">{profileUser.store.averageRating || '0.0'}</span>
                        <span className="text-[10px] text-slate-400">/ 5.0</span>
                      </div>
                    </div>
                    <div className="flex flex-col pl-4 border-l border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Total Ratings</span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-350 mt-1">{profileUser.store.totalReviewUser || 0} reviews</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm italic text-slate-400 py-2">
                  This owner account has not been assigned to any store location.
                </p>
              )}
            </div>
          )}

      {/* ===== CENTRED OVERLAY MODAL: Change Password ===== */}
      {!id && showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 transition-colors">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-base">
                <Lock size={18} className="text-brand-500" />
                <span>Change Account Password</span>
              </h3>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordError(null);
                  setPasswordSuccess(null);
                  setFieldErrors({});
                  setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleChangePasswordSubmit} className="p-6 space-y-4">
              <PasswordInput
                id="oldPassword"
                label="Current Password"
                placeholder="Enter current password"
                required
                value={passwordData.oldPassword}
                onChange={(e) => {
                  setPasswordData({ ...passwordData, oldPassword: e.target.value });
                  if (fieldErrors.oldPassword) setFieldErrors({ ...fieldErrors, oldPassword: null });
                }}
                error={fieldErrors.oldPassword}
              />

              <div>
                <PasswordInput
                  id="newPassword"
                  label="New Password"
                  placeholder="Enter new password"
                  required
                  value={passwordData.newPassword}
                  onChange={(e) => {
                    setPasswordData({ ...passwordData, newPassword: e.target.value });
                    if (fieldErrors.newPassword) setFieldErrors({ ...fieldErrors, newPassword: null });
                  }}
                  error={fieldErrors.newPassword}
                />
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                  Criteria: 8-16 characters, at least 1 uppercase letter, and 1 special character.
                </p>
              </div>

              <PasswordInput
                id="confirmPassword"
                label="Confirm New Password"
                placeholder="Confirm new password"
                required
                value={passwordData.confirmPassword}
                onChange={(e) => {
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value });
                  if (fieldErrors.confirmPassword) setFieldErrors({ ...fieldErrors, confirmPassword: null });
                }}
                error={fieldErrors.confirmPassword}
              />

              <div className="pt-2 flex flex-col gap-3">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPasswordError(null);
                      setPasswordSuccess(null);
                      setFieldErrors({});
                      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={updatingPassword}
                    className="font-bold text-xs"
                  >
                    Update Password
                  </Button>
                </div>

                {passwordSuccess && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
                    <CheckCircle size={16} className="shrink-0" />
                    <span>{passwordSuccess}</span>
                  </div>
                )}

                {passwordError && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 p-3 rounded-xl">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
        </div>
      ) : null}
    </div>
  );
};

export default ProfilePage;
