import React, { useState, useMemo, useEffect } from 'react';
import { Shield, ChevronDown, ChevronUp, FileText, User, Mail, Briefcase, Calendar, UserPlus, AlertTriangle, CheckCircle, XCircle, LogOut, Moon, Sun } from 'lucide-react';
import { useRequest } from '../context/RequestContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const PRIORITY_COLORS = {
  low: '#3B82F6',
  medium: '#F59E0B',
  high: '#EF4444',
};

const TEAM_MEMBERS = [
  { id: '1', name: 'Mitsos' },
  { id: '2', name: 'Kitsos' },
  { id: '3', name: 'Roula' },
  { id: '4', name: 'Koula' },
];

function AdminDashboardPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
  const { requests, updateRequestStatus, updateRequestAssignee } = useRequest();

  // Separate requests by status
  const { activeRequests, rejectedRequests } = useMemo(() => {
    return {
      activeRequests: requests.filter(r => r.status !== 'rejected'),
      rejectedRequests: requests.filter(r => r.status === 'rejected'),
    };
  }, [requests]);

  // Stats calculation
  const stats = useMemo(() => {
    const pendingCount = requests.filter(r => r.status === 'pending').length;
    const approvedCount = requests.filter(r => r.status === 'approved').length;
    const rejectedCount = rejectedRequests.length;

    return {
      pendingCount,
      approvedCount,
      rejectedCount,
    };
  }, [requests, rejectedRequests]);

  // Check session validity periodically
  useEffect(() => {
    const checkSession = () => {
      const sessionExpiry = localStorage.getItem('sessionExpiry');
      if (!sessionExpiry || new Date().getTime() > parseInt(sessionExpiry)) {
        handleLogout();
      }
    };

    const interval = setInterval(checkSession, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const toggleRequest = (id: string) => {
    setExpandedRequest(expandedRequest === id ? null : id);
  };

  const handleStatusChange = async (id: string, newStatus: 'approved' | 'rejected') => {
    await updateRequestStatus(id, newStatus);
  };

  const handleAssigneeChange = async (id: string, assignee: string) => {
    await updateRequestAssignee(id, assignee);
  };

  const RequestDetails = ({ request }: { request: any }) => (
    <div className="px-6 py-4 border-t border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-white/70 mb-1">Requester Details</h4>
            <div className="space-y-2">
              <div className="flex items-center text-white">
                <User className="w-4 h-4 mr-2" />
                {request.requesterName}
              </div>
              <div className="flex items-center text-white">
                <Mail className="w-4 h-4 mr-2" />
                {request.requesterEmail}
              </div>
              <div className="flex items-center text-white">
                <Briefcase className="w-4 h-4 mr-2" />
                {request.requesterRole}
              </div>
              <div className="flex items-center text-white">
                <Calendar className="w-4 h-4 mr-2" />
                {request.createdAt.toLocaleDateString()}
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-white/70 mb-1">Business Justification</h4>
            <p className="text-white">{request.businessJustification}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-white/70 mb-1">Assignee</h4>
            <div className="relative">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-4 h-4 text-white/70" />
                <select
                  value={request.assignee || ''}
                  onChange={(e) => handleAssigneeChange(request.id, e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-md px-3 py-1.5 text-white text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  style={{ color: 'white' }}
                >
                  <option value="" className="bg-gray-900">Assign team member</option>
                  {TEAM_MEMBERS.map((member) => (
                    <option key={member.id} value={member.name} className="bg-gray-900">
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-white/70 mb-1">Technical Details</h4>
            <p className="text-white">{request.technicalDetails}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-white/70 mb-1">Additional Information</h4>
            <p className="text-white">{request.description}</p>
          </div>

          {request.documents && request.documents.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-white/70 mb-2">Attached Documents</h4>
              <div className="space-y-2">
                {request.documents.map((doc: any, index: number) => (
                  <div key={index} className="flex items-center text-white">
                    <FileText className="w-4 h-4 mr-2" />
                    <span>{doc.type}: {doc.file.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {request.status !== 'rejected' && (
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => handleStatusChange(request.id, 'rejected')}
                className="px-4 py-2 text-red-400 hover:text-red-300 transition-colors"
              >
                Reject
              </button>
              <button
                onClick={() => handleStatusChange(request.id, 'approved')}
                className={`px-4 py-2 ${
                  request.status === 'approved'
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-white/20 text-white hover:bg-white/30'
                } rounded-md transition-colors`}
              >
                Approve
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'bg-red-950' : 'bg-black'}`}>
      {/* Side Navigation */}
      <div className={`w-64 ${theme === 'dark' ? 'bg-red-900/50' : 'bg-gray-900/50'} p-4 flex flex-col overflow-y-auto max-h-screen`}>
        <div className="flex items-center space-x-3 mb-8">
          <Shield className="w-8 h-8 text-white" />
          <h1 className="text-xl font-bold text-white">Admin Portal</h1>
        </div>

        {/* Status Overview */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Status Overview</h2>
          <div className="space-y-2">
            <div className="bg-red-800/50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-white/70">Pending</span>
                </div>
                <span className="text-lg font-bold text-white">{stats.pendingCount}</span>
              </div>
            </div>
            <div className="bg-red-800/50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-white/70">Approved</span>
                </div>
                <span className="text-lg font-bold text-white">{stats.approvedCount}</span>
              </div>
            </div>
            <div className="bg-red-800/50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-white/70">Rejected</span>
                </div>
                <span className="text-lg font-bold text-white">{stats.rejectedCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Add theme and logout buttons at the bottom */}
        <div className="mt-auto pt-6 space-y-2">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center space-x-3 px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            {theme === 'dark' ? (
              <>
                <Moon className="w-5 h-5" />
                <span>Dark Mode</span>
              </>
            ) : (
              <>
                <Sun className="w-5 h-5" />
                <span>Light Mode</span>
              </>
            )}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Active Requests Section */}
          <div>
            <h1 className="text-2xl font-bold text-white mb-6">Active Requests</h1>
            <div className="space-y-4">
              {activeRequests.map((request) => (
                <div key={request.id} className="glass-card rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleRequest(request.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        request.status === 'approved' ? 'bg-green-500' : 'bg-orange-500'
                      }`} />
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-white">{request.title}</h3>
                        <div className="flex items-center text-white/70 space-x-2">
                          <span>{request.department}</span>
                          {request.assignee && (
                            <>
                              <span>•</span>
                              <div className="flex items-center">
                                <UserPlus className="w-4 h-4 mr-1" />
                                <span>{request.assignee}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        PRIORITY_COLORS[request.priority]
                      } bg-opacity-20`}>
                        {request.priority.toUpperCase()}
                      </span>
                      {expandedRequest === request.id ? (
                        <ChevronUp className="w-5 h-5 text-white/70" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-white/70" />
                      )}
                    </div>
                  </button>

                  {expandedRequest === request.id && <RequestDetails request={request} />}
                </div>
              ))}
            </div>
          </div>

          {/* Rejected Requests Section */}
          {rejectedRequests.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-red-400 mb-6">Rejected Requests</h2>
              <div className="space-y-4">
                {rejectedRequests.map((request) => (
                  <div key={request.id} className="glass-card rounded-lg overflow-hidden border border-red-500/20">
                    <button
                      onClick={() => toggleRequest(request.id)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="text-left">
                          <h3 className="text-lg font-semibold text-white">{request.title}</h3>
                          <div className="flex items-center text-white/70 space-x-2">
                            <span>{request.department}</span>
                            {request.assignee && (
                              <>
                                <span>•</span>
                                <div className="flex items-center">
                                  <UserPlus className="w-4 h-4 mr-1" />
                                  <span>{request.assignee}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          PRIORITY_COLORS[request.priority]
                        } bg-opacity-20`}>
                          {request.priority.toUpperCase()}
                        </span>
                        {expandedRequest === request.id ? (
                          <ChevronUp className="w-5 h-5 text-white/70" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-white/70" />
                        )}
                      </div>
                    </button>

                    {expandedRequest === request.id && <RequestDetails request={request} />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;