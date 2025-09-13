// components/tutor-registration/steps/CertificationStep.tsx
'use client';

import { useEffect } from 'react';
import { ChevronDown, Trash2 } from 'lucide-react';

interface FileData {
  name: string;
  type: string;
  data: string | ArrayBuffer | null;
}

interface CertificationStepProps {
  formData: {
    certifications?: Array<{
      subject: string;
      certification: string;
      yearsFrom: string;
      yearsTo: string;
      file?: FileData | null;
      notOnList?: boolean;
    }>;
    hasNoCertificate?: boolean;
  };
  onUpdate: (data: any) => void;
  errors?: any;
}

const STORAGE_KEY = 'tutor_certifications';

const CertificationStep = ({ formData, onUpdate, errors }: CertificationStepProps) => {
  const subjects = [
    'English', 'French', 'Spanish', 'German', 'Arabic', 'Chinese',
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography'
  ];

  const certifications = [
    'Select verified certificate',
    'TEFL/TESOL Certificate',
    'CELTA Certificate',
    'DELTA Certificate',
    "Bachelor's Degree in Education",
    "Master's Degree in Education",
    'Teaching License',
    'Other Professional Certificate'
  ];

  const years = Array.from({ length: 50 }, (_, i) => (new Date().getFullYear() - i).toString());

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        onUpdate(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored certifications', e);
      }
    }
  }, []);

  // Save to localStorage on formData change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const addCertificate = () => {
    const currentCertifications = formData.certifications || [];
    onUpdate({
      certifications: [
        ...currentCertifications,
        { subject: '', certification: '', yearsFrom: '', yearsTo: '', file: null, notOnList: false }
      ]
    });
  };

  const removeCertificate = (index: number) => {
    const currentCertifications = formData.certifications || [];
    onUpdate({ certifications: currentCertifications.filter((_, i) => i !== index) });
  };

  const updateCertificate = (index: number, field: string, value: any) => {
    const currentCertifications = formData.certifications || [];
    const newCertifications = [...currentCertifications];
    newCertifications[index] = { ...newCertifications[index], [field]: value };
    onUpdate({ certifications: newCertifications });
  };

  const handleFileUpload = (index: number, file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only JPEG, PNG or PDF files are allowed');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateCertificate(index, 'file', {
        name: file.name,
        type: file.type,
        data: reader.result
      });
    };
    reader.readAsDataURL(file);
  };

  const handleNoCertificateChange = (checked: boolean) => {
    onUpdate({ hasNoCertificate: checked, certifications: checked ? [] : (formData.certifications || []) });
  };

  if (!formData.certifications?.length && !formData.hasNoCertificate) addCertificate();

  const getInputClass = (fieldError?: string) =>
    `w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/10 appearance-none bg-white text-gray-900 ${fieldError ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'}`;

  const getUploadClass = (fieldError?: string) =>
    `block w-full border-2 rounded-lg py-3 text-center font-medium cursor-pointer transition-colors ${fieldError ? 'border-red-500 text-red-600 bg-red-50 hover:bg-red-100' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'}`;

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 mb-4">Teaching certification</h3>
        <p className="text-gray-600 text-lg">
          Do you have teaching certificates? If so, describe them to enhance your profile credibility and get more students.
        </p>
      </div>

      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="noCertificate"
          checked={formData.hasNoCertificate || false}
          onChange={(e) => handleNoCertificateChange(e.target.checked)}
          className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
        />
        <label htmlFor="noCertificate" className="text-sm font-medium text-gray-900">
          I don't have a teaching certificate
        </label>
      </div>

      {!formData.hasNoCertificate && (
        <div className="space-y-6">
          {(formData.certifications || []).map((cert, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-6 space-y-6 relative">

              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Subject • <span className="text-gray-500 font-normal">Optional</span>
                </label>
                <div className="relative">
                  <select
                    value={cert.subject}
                    onChange={(e) => updateCertificate(index, 'subject', e.target.value)}
                    className={getInputClass(errors?.[`certifications.${index}.subject`])}
                  >
                    <option value="">Select</option>
                    {subjects.map((subject) => <option key={subject} value={subject}>{subject}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {errors?.[`certifications.${index}.subject`] && (
                  <p className="text-red-500 text-xs mt-1">{errors[`certifications.${index}.subject`]}</p>
                )}
                {formData.certifications && formData.certifications.length > 1 && (
                  <button
                    onClick={() => removeCertificate(index)}
                    className="absolute top-3 right-3 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Certification */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Certification • <span className="text-gray-500 font-normal">Optional</span></label>
                <div className="relative">
                  <select
                    value={cert.certification}
                    onChange={(e) => updateCertificate(index, 'certification', e.target.value)}
                    className={getInputClass(errors?.[`certifications.${index}.certification`])}
                  >
                    {certifications.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {errors?.[`certifications.${index}.certification`] && (
                  <p className="text-red-500 text-xs mt-1">{errors[`certifications.${index}.certification`]}</p>
                )}
              </div>

              {/* Years */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Years of study</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <select
                      value={cert.yearsFrom}
                      onChange={(e) => updateCertificate(index, 'yearsFrom', e.target.value)}
                      className={getInputClass(errors?.[`certifications.${index}.yearsFrom`])}
                    >
                      <option value="">Select</option>
                      {years.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    {errors?.[`certifications.${index}.yearsFrom`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`certifications.${index}.yearsFrom`]}</p>
                    )}
                  </div>
                  <div className="relative">
                    <select
                      value={cert.yearsTo}
                      onChange={(e) => updateCertificate(index, 'yearsTo', e.target.value)}
                      className={getInputClass(errors?.[`certifications.${index}.yearsTo`])}
                    >
                      <option value="">Select</option>
                      {years.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    {errors?.[`certifications.${index}.yearsTo`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`certifications.${index}.yearsTo`]}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Upload your certificate</h4>
                <p className="text-sm text-gray-600 mb-4">Our team will manually review your submission</p>

                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(index, file);
                  }}
                  className="hidden"
                  id={`certificate-upload-${index}`}
                />

                <label
                  htmlFor={`certificate-upload-${index}`}
                  className={getUploadClass(errors?.[`certifications.${index}.file`])}
                >
                  {cert.file ? cert.file.name || 'Upload' : 'Upload'}
                </label>

                {/* Preview if image */}
                {cert.file?.type?.startsWith('image/') && (
                  <div className="mt-2">
                    <img
                      src={cert.file.data || ''}
                      alt="Preview"
                      className="max-h-32 rounded-md border border-gray-200"
                    />
                  </div>
                )}

                {/* Preview if PDF */}
                {cert.file?.type === 'application/pdf' && (
                  <div className="mt-2">
                    <iframe
                      src={cert.file.data as string}
                      title="PDF Preview"
                      className="w-full h-48 border rounded-md"
                    />
                  </div>
                )}

                {errors?.[`certifications.${index}.file`] && (
                  <p className="text-red-500 text-xs mt-1">{errors[`certifications.${index}.file`]}</p>
                )}
              </div>

            </div>
          ))}

          <button
            onClick={addCertificate}
            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            Add another certificate
          </button>

          {errors?.certifications && typeof errors.certifications === 'string' && (
            <p className="text-red-500 text-sm mt-2">{errors.certifications}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CertificationStep;
