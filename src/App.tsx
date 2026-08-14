import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './pages/Dashboard';
import { ApprovalInbox } from './pages/ApprovalInbox';
import { BrandMemory } from './pages/BrandMemory';
import { Analytics } from './pages/Analytics';
import { PricingPlans } from './pages/PricingPlans';
import { UserProfile } from './pages/UserProfile';
import { Scheduler } from './pages/Scheduler';
import { LandingPage } from './pages/LandingPage';
import { WatchDemo } from './pages/WatchDemo';
import { Notifications } from './pages/Notifications';
import { motion, AnimatePresence } from 'framer-motion';
export function App() {
  const [activePage, setActivePage] = useState('landing');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'approval':
        return <ApprovalInbox />;
      case 'memory':
        return <BrandMemory />;
      case 'analytics':
        return <Analytics />;
      case 'pricing':
        return <PricingPlans />;
      case 'profile':
        return <UserProfile />;
      case 'scheduler':
        return <Scheduler />;
      case 'notifications':
        return <Notifications />;
      default:
        return <Dashboard />;
    }
  };
  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard':
        return 'Dashboard';
      case 'approval':
        return 'Approval Inbox';
      case 'memory':
        return 'Brand Memory';
      case 'analytics':
        return 'Analytics';
      case 'pricing':
        return 'Pricing & Billing';
      case 'profile':
        return 'My Profile';
      case 'scheduler':
        return 'Content Scheduler';
      case 'notifications':
        return 'Notifications';
      default:
        return 'Dashboard';
    }
  };
  // If on landing page or demo page, render without app shell
  if (activePage === 'landing' || activePage === 'demo') {
    return (
      <AnimatePresence mode="wait">
        {activePage === 'landing' ?
        <motion.div
          key="landing"
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          transition={{
            duration: 0.3
          }}>
          
            <LandingPage
            onEnterApp={() => setActivePage('dashboard')}
            onWatchDemo={() => setActivePage('demo')} />
          
          </motion.div> :

        <motion.div
          key="demo"
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          transition={{
            duration: 0.3
          }}>
          
            <WatchDemo
            onEnterApp={() => setActivePage('dashboard')}
            onBack={() => setActivePage('landing')} />
          
          </motion.div>
        }
      </AnimatePresence>);

  }
  // App Shell
  return (
    <div className="min-h-screen bg-cream font-sans text-brown flex">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      

      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        
        <Header title={getPageTitle()} onNavigate={setActivePage} />

        <main className="flex-1 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{
                opacity: 0,
                y: 10
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              exit={{
                opacity: 0,
                y: -10
              }}
              transition={{
                duration: 0.2
              }}
              className="h-full">
              
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>);

}