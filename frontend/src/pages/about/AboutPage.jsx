import React from 'react';
import {
  HeartIcon,
  GiftIcon,
  TruckIcon,
  ShieldCheckIcon,
  StarIcon,
  UserGroupIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const AboutPage = () => {
  const features = [
    {
      icon: GiftIcon,
      title: 'Unique Gifts',
      description: 'Carefully curated collection of unique and personalized gifts for every occasion.'
    },
    {
      icon: HeartIcon,
      title: 'Made with Love',
      description: 'Every product is selected with care to bring joy and create memorable moments.'
    },
    {
      icon: TruckIcon,
      title: 'Fast Delivery',
      description: 'Quick and reliable shipping to get your gifts delivered on time, every time.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Quality Guarantee',
      description: 'We stand behind every product with our 100% satisfaction guarantee.'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      image: '/api/placeholder/150/150',
      bio: 'Passionate about creating meaningful connections through thoughtful gifts.'
    },
    {
      name: 'Michael Chen',
      role: 'Head of Product',
      image: '/api/placeholder/150/150',
      bio: 'Expert curator with an eye for unique and innovative gift ideas.'
    },
    {
      name: 'Emma Davis',
      role: 'Customer Experience',
      image: '/api/placeholder/150/150',
      bio: 'Dedicated to ensuring every customer has an amazing shopping experience.'
    },
    {
      name: 'David Rodriguez',
      role: 'Operations Manager',
      image: '/api/placeholder/150/150',
      bio: 'Ensures fast, reliable delivery and smooth operations worldwide.'
    }
  ];

  const stats = [
    { number: '500K+', label: 'Happy Customers' },
    { number: '1M+', label: 'Gifts Delivered' },
    { number: '50+', label: 'Countries Served' },
    { number: '99%', label: 'Customer Satisfaction' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About Gift Galore
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            We believe every moment deserves the perfect gift. Our mission is to help you
            celebrate life's special occasions with thoughtfully curated presents.
          </p>
          <div className="flex justify-center">
            <GiftIcon className="w-16 h-16" />
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Founded in 2020, Gift Galore started as a small passion project to help people
                find the perfect gifts for their loved ones. What began as a simple idea has
                grown into a trusted platform serving customers worldwide.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                We understand that finding the right gift can be challenging. That's why we've
                built a platform that combines cutting-edge technology with human expertise
                to provide personalized recommendations and unique products.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Today, we're proud to be the go-to destination for thoughtful gifts,
                serving over 500,000 happy customers across 50+ countries.
              </p>
            </div>
            <div className="relative">
              <img
                src="/api/placeholder/600/400"
                alt="Our story"
                className="rounded-lg shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Why Choose Gift Galore?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary-100 dark:bg-primary-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission & Values */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm">
              <div className="bg-primary-100 dark:bg-primary-900/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <HeartIcon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Our Mission
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                To make gift-giving effortless and meaningful by connecting people through
                thoughtfully curated products and personalized experiences.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm">
              <div className="bg-primary-100 dark:bg-primary-900/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <StarIcon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Our Vision
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                To become the world's most trusted platform for gift discovery,
                celebrating every special moment with the perfect present.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm">
              <div className="bg-primary-100 dark:bg-primary-900/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <UserGroupIcon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Our Values
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Quality, authenticity, and customer satisfaction guide everything we do.
                We believe in building lasting relationships through exceptional service.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-primary-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Find the Perfect Gift?
          </h2>
          <p className="text-xl mb-8">
            Join millions of satisfied customers who trust Gift Galore for their special moments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Shopping
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
