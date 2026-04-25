import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 overflow-y-auto">
                    <div className="p-4 md:p-6 lg:p-8 pb-24 md:pb-10">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;