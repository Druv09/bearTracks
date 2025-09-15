import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">🐻</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">Bear Tracks</h3>
                <p className="text-sm text-gray-400">Lost & Found System</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Helping the Bridgeland High School community reunite with their lost belongings.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>Bridgeland High School</p>
              <p>Main Office</p>
              <p>Email: office@bridgelandhs.edu</p>
              <p>Phone: (XXX) XXX-XXXX</p>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Tips</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>• Check the lost & found regularly</p>
              <p>• Provide detailed descriptions</p>
              <p>• Include photos when submitting items</p>
              <p>• Contact administration for help</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 Bridgeland High School Bear Tracks. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
