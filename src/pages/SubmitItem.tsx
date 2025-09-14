import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Calendar, Tag, FileText, Plus, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getItems, saveItems } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';
import { FoundItem } from '../types';

const SubmitItem: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    dateFound: new Date().toISOString().split('T')[0]
  });
  
  const [photos, setPhotos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Electronics', 'Clothing', 'Bags & Backpacks', 'Jewelry', 'Books & Supplies',
    'Sports Equipment', 'Keys', 'Water Bottles', 'Eyewear', 'Other'
  ];

  const locations = [
    'Main Hallway', 'Cafeteria', 'Library', 'Gymnasium', 'Auditorium', 
    'Science Wing', 'Math Wing', 'English Wing', 'Art Room', 'Music Room',
    'Parking Lot', 'Courtyard', 'Restroom', 'Office', 'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setPhotos(prev => [...prev, result]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const items = getItems();
      
      const newItem: FoundItem = {
        id: uuidv4(),
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        dateFound: formData.dateFound,
        photos,
        status: 'available',
        submittedBy: user?.id || '',
        createdAt: new Date().toISOString()
      };

      const updatedItems = [...items, newItem];
      saveItems(updatedItems);
      
      navigate('/browse');
    } catch (err) {
      setError('Failed to submit item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in</h2>
          <p className="text-gray-600">You need to be logged in to submit items.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-6 py-8">
            <h1 className="text-3xl font-bold text-white mb-2">Submit Found Item</h1>
            <p className="text-blue-100">Help a fellow Bear find their lost belonging</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Tag size={16} className="mr-2" />
                Item Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="e.g., Black iPhone 15, Red Nike Backpack"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FileText size={16} className="mr-2" />
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Provide detailed description including color, brand, size, any distinctive features, etc."
              />
            </div>

            {/* Category and Location Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Tag size={16} className="mr-2" />
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="location" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MapPin size={16} className="mr-2" />
                  Location Found *
                </label>
                <select
                  id="location"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select location</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date Found */}
            <div>
              <label htmlFor="dateFound" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="mr-2" />
                Date Found *
              </label>
              <input
                type="date"
                id="dateFound"
                name="dateFound"
                required
                value={formData.dateFound}
                onChange={handleInputChange}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Photo Upload */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Camera size={16} className="mr-2" />
                Photos (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Camera size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">Upload photos to help identify the item</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg cursor-pointer transition-colors inline-flex items-center space-x-2"
                >
                  <Plus size={16} />
                  <span>Add Photos</span>
                </label>
              </div>

              {/* Photo Preview */}
              {photos.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={photo}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 py-2 px-4 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                {isLoading ? 'Submitting...' : 'Submit Found Item'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/browse')}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitItem;