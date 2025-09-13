'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

import AboutStep from '@/components/tutor-registration/steps/AboutStep';
import PhotoStep from '@/components/tutor-registration/steps/PhotoStep';
import CertificationStep from '@/components/tutor-registration/steps/CertificationStep';
import EducationStep from '@/components/tutor-registration/steps/EducationStep';
import DescriptionStep from '@/components/tutor-registration/steps/DescriptionStep';
import VideoStep from '@/components/tutor-registration/steps/VideoStep';
import AvailabilityStep from '@/components/tutor-registration/steps/AvailabilityStep';
import PricingStep from '@/components/tutor-registration/steps/PricingStep';

import { createTutorAbout, uploadTutorPhoto, storeTutorCertifications } from '@/lib/tutors/api';

export default function TutorRegistrationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    subject: '',
    languages: [{ language: '', level: '' }],
    phone: '',
    isOver18: false,
    photo: null as File | string | null,
    certifications: [] as any[],
    hasNoCertificate: false,
    education: [] as any[],
    description: '',
    teachingStyle: '',
    introVideo: null,
    availability: {},
    timezone: '',
    hourlyRate: '',
    currency: 'USD',
  });

  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});

  const steps = [
    { id: 1, name: 'About' },
    { id: 2, name: 'Photo' },
    { id: 3, name: 'Certification' },
    { id: 4, name: 'Education' },
    { id: 5, name: 'Description' },
    { id: 6, name: 'Video' },
    { id: 7, name: 'Availability' },
    { id: 8, name: 'Pricing' },
  ];

  useEffect(() => {
    const draft = localStorage.getItem('tutorRegistrationDraft');
    if (draft) {
      const savedData = JSON.parse(draft);
      setFormData(prev => ({ ...prev, ...savedData }));
    }
  }, []);

  const updateFormData = (data: any, saveDraft: boolean = true) => {
    setFormData(prev => {
      const newData = { ...prev, ...data };
      if (saveDraft) localStorage.setItem('tutorRegistrationDraft', JSON.stringify(newData));
      return newData;
    });
  };

  const validateAboutStep = (data: any) => {
    const errors: Record<string, string> = {};
    if (!data.firstName) errors.firstName = 'First name is required';
    if (!data.lastName) errors.lastName = 'Last name is required';

    if (!data.email) errors.email = 'Email address is required';
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) errors.email = 'Email address is invalid';
      const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com'];
      const domain = data.email.split('@')[1];
      if (!allowedDomains.includes(domain)) errors.email = 'Email must be from one of: ' + allowedDomains.join(', ');
    }

    if (!data.country) errors.country = 'Country is required';
    if (!data.subject) errors.subject = 'Subject is required';
    if (!data.phone) errors.phone = 'Phone number is required';
    else if (data.phone.length > 20) errors.phone = 'Phone number cannot exceed 20 characters';

    if (!data.isOver18) errors.isOver18 = 'You must confirm that you are over 18';

    if (!data.languages || data.languages.length === 0) errors.languages = 'At least one language is required';
    else {
      const allowedLevels = ['A1','A2','B1','B2','C1','C2','Native'];
      data.languages.forEach((lang: any, idx: number) => {
        if (!lang.language) errors[`languages.${idx}.language`] = `Language name is required for row ${idx + 1}`;
        if (!lang.level) errors[`languages.${idx}.level`] = `Language level is required for row ${idx + 1}`;
        if (lang.level && !allowedLevels.includes(lang.level)) errors[`languages.${idx}.level`] = `Level must be one of: ${allowedLevels.join(', ')} (row ${idx + 1})`;
      });
    }

    return errors;
  };

  const nextStep = async () => {
    let errors: Record<string, string> = {};

    if (currentStep === 1) errors = validateAboutStep(formData);
    else if (currentStep === 2) {
      if (!(formData.photo instanceof File)) errors.photo = 'Please upload a valid file';
      else {
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (!allowedTypes.includes(formData.photo.type)) errors.photo = 'Only JPEG or PNG images are allowed';
        const maxSizeMB = 5;
        if (formData.photo.size / 1024 / 1024 > maxSizeMB) errors.photo = `Image must be smaller than ${maxSizeMB}MB`;
      }
    }
    if (currentStep === 3) {
      if (!formData.hasNoCertificate) {
        if (!formData.certifications || formData.certifications.length === 0) {
          errors.certifications = 'At least one certificate is required';
        } else {
          formData.certifications.forEach((cert, idx) => {
            if (!cert.subject) errors[`certifications.${idx}.subject`] = `Subject is required for certificate ${idx + 1}`;
            if (!cert.certification) errors[`certifications.${idx}.certification`] = `Certification is required for certificate ${idx + 1}`;
            if (!cert.yearsFrom) errors[`certifications.${idx}.yearsFrom`] = `Start year is required for certificate ${idx + 1}`;
            if (!cert.yearsTo) errors[`certifications.${idx}.yearsTo`] = `End year is required for certificate ${idx + 1}`;

            // File validation
            if (!cert.file) {
              errors[`certifications.${idx}.file`] = 'Please upload a certificate file';
            } else {
              const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
              if (!allowedTypes.includes(cert.file.type)) {
                errors[`certifications.${idx}.file`] = 'Only JPEG, PNG or PDF files are allowed';
              }
              
              if (cert.file.data) {
                const sizeInBytes = (cert.file.data.length * 3) / 4; 
                const maxSizeMB = 5;
                if (sizeInBytes / 1024 / 1024 > maxSizeMB) {
                  errors[`certifications.${idx}.file`] = `File must be smaller than ${maxSizeMB}MB`;
                }
              }
            }
          });
        }
      }
    }
    if (Object.keys(errors).length > 0) {
      setStepErrors(errors);
      return;
    } else setStepErrors({});

    localStorage.setItem('tutorRegistrationDraft', JSON.stringify(formData));
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSaveDraft = () => {
    localStorage.setItem('tutorRegistrationDraft', JSON.stringify(formData));
    console.log('Draft manually saved:', formData);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('User not authenticated');

      await createTutorAbout(formData, token);
      if (formData.photo instanceof File) await uploadTutorPhoto(formData.photo, token);
      if (formData.certifications.length > 0) await storeTutorCertifications(formData.certifications, token);

      alert('Profile submitted successfully!');
      localStorage.removeItem('tutorRegistrationDraft');
    } catch (error: any) {
      console.error(error);
      if (typeof error === 'object') {
        const firstKey = Object.keys(error)[0];
        alert(error[firstKey]);
      } else {
        alert(error.message || 'Failed to submit profile');
      }
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return <AboutStep formData={formData} errors={stepErrors} onUpdate={updateFormData} />;
      case 2: return <PhotoStep formData={formData} errors={stepErrors} onUpdate={updateFormData} />;
      case 3: return <CertificationStep formData={formData} errors={stepErrors} onUpdate={updateFormData} />;
      case 4: return <EducationStep formData={formData} onUpdate={updateFormData} />;
      case 5: return <DescriptionStep formData={formData} onUpdate={updateFormData} />;
      case 6: return <VideoStep formData={formData} onUpdate={updateFormData} />;
      case 7: return <AvailabilityStep formData={formData} onUpdate={updateFormData} />;
      case 8: return <PricingStep formData={formData} onUpdate={updateFormData} />;
      default: return <AboutStep formData={formData} errors={stepErrors} onUpdate={updateFormData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Create your tutor profile</h2>
            <div className="text-sm text-gray-500">{Math.round((currentStep / steps.length) * 100)}% complete</div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
                    step.id < currentStep 
                      ? 'bg-green-500 text-white' 
                      : step.id === currentStep 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                  }`}>
                    {step.id < currentStep ? <Check className="w-6 h-6" /> : step.id}
                  </div>
                  <span className={`text-xs mt-2 font-medium transition-colors ${
                    step.id === currentStep ? 'text-blue-600' : 'text-gray-400'
                  }`}>{step.name}</span>
                </div>
                {index < steps.length - 1 && <ArrowRight className="w-5 h-5 text-gray-300 mx-4 mt-[-20px]" />}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 lg:p-12">
            {renderCurrentStep()}

            <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-200">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  currentStep === 1 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex space-x-3">
                <button 
                  onClick={handleSaveDraft}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  Save Draft
                </button>

                {currentStep === steps.length ? (
                  <button
                    onClick={handleSubmit}
                    className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all"
                  >
                    <span>Submit Application</span>
                  </button>
                ) : (
                  <button
                    onClick={nextStep}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-2">Need help with your registration?</p>
          <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">Contact our support team</a>
        </div>
      </div>
      <Footer />
    </div>
  );
}
