import React from 'react';
import { Shield } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Shield className="w-16 h-16 text-gray-400 mb-4" />
      <h3 className="text-xl font-medium text-gray-900 mb-2">No requests yet</h3>
      <p className="text-gray-500">Waiting for new requests to come in</p>
    </div>
  );
}