import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, User, LogOut, Lock } from 'lucide-react';
import { Button } from '../common/Button';
import { useAppSelector, useAppDispatch } from '../../redux/store';
import { logout } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Header = ({ onMenuClick }) => {
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-sm px-4 md:px-6 shadow-sm transition-all duration-200">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none transition-colors"
                >
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="rounded-full w-10 h-10 p-0 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                >
                    <Bell className="h-5 w-5" />
                </Button>

                <div className="relative" ref={dropdownRef}>
                    <button
                        className="flex items-center gap-3 pl-2 sm:pl-4 sm:border-l border-slate-200 focus:outline-none group"
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                    >
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">{user?.full_name || 'User'}</p>
                            <p className="text-xs text-slate-500">{user?.role_name || 'Role'}</p>
                        </div>
                        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white font-medium shadow-md ring-2 ring-white group-hover:ring-blue-100 transition-all">
                            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                        </div>
                    </button>

                    {/* Dropdown Menu */}
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-3 w-56 origin-top-right rounded-xl bg-white py-1 shadow-xl ring-1 ring-black/5 focus:outline-none animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-4 py-3 border-b border-slate-100 md:hidden bg-slate-50/50">
                                <p className="text-sm font-semibold text-slate-900">{user?.full_name}</p>
                                <p className="text-xs text-slate-500">{user?.role_name}</p>
                            </div>
                            <div className="p-1">
                                <button
                                    className="flex w-full items-center px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-colors"
                                    onClick={() => {
                                        setIsProfileOpen(false);
                                        navigate('/change-password');
                                    }}
                                >
                                    <Lock className="mr-3 h-4 w-4 text-slate-400" />
                                    Change Password
                                </button>
                                <button
                                    className="flex w-full items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="mr-3 h-4 w-4 text-red-500" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
