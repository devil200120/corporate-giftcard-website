import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  ExclamationTriangleIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: '',
    priority: 'normal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Message sent successfully! We\'ll get back to you within 24 hours.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: '',
        priority: 'normal'
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: EnvelopeIcon,
      title: 'Email Support',
      content: 'support@giftgalore.com',
      description: 'Send us an email anytime',
      action: 'mailto:support@giftgalore.com'
    },
    {
      icon: PhoneIcon,
      title: 'Phone Support',
      content: '+1 (555) 123-4567',
      description: 'Mon-Fri 9AM-6PM EST',
      action: 'tel:+15551234567'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Live Chat',
      content: 'Chat with us',
      description: '24/7 instant support',
      action: '#'
    },
    {
      icon: MapPinIcon,
      title: 'Visit Us',
      content: '123 Gift Street, Present City, PC 12345',
      description: 'Our headquarters',
      action: 'https://maps.google.com'
    }
  ];

  const faqCategories = [
    {
      icon: QuestionMarkCircleIcon,
      title: 'General Questions',
      description: 'Common questions about our service'
    },
    {
      icon: ExclamationTriangleIcon,
      title: 'Order Issues',
      description: 'Problems with your order'
    },
    {
      icon: HeartIcon,
      title: 'Product Support',
      description: 'Questions about specific products'
    }
  ];

  const officeHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM EST' },
    { day: 'Saturday', hours: '10:00 AM - 4:00 PM EST' },
    { day: 'Sunday', hours: 'Closed' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Have a question, need help, or want to share feedback? 
            We'd love to hear from you. Get in touch with our friendly support team.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactMethods.map((method, index) => (
            <a
              key={index}
              href={method.action}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="bg-primary-100 dark:bg-primary-900/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 dark:group-hover:bg-primary-800/30 transition-colors">
                <method.icon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {method.title}
              </h3>
              <p className="text-primary-600 font-medium mb-1">
                {method.content}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {method.description}
              </p>
            </a>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Send us a Message
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="order">Order Support</option>
                    <option value="product">Product Question</option>
                    <option value="technical">Technical Issue</option>
                    <option value="billing">Billing Question</option>
                    <option value="partnership">Partnership</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="How can we help you?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Please provide as much detail as possible..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
              >
                {isSubmitting ? 'Sending Message...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Additional Info */}
          <div className="space-y-8">
            {/* Office Hours */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <ClockIcon className="w-6 h-6 text-primary-600" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Office Hours
                </h3>
              </div>
              <div className="space-y-3">
                {officeHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">{schedule.day}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{schedule.hours}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Note:</strong> For urgent issues outside business hours, 
                  please use our live chat or email support for fastest response.
                </p>
              </div>
            </div>

            {/* FAQ Categories */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Quick Help
              </h3>
              <div className="space-y-4">
                {faqCategories.map((category, index) => (
                  <a
                    key={index}
                    href="/faq"
                    className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors group"
                  >
                    <div className="bg-gray-100 dark:bg-gray-700 w-10 h-10 rounded-lg flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-primary-900/20 transition-colors">
                      <category.icon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        {category.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {category.description}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-8 text-white">
              <h3 className="text-xl font-semibold mb-4">Response Times</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Live Chat</span>
                  <span className="font-medium">Immediate</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Email Support</span>
                  <span className="font-medium">Within 4 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Phone Support</span>
                  <span className="font-medium">Immediate</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-primary-500">
                <p className="text-sm opacity-90">
                  We're committed to providing fast, helpful support. 
                  Most issues are resolved on first contact.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Visit Our Office
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPinIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Interactive Map</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Click to view on Google Maps
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Gift Galore Headquarters
              </h4>
              <div className="space-y-3 text-gray-600 dark:text-gray-400">
                <div className="flex items-start gap-3">
                  <MapPinIcon className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                  <p>123 Gift Street<br />Present City, PC 12345<br />United States</p>
                </div>
                <div className="flex items-center gap-3">
                  <PhoneIcon className="w-5 h-5 text-primary-600 flex-shrink-0" />
                  <p>+1 (555) 123-4567</p>
                </div>
                <div className="flex items-center gap-3">
                  <EnvelopeIcon className="w-5 h-5 text-primary-600 flex-shrink-0" />
                  <p>support@giftgalore.com</p>
                </div>
              </div>
              <div className="mt-6">
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <MapPinIcon className="w-5 h-5" />
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
