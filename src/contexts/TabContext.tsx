import { useState, createContext, useContext, ReactNode } from "react";

interface ProjectTab {
  id: string;
  title: string;
  path: string;
  isActive: boolean;
}

interface TabContextType {
  tabs: ProjectTab[];
  activeTabId: string | null;
  openTab: (id: string, title: string, path: string) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export function TabProvider({ children }: { children: ReactNode }) {
  const [tabs, setTabs] = useState<ProjectTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  const openTab = (id: string, title: string, path: string) => {
    setTabs(prevTabs => {
      const existingTab = prevTabs.find(tab => tab.id === id);
      if (existingTab) {
        // Tab already exists, just activate it
        return prevTabs.map(tab => ({
          ...tab,
          isActive: tab.id === id
        }));
      }

      // Create new tab
      const newTabs = prevTabs.map(tab => ({ ...tab, isActive: false }));
      newTabs.push({
        id,
        title,
        path,
        isActive: true
      });
      return newTabs;
    });
    setActiveTabId(id);
  };

  const closeTab = (id: string) => {
    setTabs(prevTabs => {
      const tabToClose = prevTabs.find(tab => tab.id === id);
      const filteredTabs = prevTabs.filter(tab => tab.id !== id);
      
      if (tabToClose?.isActive && filteredTabs.length > 0) {
        // If closing active tab, activate the last remaining tab
        filteredTabs[filteredTabs.length - 1].isActive = true;
        setActiveTabId(filteredTabs[filteredTabs.length - 1].id);
      } else if (filteredTabs.length === 0) {
        // No tabs left, go back to dashboard
        setActiveTabId(null);
      }
      
      return filteredTabs;
    });
  };

  const setActiveTab = (id: string) => {
    if (id === "dashboard") {
      setTabs(prevTabs => prevTabs.map(tab => ({ ...tab, isActive: false })));
      setActiveTabId(null);
    } else {
      setTabs(prevTabs => prevTabs.map(tab => ({
        ...tab,
        isActive: tab.id === id
      })));
      setActiveTabId(id);
    }
  };

  return (
    <TabContext.Provider value={{
      tabs,
      activeTabId,
      openTab,
      closeTab,
      setActiveTab
    }}>
      {children}
    </TabContext.Provider>
  );
}

export function useTabContext() {
  const context = useContext(TabContext);
  if (context === undefined) {
    throw new Error('useTabContext must be used within a TabProvider');
  }
  return context;
}