import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

type Tab = {
  name: string;
  href: string;
  current: boolean;
};

const tabs: Tab[] = [
  { name: 'View All', href: '#', current: false },
  { name: 'Quotes', href: '#', current: false },
  { name: 'Orders', href: '#', current: true },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

type OrdersTabsProps = {
  selectedTab: string;
  onSelectTab: (tabName: string) => void;
};

export function OrdersTabs({ selectedTab, onSelectTab }: OrdersTabsProps) {
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState<string>(selectedTab);

  useEffect(() => {
    const currentTab = tabs.find((tab) => tab.href === location.pathname);
    if (currentTab) {
      setCurrentTab(currentTab.name);
    }
  }, [location]);

  const handleTabClick = (tab: Tab) => {
    setCurrentTab(tab.name);
    onSelectTab(tab.name);
  };

  return (
    <div>
      <div className="">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                to={tab.href}
                onClick={() => handleTabClick(tab)}
                className={classNames(
                  tab.name === currentTab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'w-1/3 border-b-2 py-4 px-1 text-center text-sm font-medium'
                )}
                aria-current={tab.name === currentTab ? 'page' : undefined}
              >
                {tab.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
