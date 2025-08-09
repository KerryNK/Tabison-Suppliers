import React, { useState } from "react";
import { ArrowRight, Package, Mail, Phone, Building, User } from "lucide-react";

const RequestQuotePage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    productType: "",
    quantity: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-brand-gray-bg flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center bg-brand-white rounded-2xl p-8 shadow-sm">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-brand-black mb-4">
            Quote Request Sent!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for your interest. Our team will review your request and get back to you within 24 hours.
          </p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                name: "",
                email: "",
                phone: "",
                company: "",
                productType: "",
                quantity: "",
                message: "",
              });
            }}
            className="bg-brand-teal text-brand-white px-6 py-3 rounded-lg font-medium hover:bg-brand-teal-dark transition-colors"
          >
            Send Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-gray-bg py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-brand-black mb-4">
            Request a Quote
          </h1>
          <p className="text-lg text-gray-600 max-w-lg mx-auto">
            Tell us about your bulk order requirements and we'll provide you with a customized quote within 24 hours.
          </p>
        </div>

        <div className="bg-brand-white rounded-2xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-brand-black mb-2"
                >
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-11 pr-4 py-3 border border-brand-gray-light rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-colors"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-brand-black mb-2"
                >
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-11 pr-4 py-3 border border-brand-gray-light rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-brand-black mb-2"
                >
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-11 pr-4 py-3 border border-brand-gray-light rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-colors"
                    placeholder="+254 7XX XXX XXX"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-brand-black mb-2"
                >
                  Company/Organization
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 border border-brand-gray-light rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-colors"
                    placeholder="Your company name"
                  />
                </div>
              </div>
            </div>

            {/* Product Requirements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="productType"
                  className="block text-sm font-medium text-brand-black mb-2"
                >
                  Product Type *
                </label>
                <select
                  id="productType"
                  name="productType"
                  value={formData.productType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-brand-gray-light rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-colors"
                >
                  <option value="">Select product type</option>
                  <option value="military-boots">Military Boots</option>
                  <option value="safety-boots">Safety Boots</option>
                  <option value="official-shoes">Official Shoes</option>
                  <option value="police-boots">Police Boots</option>
                  <option value="security-boots">Security Boots</option>
                  <option value="custom">Custom Requirements</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-brand-black mb-2"
                >
                  Quantity Required *
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 border border-brand-gray-light rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-colors"
                  placeholder="Number of pairs"
                />
              </div>
            </div>

            {/* Additional Details */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-brand-black mb-2"
              >
                Additional Requirements
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-brand-gray-light rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-colors resize-none"
                placeholder="Tell us about specific requirements, sizes, delivery timeline, or any other details..."
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-teal text-brand-white py-4 rounded-lg font-semibold hover:bg-brand-teal-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-brand-white border-t-transparent rounded-full animate-spin" />
                    Sending Request...
                  </>
                ) : (
                  <>
                    Send Quote Request
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Contact Info */}
          <div className="mt-8 pt-8 border-t border-brand-gray-light">
            <p className="text-sm text-gray-600 text-center">
              Need immediate assistance?{" "}
              <a
                href="tel:+254700000000"
                className="text-brand-teal hover:text-brand-teal-dark font-medium"
              >
                Call us at +254 700 000 000
              </a>{" "}
              or{" "}
              <a
                href="mailto:sales@tabisonsuppliers.com"
                className="text-brand-teal hover:text-brand-teal-dark font-medium"
              >
                email us directly
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestQuotePage;