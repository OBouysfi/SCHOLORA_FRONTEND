'use client';

import { ChevronDown, X, Plus } from 'lucide-react';

interface Language {
  language?: string;
  level?: string;
}

interface AboutStepProps {
  formData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    country?: string;
    subject?: string;
    languages: Language[];
    phone?: string;
    isOver18?: boolean;
  };
  errors?: Record<string, string>; 
  onUpdate: (data: any) => void;
}

const AboutStep = ({ formData, errors = {}, onUpdate }: AboutStepProps) => {
  const countries = [
    'Morocco', 'France', 'Spain', 'Germany', 'Italy', 'UK', 'USA', 'Canada',
    'Australia', 'Japan', 'China', 'India', 'Brazil', 'Mexico', 'Egypt'
  ];

  const subjects = [
    'English', 'French', 'Spanish', 'German', 'Arabic', 'Chinese',
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography'
  ];

  const languageOptions = [
    'English', 'French', 'Spanish', 'German', 'Arabic', 'Chinese',
    'Italian', 'Portuguese', 'Russian', 'Japanese', 'Korean'
  ];

  const levels = ['Native', 'C2', 'C1', 'B2', 'B1', 'A2', 'A1'];

  const addLanguage = () => {
    onUpdate({ languages: [...formData.languages, { language: '', level: '' }] });
  };

  const removeLanguage = (index: number) => {
    const newLanguages = formData.languages.filter((_, i) => i !== index);
    onUpdate({ languages: newLanguages });
  };

  const updateLanguage = (index: number, field: 'language' | 'level', value: string) => {
    const newLanguages = formData.languages.map((lang, i) => {
      if (i === index) return { ...lang, [field]: value };
      return lang;
    });
    onUpdate({ languages: newLanguages });
  };

  const inputClass = "w-full px-4 py-4 border-2 rounded-xl outline-none transition-all text-gray-900 placeholder-gray-400 focus:ring-4";
  const errorClass = "border-red-500 focus:border-red-500 focus:ring-red-200";

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 mb-4">Tell us about yourself</h3>
        <p className="text-gray-600 text-lg">
          Let's start with the basics. This information will help students find and connect with you.
        </p>
      </div>

      {/* First & Last Name */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="group">
          <label className="block text-sm font-semibold mb-3 text-gray-900">First name *</label>
          <input
            type="text"
            value={formData.firstName || ''}
            onChange={(e) => onUpdate({ firstName: e.target.value })}
            className={`${inputClass} border-gray-200 focus:border-blue-500 focus:ring-blue-500/10 ${errors.first_name ? errorClass : ''}`}
            placeholder="Enter your first name"
          />
          {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
        </div>

        <div className="group">
          <label className="block text-sm font-semibold mb-3 text-gray-900">Last name *</label>
          <input
            type="text"
            value={formData.lastName || ''}
            onChange={(e) => onUpdate({ lastName: e.target.value })}
            className={`${inputClass} border-gray-200 focus:border-blue-500 focus:ring-blue-500/10 ${errors.last_name ? errorClass : ''}`}
            placeholder="Enter your last name"
          />
          {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
        </div>
      </div>

      {/* Email */}
      <div className="group">
        <label className="block text-sm font-semibold mb-3 text-gray-900">Email address *</label>
        <input
          type="email"
          value={formData.email || ''}
          onChange={(e) => onUpdate({ email: e.target.value })}
          className={`${inputClass} border-gray-200 focus:border-blue-500 focus:ring-blue-500/10 ${errors.email ? errorClass : ''}`}
          placeholder="your.email@example.com"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      {/* Country & Subject */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="group">
          <label className="block text-sm font-semibold mb-3 text-gray-900">Country *</label>
          <div className="relative">
            <select
              value={formData.country || ''}
              onChange={(e) => onUpdate({ country: e.target.value })}
              className={`${inputClass} border-gray-200 focus:border-blue-500 focus:ring-blue-500/10 appearance-none bg-white ${errors.country ? errorClass : ''}`}
            >
              <option value="">Select your country</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
          {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
        </div>

        <div className="group">
          <label className="block text-sm font-semibold mb-3 text-gray-900">Main subject *</label>
          <div className="relative">
            <select
              value={formData.subject || ''}
              onChange={(e) => onUpdate({ subject: e.target.value })}
              className={`${inputClass} border-gray-200 focus:border-blue-500 focus:ring-blue-500/10 appearance-none bg-white ${errors.subject ? errorClass : ''}`}
            >
              <option value="">Select subject to teach</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
          {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
        </div>
      </div>

      {/* Languages */}
      <div className="group">
        <label className="block text-sm font-semibold mb-3 text-gray-900">Languages you speak *</label>
        <div className="space-y-4">
          {formData.languages.map((lang, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
              <div className="flex-1 relative">
                <select
                  value={lang.language || ''}
                  onChange={(e) => updateLanguage(index, 'language', e.target.value)}
                  className={`${inputClass} border-gray-200 focus:border-blue-500 focus:ring-blue-500/10 appearance-none bg-white ${errors[`languages.${index}.language`] ? errorClass : ''}`}
                >
                  <option value="">Select language</option>
                  {languageOptions.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                {errors[`languages.${index}.language`] && <p className="text-red-500 text-sm mt-1">{errors[`languages.${index}.language`]}</p>}
              </div>
              <div className="w-32 relative">
                <select
                  value={lang.level || ''}
                  onChange={(e) => updateLanguage(index, 'level', e.target.value)}
                  className={`${inputClass} border-gray-200 focus:border-blue-500 focus:ring-blue-500/10 appearance-none bg-white ${errors[`languages.${index}.level`] ? errorClass : ''}`}
                >
                  <option value="">Level</option>
                  {levels.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                {errors[`languages.${index}.level`] && <p className="text-red-500 text-sm mt-1">{errors[`languages.${index}.level`]}</p>}
              </div>
              {formData.languages.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLanguage(index)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addLanguage}
            className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors hover:bg-blue-50 px-4 py-3 rounded-xl border-2 border-dashed border-blue-200 w-full justify-center"
          >
            <Plus className="w-4 h-4 mr-2" /> Add another language
          </button>
        </div>
      </div>

      {/* Phone */}
      <div className="group">
        <label className="block text-sm font-semibold mb-3 text-gray-900">Phone number (optional)</label>
        <input
          type="tel"
          value={formData.phone || ''}
          onChange={(e) => onUpdate({ phone: e.target.value })}
          className={`${inputClass} border-gray-200 focus:border-blue-500 focus:ring-blue-500/10 ${errors.phone ? errorClass : ''}`}
          placeholder="+212 777 777 799"
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
      </div>

      {/* Age Confirmation */}
      <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <input
          type="checkbox"
          id="over18"
          checked={formData.isOver18 || false}
          onChange={(e) => onUpdate({ isOver18: e.target.checked })}
          className="w-5 h-5 text-blue-600 border-2 border-blue-300 rounded focus:ring-blue-500 focus:ring-2 mt-0.5"
        />
        <label htmlFor="over18" className="text-sm font-medium text-blue-900">
          I confirm that I am 18 years or older and agree to the terms of service
        </label>
        {errors.isOver18 && <p className="text-red-500 text-sm mt-1">{errors.isOver18}</p>}
      </div>
    </div>
  );
};

export default AboutStep;
