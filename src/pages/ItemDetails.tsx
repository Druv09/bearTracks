import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Tag, User, ArrowLeft, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getItems, getUsers, getClaims, saveClaims, createNotification } from '../utils/storage';
import { FoundItem, ClaimRequest, Notification } from '../types';
import { v4 as uuidv4 } from 'uuid';

const ItemDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [item, setItem] = useState<FoundItem | null>(null);
  const [submitter, setSubmitter] = useState<string>('');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimMessage, setClaimMessage] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const items = getItems();
    const foundItem = items.find(item => item.id === id);
    
    if (foundItem) {
      setItem(foundItem);
      
      const users = getUsers();
      const itemSubmitter = users.find(u => u.id === foundItem.submittedBy);
      setSubmitter(itemSubmitter?.name || 'Unknown');
    }
  }, [id]);

  const nextPhoto = () => {
    if (item && item.photos.length > 1) {
      setCurrentPhotoIndex((prev) => (prev + 1) % item.photos.length);
    }
  };

  const prevPhoto = () => {
    if (item && item.photos.length > 1) {
      setCurrentPhotoIndex((prev) => (prev - 1 + item.photos.length) % item.photos.length);
    }
  };

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !item) return;

    setIsSubmitting(true);

    try {
      const claims = getClaims();
      
      // Check if user already has a pending claim for this item
      const existingClaim = claims.find(claim => 
        claim.itemId === item.id && 
        claim.claimantId === user.id && 
        claim.status === 'pending'
      );

      if (existingClaim) {
        alert('You already have a pending claim for this item.');
        setIsSubmitting(false);
        return;
      }

      const newClaim: ClaimRequest = {
        id: uuidv4(),
        itemId: item.id,
        claimantId: user.id,
        claimantName: user.name,
        message: claimMessage,
        contactInfo: contactInfo,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      const updatedClaims = [...claims, newClaim];
      saveClaims(updatedClaims);

      const itemSubmitterNotification: Notification = {
        id: uuidv4(),
        userId: item.submittedBy,
        type: 'item_claimed',
        title: 'New Claim Submitted',
        message: `${user.name} has submitted a claim for "${item.title}". Check the admin panel to review.`,
        itemId: item.id,
        claimId: newClaim.id,
        read: false,
        createdAt: new Date().toISOString()
      };
      createNotification(itemSubmitterNotification);

      const claimantNotification: Notification = {
        id: uuidv4(),
        userId: user.id,
        type: 'claim_submitted',
        title: 'Claim Submitted',
        message: `Your claim for "${item.title}" has been submitted successfully. You will be notified when an admin reviews it.`,
        itemId: item.id,
        claimId: newClaim.id,
        read: false,
        createdAt: new Date().toISOString()
      };
      createNotification(claimantNotification);

      alert('Claim request submitted successfully! You will be contacted if your claim is approved.');
      setShowClaimForm(false);
      setClaimMessage('');
      setContactInfo('');
    } catch (error) {
      alert('Failed to submit claim. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Item not found</h2>
          <Link to="/browse" className="text-blue-600 hover:text-blue-500">
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link 
          to="/browse"
          className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-6 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Browse
        </Link>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Photo Section */}
            <div className="relative">
              {item.photos.length > 0 ? (
                <>
                  <div className="h-96 lg:h-full">
                    <img 
                      src={item.photos[currentPhotoIndex]} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {item.photos.length > 1 && (
                    <>
                      <button
                        onClick={prevPhoto}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-colors"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={nextPhoto}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-colors"
                      >
                        <ChevronRight size={20} />
                      </button>
                      
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                        {currentPhotoIndex + 1} / {item.photos.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="h-96 lg:h-full bg-gray-200 flex items-center justify-center">
                  <Tag size={64} className="text-gray-400" />
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="p-6 lg:p-8">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    item.status === 'available' ? 'bg-green-100 text-green-800' :
                    item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.status === 'available' ? 'Available' :
                     item.status === 'pending' ? 'Pending Claim' :
                     'Claimed'}
                  </span>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Tag size={18} className="mr-3" />
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin size={18} className="mr-3" />
                    <span>Found at {item.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar size={18} className="mr-3" />
                    <span>Found on {new Date(item.dateFound).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <User size={18} className="mr-3" />
                    <span>Submitted by {submitter}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{item.description}</p>
              </div>

              {/* Claim Section */}
              {user && item.status === 'available' && (
                <div className="border-t pt-6">
                  {!showClaimForm ? (
                    <button
                      onClick={() => setShowClaimForm(true)}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                    >
                      <MessageCircle size={20} />
                      <span>Claim This Item</span>
                    </button>
                  ) : (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Claim Request</h3>
                      <form onSubmit={handleClaimSubmit} className="space-y-4">
                        <div>
                          <label htmlFor="claimMessage" className="block text-sm font-medium text-gray-700 mb-2">
                            Why do you believe this item is yours? *
                          </label>
                          <textarea
                            id="claimMessage"
                            value={claimMessage}
                            onChange={(e) => setClaimMessage(e.target.value)}
                            required
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="Describe identifying features, when/where you lost it, etc."
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700 mb-2">
                            Best way to contact you *
                          </label>
                          <input
                            type="text"
                            id="contactInfo"
                            value={contactInfo}
                            onChange={(e) => setContactInfo(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="Phone number, email, or preferred contact method"
                          />
                        </div>

                        <div className="flex space-x-4">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
                          >
                            {isSubmitting ? 'Submitting...' : 'Submit Claim'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowClaimForm(false)}
                            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {!user && item.status === 'available' && (
                <div className="border-t pt-6">
                  <Link
                    to="/login"
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Login to Claim Item</span>
                  </Link>
                </div>
              )}

              {item.status !== 'available' && (
                <div className="border-t pt-6">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-gray-600">
                      {item.status === 'claimed' ? 'This item has been claimed.' : 'This item has a pending claim.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;