import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Request } from '../types';

interface RequestContextType {
  requests: Request[];
  addRequest: (request: Omit<Request, 'id' | 'status' | 'createdAt'>) => void;
  updateRequestStatus: (id: string, status: 'approved' | 'rejected') => void;
  updateRequestAssignee: (id: string, assignee: string) => void;
}

const RequestContext = createContext<RequestContextType | undefined>(undefined);

const STORAGE_KEY = 'cybersecurity-requests';

export function RequestProvider({ children }: { children: React.ReactNode }) {
  const [requests, setRequests] = useState<Request[]>(() => {
    const savedRequests = localStorage.getItem(STORAGE_KEY);
    if (savedRequests) {
      const parsed = JSON.parse(savedRequests);
      return parsed.map((request: any) => ({
        ...request,
        createdAt: new Date(request.createdAt),
      }));
    }
    return [];
  });

  // Save requests to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  }, [requests]);

  const addRequest = useCallback((newRequest: Omit<Request, 'id' | 'status' | 'createdAt'>) => {
    const request = {
      ...newRequest,
      id: crypto.randomUUID(),
      status: 'pending' as const,
      createdAt: new Date(),
    };
    setRequests(prev => [request, ...prev]);
  }, []);

  const updateRequestStatus = useCallback((id: string, status: 'approved' | 'rejected') => {
    setRequests(prev =>
      prev.map(request =>
        request.id === id ? { ...request, status } : request
      )
    );
  }, []);

  const updateRequestAssignee = useCallback((id: string, assignee: string) => {
    setRequests(prev =>
      prev.map(request =>
        request.id === id ? { ...request, assignee } : request
      )
    );
  }, []);

  return (
    <RequestContext.Provider
      value={{
        requests,
        addRequest,
        updateRequestStatus,
        updateRequestAssignee,
      }}
    >
      {children}
    </RequestContext.Provider>
  );
}

export function useRequest() {
  const context = useContext(RequestContext);
  if (context === undefined) {
    throw new Error('useRequest must be used within a RequestProvider');
  }
  return context;
}