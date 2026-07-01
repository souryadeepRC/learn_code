'use client';

import { cn } from '@/root/src/utils';
import * as React from 'react';

const TabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
  tabsRef: React.MutableRefObject<Map<string, HTMLButtonElement | null>>;
}>({ value: '', onValueChange: () => {}, tabsRef: { current: new Map() } });

type TabsProps = {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children?: React.ReactNode;
};

export const Tabs = ({
  defaultValue,
  value,
  onValueChange,
  className,
  children,
}: TabsProps) => {
  const [current, setCurrent] = React.useState(value || defaultValue || '');
  const [prevValue, setPrevValue] = React.useState(value);
  const tabsRef = React.useRef(new Map<string, HTMLButtonElement | null>());

  if (value !== prevValue) {
    setPrevValue(value);
    if (value !== undefined) {
      setCurrent(value);
    }
  }

  const handleValueChange = (v: string) => {
    setCurrent(v);
    if (onValueChange) onValueChange(v);
  };

  return (
    <TabsContext.Provider
      value={{ value: current, onValueChange: handleValueChange, tabsRef }}
    >
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
};

type TabsListProps = {
  className?: string;
  children?: React.ReactNode;
};

export const TabsList = ({ className, children }: TabsListProps) => {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',
        className
      )}
    >
      {children}
    </div>
  );
};

type TabsTriggerProps = {
  value: string;
  className?: string;
  children?: React.ReactNode;
};

export const TabsTrigger = ({
  value,
  className,
  children,
}: TabsTriggerProps) => {
  const {
    value: selectedValue,
    onValueChange,
    tabsRef,
  } = React.useContext(TabsContext);
  const isSelected = selectedValue === value;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const tabs = Array.from(tabsRef.current.entries());
    const currentIndex = tabs.findIndex(([key]) => key === value);

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % tabs.length;
      const nextTab = tabs[nextIndex][1];
      nextTab?.focus();
      onValueChange(tabs[nextIndex][0]);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      const prevTab = tabs[prevIndex][1];
      prevTab?.focus();
      onValueChange(tabs[prevIndex][0]);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onValueChange(value);
    }
  };

  return (
    <button
      ref={(el) => {
        if (el) tabsRef.current.set(value, el);
        else tabsRef.current.delete(value);
      }}
      type="button"
      role="tab"
      aria-selected={isSelected}
      tabIndex={0}
      onClick={() => onValueChange(value)}
      onKeyDown={handleKeyDown}
      className={cn(
        'cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        isSelected ? 'bg-background text-foreground shadow-sm' : '',
        className
      )}
    >
      {children}
    </button>
  );
};

type TabsContentProps = {
  value: string;
  className?: string;
  children?: React.ReactNode;
};

export const TabsContent = ({
  value,
  className,
  children,
}: TabsContentProps) => {
  const { value: selectedValue } = React.useContext(TabsContext);

  if (selectedValue !== value) return null;

  return (
    <div
      role="tabpanel"
      className={cn(
        'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
    >
      {children}
    </div>
  );
};
