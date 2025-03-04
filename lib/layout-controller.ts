"use client"
/**
 * layout-controller.ts - Utility for managing dashboard components and views
 * 
 * @author Joshua Salcedo
 */

import { ReactNode } from 'react';
import { create } from 'zustand';
import { UserRole } from '@/contexts/AuthContext';

// Define view types
export type ViewType = 'dashboard' | 'wikipedia' | 'admin' | 'settings' | 'profile' | string;

// Define view component
export interface LayoutView {
  id: ViewType;
  component: React.ComponentType<any>;
  props?: Record<string, any>;
  title?: string;
  requiredRole?: UserRole;
}

// Layout store state interface
interface LayoutState {
  // Current view
  currentView: ViewType;
  
  // Registered views
  views: Map<ViewType, LayoutView>;
  
  // Change the current view
  setCurrentView: (viewId: ViewType, viewProps?: Record<string, any>) => void;
  
  // Register a new view
  registerView: (view: LayoutView) => void;
  
  // Unregister a view
  unregisterView: (viewId: ViewType) => void;
  
  // Get a specific view
  getView: (viewId: ViewType) => LayoutView | undefined;
  
  // Update view props
  updateViewProps: (viewId: ViewType, props: Record<string, any>) => void;
}

/**
 * Layout controller store
 * 
 * Manages views and components for the dashboard
 */
export const useLayoutStore = create<LayoutState>((set, get) => ({
  currentView: 'dashboard',
  views: new Map(),
  
  setCurrentView: (viewId, viewProps) => {
    set({ currentView: viewId });
    
    if (viewProps) {
      get().updateViewProps(viewId, viewProps);
    }
  },
  
  registerView: (view) => {
    set((state) => ({
      views: new Map(state.views).set(view.id, view)
    }));
  },
  
  unregisterView: (viewId) => {
    set((state) => {
      const newViews = new Map(state.views);
      newViews.delete(viewId);
      
      return { views: newViews };
    });
  },
  
  getView: (viewId) => {
    return get().views.get(viewId);
  },
  
  updateViewProps: (viewId, props) => {
    set((state) => {
      const view = state.views.get(viewId);
      if (!view) return state;
      
      const updatedView = {
        ...view,
        props: { ...(view.props || {}), ...props }
      };
      
      const newViews = new Map(state.views);
      newViews.set(viewId, updatedView);
      
      return { views: newViews };
    });
  }
}));

/**
 * Helper function to switch to a specific view
 */
export const switchToView = (viewId: ViewType, viewProps?: Record<string, any>) => {
  useLayoutStore.getState().setCurrentView(viewId, viewProps);
};

/**
 * Helper function to register multiple views at once
 */
export const registerViews = (views: LayoutView[]) => {
  const { registerView } = useLayoutStore.getState();
  views.forEach(view => registerView(view));
};

/**
 * Hook for using the layout controller in components
 */
export const useLayoutController = () => {
  const { 
    currentView, 
    views, 
    setCurrentView, 
    registerView, 
    unregisterView,
    getView,
    updateViewProps
  } = useLayoutStore();
  
  return {
    currentView,
    views,
    setCurrentView,
    registerView,
    unregisterView,
    getView,
    updateViewProps,
    
    // Current view component with props
    getCurrentView: () => {
      const view = views.get(currentView);
      return view;
    }
  };
};