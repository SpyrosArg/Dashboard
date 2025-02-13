import React from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import type { Request } from '../types';

interface RequestCardProps {
  request: Request;
  onStatusChange?: (id: string, status: 'approved' | 'rejected') => void;
}

export default function RequestCard({ request, onStatusChange }: RequestCardProps) {
  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  const statusIcons = {
    pending: <Clock className="w-5 h-5 text-gray-500" />,
    approved: <CheckCircle className="w-5 h-5 text-green-500" />,
    rejected: <XCircle className="w-5 h-5 text-red-500" />,
  };

  return (
    <div className="glass-card rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{request.title}</h3>
          <p className="text-white/70">{request.department}</p>
        </div>
        <div className="flex items-center space-x-2">
          {statusIcons[request.status]}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[request.priority]}`}>
            {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
          </span>
        </div>
      </div>

      <p className="text-white/90 mb-4">{request.description}</p>

      {request.status === 'pending' && onStatusChange && (
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => onStatusChange(request.id, 'rejected')}
            className="px-3 py-1 text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            Reject
          </button>
          <button
            onClick={() => onStatusChange(request.id, 'approved')}
            className="px-3 py-1 text-sm bg-white/20 text-white rounded-md hover:bg-white/30 transition-colors"
          >
            Approve
          </button>
        </div>
      )}
    </div>
  );
}