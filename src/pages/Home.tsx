import React from 'react';
import { Search, Plus, Users, MapPin, Clock, ArrowRight } from 'lucide-react';

// Mock data for preview
const mockItems = [
  {
    id: '1',
    title: 'Blue Backpack',
    description: 'Navy blue Jansport backpack with water bottle pocket',
    dateFound: '2024-10-28',
    category: 'Bags',
    location: 'Gym',
    photos: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'],
    status: 'available'
  },
  {
    id: '2',
    title: 'iPhone 13',
    description: 'Black iPhone with cracked screen protector',
    dateFound: '2024-10-27',
    category: 'Electronics',
    location: 'Cafeteria',
    photos: ['https://images.unsplash.com/photo-1592286927505-b0e4ca7d6d4e?w=400'],
    status: 'available'
  },
  {
    id: '3',
    title: 'Calculator',
    description: 'TI-84 Plus graphing calculator',
    dateFound: '2024-10-26',
    category: 'School Supplies',
    location: 'Math Wing',
    photos: ['https://images.unsplash.com/photo-1611226298229-d06d84d6f3e7?w=400'],
    status: 'available'
  }
];

const Home = () => {
  const availableCount = 24;
  const pendingClaims = 7;
  const returnedCount = 156;

  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent"></div>
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-2xl">
              🐻
            </div>
            <span className="text-orange-500 font-semibold text-lg">Bear Tracks</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 max-w-2xl leading-tight">
            Lost something? We've probably found it.
          </h1>
          
          <p className="text-lg text-slate-300 mb-8 max-w-xl">
            Bridgeland High's lost and found database. Browse items, file claims, and help reunite students with their stuff.
          </p>
          
          <div className="flex flex-wrap gap-3">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition flex items-center gap-2">
              <Search size={18} />
              Search Items
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition backdrop-blur-sm flex items-center gap-2">
              <Plus size={18} />
              Report Found Item
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{availableCount}</div>
              <div className="text-sm text-slate-600">Available to Claim</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{pendingClaims}</div>
              <div className="text-sm text-slate-600">Pending Claims</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{returnedCount}</div>
              <div className="text-sm text-slate-600">Successfully Returned</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Items */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Recently Found</h2>
            <p className="text-slate-600">Latest items turned in to the office</p>
          </div>
          <button className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1">
            View all
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {mockItems.map((item) => (
            <div key={item.id} className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition group cursor-pointer">
              <div className="aspect-video bg-slate-100 overflow-hidden">
                <img 
                  src={item.photos[0]} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-600 mb-3 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <MapPin size={12} />
                    {item.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(item.dateFound).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">How it works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Plus size={20} className="text-orange-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Find something? Turn it in</h3>
              <p className="text-sm text-slate-600">
                Take a quick photo and submit details. It takes less than a minute and helps a fellow Bear out.
              </p>
            </div>

            <div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Search size={20} className="text-orange-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Lost something? Search here</h3>
              <p className="text-sm text-slate-600">
                Browse by category, date, or location. Filter results to find exactly what you're looking for.
              </p>
            </div>

            <div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Users size={20} className="text-orange-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Claim and pick up</h3>
              <p className="text-sm text-slate-600">
                Submit a claim request online, then swing by the main office during school hours to grab your stuff.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-slate-900 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Need help finding something?
          </h2>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Stop by the main office during school hours or send us an email. We're here to help reunite you with your belongings.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition">
              Contact Office
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition backdrop-blur-sm">
              View FAQ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
