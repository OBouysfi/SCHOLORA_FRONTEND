'use client';

import { useState, useEffect } from 'react';
import { Upload, Check } from 'lucide-react';

interface PhotoStepProps {
  formData: {
    photo?: File | string | null;
    firstName?: string;
    lastName?: string;
  };
  errors?: Record<string, string>;
  onUpdate: (data: any) => void;
}

const PhotoStep = ({ formData, errors = {}, onUpdate }: PhotoStepProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (formData.photo instanceof File) {
      const objectUrl = URL.createObjectURL(formData.photo);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof formData.photo === 'string') {
      setPreview(formData.photo);
    } else {
      setPreview(null);
    }
  }, [formData.photo]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpdate({ photo: file });
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 mb-4">Profile photo</h3>
        <p className="text-gray-600 text-lg">Choose a photo that will help learners get to know you.</p>
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-300 rounded-lg flex-shrink-0 overflow-hidden">
            <img
              src={preview || '/images/pic.jpg'}
              alt="Profile preview"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 flex items-center">
              {formData.firstName || 'Mohen'} {formData.lastName?.[0] || 'N'}.
              <span className="ml-2 text-sm">🇲🇦</span>
            </h4>
            <p className="text-sm text-gray-600 flex items-center mt-1">
              📚 Teaches English lessons
            </p>
            <p className="text-sm text-gray-600 flex items-center mt-1">
              💬 Speaks English (C1), Albanian (Native)
            </p>
          </div>
        </div>
      </div>

      {/* Upload Button */}
      <div className="flex justify-center">
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="photo-upload"
          />
          <label
            htmlFor="photo-upload"
            className={`inline-block px-8 py-3 rounded-lg font-medium cursor-pointer transition-colors ${
              errors.photo
                ? 'bg-red-50 border-2 border-red-500 text-red-700'
                : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Upload new photo
          </label>
        </div>
      </div>

      {/* Error message */}
      {errors.photo && (
        <p className="text-red-600 text-sm mt-2 text-center">{errors.photo}</p>
      )}

      {/* Requirements Section */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-6 text-lg">What your photo needs</h4>
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="relative">
              <img src="/images/pic.jpg" alt={`Example ${i}`} className="w-full h-16 object-cover rounded-lg" />
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {[
            'You should be facing forward',
            'Frame your head and shoulders',
            'You should be centered and upright',
            'Your face and eyes should be visible (except for religious reasons)',
            'You should be the only person in the photo',
            'Use a color photo with high resolution and no filters',
            'Avoid logos or contact information',
          ].map((requirement, index) => (
            <div key={index} className="flex items-start space-x-3">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700">{requirement}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhotoStep;
