import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getItems, saveItems, getClaims, saveClaims, getUsers, saveUsers, createNotification } from '../utils/storage';
import { FoundItem, ClaimRequest, User, Notification } from '../types';
import { Eye, Check, X, Trash2, Users, Package, MessageCircle, Shield, MapPin, FileText } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const Admin: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'items' | 'claims' | 'users'>('items');
  const [items, setItems] = useState<FoundItem[]>([]);
  const [claims, setClaims] = useState<ClaimRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [approvingClaimId, setApprovingClaimId] = useState<string | null>(null);
  const [pickupLocation, setPickupLocation] = useState('');
  const [adminNote, setAdminNote] = useState('');

  useEffect(() => {
    setItems(getItems());
    setClaims(getClaims());
    setUsers(getUsers());
  }, []);

  const handleApproveItem = (itemId: string) => {
    const updatedItems = items.map(item =>
      item.id === itemId ? { ...item, status: 'available' as const } : item
    );
    setItems(updatedItems);
    saveItems(updatedItems);
  };

  const handleDeleteItem = (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const updatedItems = items.filter(item => item.id !== itemId);
      setItems(updatedItems);
      saveItems(updatedItems);
      
      // Also delete related claims
      const updatedClaims = claims.filter(claim => claim.itemId !== itemId);
      setClaims(updatedClaims);
      saveClaims(updatedClaims);
    }
  };

  const handleApproveClaim = (claimId: string) => {
    const claim = claims.find(c => c.id === claimId);
    if (!claim) return;

    const updatedClaims = claims.map(c =>
      c.id === claimId ? {
        ...c,
        status: 'approved' as const,
        pickupLocation: pickupLocation || 'Main Office',
        adminNote: adminNote || 'Your item is ready for pickup during school hours.'
      } : c
    );
    setClaims(updatedClaims);
    saveClaims(updatedClaims);

    const updatedItems = items.map(item =>
      item.id === claim.itemId ? { ...item, status: 'claimed' as const, claimedBy: claim.claimantId } : item
    );
    setItems(updatedItems);
    saveItems(updatedItems);

    const item = items.find(i => i.id === claim.itemId);
    const approvalNotification: Notification = {
      id: uuidv4(),
      userId: claim.claimantId,
      type: 'claim_approved',
      title: 'Claim Approved',
      message: `Your claim for "${item?.title}" has been approved! Pickup location: ${pickupLocation || 'Main Office'}. ${adminNote || 'Your item is ready for pickup during school hours.'}`,
      itemId: claim.itemId,
      claimId: claim.id,
      read: false,
      createdAt: new Date().toISOString()
    };
    createNotification(approvalNotification);

    setApprovingClaimId(null);
    setPickupLocation('');
    setAdminNote('');
  };

  const handleDenyClaim = (claimId: string) => {
    const claim = claims.find(c => c.id === claimId);
    if (!claim) return;

    const updatedClaims = claims.map(c =>
      c.id === claimId ? { ...c, status: 'denied' as const } : c
    );
    setClaims(updatedClaims);
    saveClaims(updatedClaims);

    const item = items.find(i => i.id === claim.itemId);
    const denialNotification: Notification = {
      id: uuidv4(),
      userId: claim.claimantId,
      type: 'claim_denied',
      title: 'Claim Denied',
      message: `Your claim for "${item?.title}" has been denied. If you believe this is an error, please contact the main office.`,
      itemId: claim.itemId,
      claimId: claim.id,
      read: false,
      createdAt: new Date().toISOString()
    };
    createNotification(denialNotification);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      saveUsers(updatedUsers);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  const pendingClaims = claims.filter(claim => claim.status === 'pending');
  const availableItems = items.filter(item => item.status === 'available');
  const totalUsers = users.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 mb-4">
            <Shield size={32} />
            <h1 className="text-3xl md:text-4xl font-bold">Admin Panel</h1>
          </div>
          <p className="text-blue-100 text-lg">Manage the Bear Tracks lost and found system</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center">
              <Package className="h-10 w-10 text-orange-500 mr-4" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{availableItems.length}</h3>
                <p className="text-gray-600">Available Items</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center">
              <MessageCircle className="h-10 w-10 text-blue-500 mr-4" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{pendingClaims.length}</h3>
                <p className="text-gray-600">Pending Claims</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center">
              <Users className="h-10 w-10 text-green-500 mr-4" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{totalUsers}</h3>
                <p className="text-gray-600">Total Users</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('items')}
                className={`px-6 py-4 font-medium ${
                  activeTab === 'items'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Manage Items ({items.length})
              </button>
              <button
                onClick={() => setActiveTab('claims')}
                className={`px-6 py-4 font-medium ${
                  activeTab === 'claims'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Review Claims ({pendingClaims.length})
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-4 font-medium ${
                  activeTab === 'users'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Users ({totalUsers})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'items' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">All Found Items</h3>
                {items.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No items found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Item</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Location</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item) => (
                          <tr key={item.id} className="border-b border-gray-100">
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-3">
                                {item.photos.length > 0 && (
                                  <img 
                                    src={item.photos[0]} 
                                    alt={item.title}
                                    className="w-12 h-12 object-cover rounded-lg"
                                  />
                                )}
                                <div>
                                  <div className="font-medium text-gray-900">{item.title}</div>
                                  <div className="text-sm text-gray-500">{item.description.substring(0, 50)}...</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-gray-900">{item.category}</td>
                            <td className="py-4 px-4 text-gray-900">{item.location}</td>
                            <td className="py-4 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                item.status === 'available' ? 'bg-green-100 text-green-800' :
                                item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-gray-900">
                              {new Date(item.dateFound).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => window.open(`/item/${item.id}`, '_blank')}
                                  className="text-blue-600 hover:text-blue-500"
                                  title="View details"
                                >
                                  <Eye size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="text-red-600 hover:text-red-500"
                                  title="Delete item"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'claims' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Claim Requests</h3>
                {claims.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No claims submitted yet.</p>
                ) : (
                  <div className="space-y-4">
                    {claims.map((claim) => {
                      const item = items.find(i => i.id === claim.itemId);
                      return (
                        <div key={claim.id} className="border border-gray-200 rounded-lg p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">
                                Claim for: {item?.title || 'Unknown Item'}
                              </h4>
                              <p className="text-sm text-gray-600">
                                By {claim.claimantName} • {new Date(claim.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              claim.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              claim.status === 'approved' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {claim.status}
                            </span>
                          </div>
                          
                          <div className="mb-4">
                            <h5 className="font-medium text-gray-900 mb-2">Claim Message:</h5>
                            <p className="text-gray-700">{claim.message}</p>
                          </div>
                          
                          <div className="mb-4">
                            <h5 className="font-medium text-gray-900 mb-2">Contact Info:</h5>
                            <p className="text-gray-700">{claim.contactInfo}</p>
                          </div>

                          {claim.status === 'approved' && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <h5 className="font-medium text-gray-900 mb-2">Approval Details:</h5>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center text-gray-700">
                                  <MapPin size={14} className="mr-2" />
                                  <span><strong>Pickup Location:</strong> {claim.pickupLocation || 'Not specified'}</span>
                                </div>
                                {claim.adminNote && (
                                  <div className="flex items-start text-gray-700">
                                    <FileText size={14} className="mr-2 mt-1" />
                                    <span><strong>Admin Note:</strong> {claim.adminNote}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {claim.status === 'pending' && (
                            <>
                              {approvingClaimId === claim.id ? (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
                                  <h5 className="font-medium text-gray-900">Approve Claim</h5>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      <MapPin size={14} className="inline mr-1" />
                                      Pickup Location *
                                    </label>
                                    <input
                                      type="text"
                                      value={pickupLocation}
                                      onChange={(e) => setPickupLocation(e.target.value)}
                                      placeholder="e.g., Main Office, Room 101"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      <FileText size={14} className="inline mr-1" />
                                      Admin Note (Optional)
                                    </label>
                                    <textarea
                                      value={adminNote}
                                      onChange={(e) => setAdminNote(e.target.value)}
                                      placeholder="Additional instructions for pickup..."
                                      rows={3}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    />
                                  </div>

                                  <div className="flex space-x-4">
                                    <button
                                      onClick={() => handleApproveClaim(claim.id)}
                                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                                    >
                                      <Check size={16} />
                                      <span>Confirm Approval</span>
                                    </button>
                                    <button
                                      onClick={() => {
                                        setApprovingClaimId(null);
                                        setPickupLocation('');
                                        setAdminNote('');
                                      }}
                                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex space-x-4">
                                  <button
                                    onClick={() => setApprovingClaimId(claim.id)}
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                                  >
                                    <Check size={16} />
                                    <span>Approve</span>
                                  </button>
                                  <button
                                    onClick={() => handleDenyClaim(claim.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                                  >
                                    <X size={16} />
                                    <span>Deny</span>
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Registered Users</h3>
                {users.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No users registered.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Grade Level</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Joined</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b border-gray-100">
                            <td className="py-4 px-4 font-medium text-gray-900">{user.name}</td>
                            <td className="py-4 px-4 text-gray-900">{user.email}</td>
                            <td className="py-4 px-4 text-gray-900">{user.gradeLevel}</td>
                            <td className="py-4 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                user.role === 'staff' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-gray-900">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-4">
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-500"
                                title="Delete user"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;