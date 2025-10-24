import React from 'react';
import { Link } from 'react-router-dom';
import {
  ExclamationTriangleIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

const NotFoundPage = () => {
  const suggestions = [
    {
      icon: HomeIcon,
      title: 'Go Home',
      description: 'Return to our homepage',
      link: '/',
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
    },
    {
      icon: MagnifyingGlassIcon,
      title: 'Search Products',
      description: 'Find the perfect gift',
      link: '/products',
      color: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
    },
    {
      icon: QuestionMarkCircleIcon,
      title: 'Get Help',
      description: 'Contact our support team',
      link: '/contact',
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
    }
  ];

  const popularPages = [
    { name: 'Featured Products', path: '/featured' },
    { name: 'Gift Categories', path: '/categories' },
    { name: 'Birthday Gifts', path: '/category/birthday' },
    { name: 'Wedding Gifts', path: '/category/wedding' },
    { name: 'Personalized Gifts', path: '/category/personalized' },
    { name: 'About Us', path: '/about' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative">
            {/* Large 404 Text */}
            <h1 className="text-[12rem] md:text-[16rem] font-bold text-gray-200 dark:text-gray-800 leading-none select-none">
              404
            </h1>
            
            {/* Gift Box Icon Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-primary-100 dark:bg-primary-900/20 p-6 rounded-full">
                <ExclamationTriangleIcon className="w-16 h-16 text-primary-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Oops! Gift Not Found
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
            It looks like the page you're looking for has been moved, deleted, or doesn't exist. 
            But don't worry, we have plenty of amazing gifts waiting for you!
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Error Code: 404 | Page Not Found
          </p>
        </div>

        {/* Action Suggestions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {suggestions.map((suggestion, index) => (
            <Link
              key={index}
              to={suggestion.link}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className={`w-12 h-12 rounded-lg ${suggestion.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                <suggestion.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {suggestion.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {suggestion.description}
              </p>
            </Link>
          ))}
        </div>

        {/* Popular Pages */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Popular Pages
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {popularPages.map((page, index) => (
              <Link
                key={index}
                to={page.path}
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 hover:underline transition-colors"
              >
                {page.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Search Box */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Or search for what you're looking for
          </h3>
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for gifts..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    window.location.href = `/search?q=${encodeURIComponent(e.target.value)}`;
                  }
                }}
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Go Back
          </button>
          
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <HomeIcon className="w-5 h-5" />
            Back to Home
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">
            Still having trouble finding what you need?
          </p>
          <Link
            to="/contact"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
          >
            Contact our support team →
          </Link>
        </div>

        {/* Easter Egg */}
        <div className="mt-8">
          <details className="text-sm text-gray-500 dark:text-gray-500">
            <summary className="cursor-pointer hover:text-primary-600 transition-colors">
              🎁 Fun fact about 404 errors...
            </summary>
            <p className="mt-2 text-xs">
              The 404 error code was named after room 404 at CERN, where the original web servers were located. 
              Now you know! 🤓
            </p>
          </details>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
