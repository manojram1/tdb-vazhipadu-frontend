import React, { useState } from 'react';
import { NAKSHATRAS } from '../../types';
import { User, Phone, Star, Calendar, CheckCircle2 } from 'lucide-react';

export interface OrderFormData {
  devoteeName: string;
  phoneNumber: string;
  nakshatra: string;
  date: string;
}

export interface FormErrors {
  devoteeName?: string;
  phoneNumber?: string;
  nakshatra?: string;
  date?: string;
}

interface OrderFormProps {
  onSubmit: (formData: OrderFormData) => void;
  isSubmitting?: boolean;
  disabled?: boolean;
  submitButtonText?: string;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  onSubmit,
  isSubmitting = false,
  disabled = false,
  submitButtonText = 'Proceed to Book Offerings',
}) => {
  const [formData, setFormData] = useState<OrderFormData>({
    devoteeName: '',
    phoneNumber: '',
    nakshatra: '',
    date: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Today in YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  const validateField = (field: keyof OrderFormData, value: string): string | undefined => {
    switch (field) {
      case 'devoteeName':
        if (!value.trim()) {
          return 'Devotee name is required';
        }
        if (value.trim().length < 2) {
          return 'Name must be at least 2 characters';
        }
        return undefined;

      case 'phoneNumber':
        if (!value.trim()) {
          return 'Phone number is required';
        }
        if (!/^[6-9]\d{9}$/.test(value.trim())) {
          return 'Enter a valid 10-digit mobile number';
        }
        return undefined;

      case 'nakshatra':
        if (!value.trim()) {
          return 'Birth star (nakshatra) is required';
        }
        return undefined;

      case 'date':
        if (!value) {
          return 'Offering date is required';
        }
        if (value < todayStr) {
          return 'Offering date cannot be in the past';
        }
        return undefined;

      default:
        return undefined;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    (Object.keys(formData) as (keyof OrderFormData)[]).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    setTouched({
      devoteeName: true,
      phoneNumber: true,
      nakshatra: true,
      date: true,
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof OrderFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // If field was already touched, validate on change
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field: keyof OrderFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form
      data-testid="order-form"
      onSubmit={handleSubmit}
      noValidate
      className="bg-white rounded-xl shadow-sm border border-stone-200 p-5 space-y-4"
    >
      <div className="border-b border-stone-100 pb-3">
        <h3 className="font-semibold text-base text-stone-900 flex items-center">
          <User className="w-4 h-4 mr-2 text-amber-700" />
          Devotee & Ritual Details
        </h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Ritual sankalpam will be recited using these sacred details.
        </p>
      </div>

      {/* Devotee Name */}
      <div>
        <label
          htmlFor="devoteeName"
          className="block text-xs font-semibold text-stone-700 mb-1"
        >
          Devotee Full Name *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
            <User className="w-4 h-4" />
          </div>
          <input
            id="devoteeName"
            name="devoteeName"
            type="text"
            value={formData.devoteeName}
            onChange={(e) => handleChange('devoteeName', e.target.value)}
            onBlur={() => handleBlur('devoteeName')}
            placeholder="e.g. Manoj Ramakrishnan"
            aria-invalid={Boolean(errors.devoteeName)}
            aria-describedby={errors.devoteeName ? 'devoteeName-error' : undefined}
            className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border transition-colors focus:outline-none focus:ring-2 ${
              errors.devoteeName
                ? 'border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-red-200'
                : 'border-stone-300 bg-white focus:border-amber-500 focus:ring-amber-200'
            }`}
          />
        </div>
        {errors.devoteeName && (
          <p
            id="devoteeName-error"
            data-testid="error-devoteeName"
            role="alert"
            className="text-xs text-red-600 mt-1 font-medium"
          >
            {errors.devoteeName}
          </p>
        )}
      </div>

      {/* Phone Number */}
      <div>
        <label
          htmlFor="phoneNumber"
          className="block text-xs font-semibold text-stone-700 mb-1"
        >
          Devotee Mobile Number (10 Digits) *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
            <Phone className="w-4 h-4" />
          </div>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            maxLength={10}
            value={formData.phoneNumber}
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
            onBlur={() => handleBlur('phoneNumber')}
            placeholder="e.g. 9847012345"
            aria-invalid={Boolean(errors.phoneNumber)}
            aria-describedby={errors.phoneNumber ? 'phoneNumber-error' : undefined}
            className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border transition-colors focus:outline-none focus:ring-2 ${
              errors.phoneNumber
                ? 'border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-red-200'
                : 'border-stone-300 bg-white focus:border-amber-500 focus:ring-amber-200'
            }`}
          />
        </div>
        {errors.phoneNumber && (
          <p
            id="phoneNumber-error"
            data-testid="error-phoneNumber"
            role="alert"
            className="text-xs text-red-600 mt-1 font-medium"
          >
            {errors.phoneNumber}
          </p>
        )}
      </div>

      {/* Birth Star (Nakshatra) - 27 Stars */}
      <div>
        <label
          htmlFor="nakshatra"
          className="block text-xs font-semibold text-stone-700 mb-1"
        >
          Birth Star (Nakshatra / Janma Nakshatram) *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
            <Star className="w-4 h-4" />
          </div>
          <select
            id="nakshatra"
            name="nakshatra"
            value={formData.nakshatra}
            onChange={(e) => handleChange('nakshatra', e.target.value)}
            onBlur={() => handleBlur('nakshatra')}
            aria-invalid={Boolean(errors.nakshatra)}
            aria-describedby={errors.nakshatra ? 'nakshatra-error' : undefined}
            className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border transition-colors focus:outline-none focus:ring-2 appearance-none bg-white ${
              errors.nakshatra
                ? 'border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-red-200'
                : 'border-stone-300 focus:border-amber-500 focus:ring-amber-200'
            }`}
          >
            <option value="">-- Choose one of the 27 Nakshatras --</option>
            {NAKSHATRAS.map((star) => (
              <option key={star} value={star}>
                {star}
              </option>
            ))}
          </select>
        </div>
        {errors.nakshatra && (
          <p
            id="nakshatra-error"
            data-testid="error-nakshatra"
            role="alert"
            className="text-xs text-red-600 mt-1 font-medium"
          >
            {errors.nakshatra}
          </p>
        )}
      </div>

      {/* Date of Offering */}
      <div>
        <label
          htmlFor="date"
          className="block text-xs font-semibold text-stone-700 mb-1"
        >
          Date of Offering (Ritual Date) *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
            <Calendar className="w-4 h-4" />
          </div>
          <input
            id="date"
            name="date"
            type="date"
            min={todayStr}
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            onBlur={() => handleBlur('date')}
            aria-invalid={Boolean(errors.date)}
            aria-describedby={errors.date ? 'date-error' : undefined}
            className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border transition-colors focus:outline-none focus:ring-2 bg-white ${
              errors.date
                ? 'border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-red-200'
                : 'border-stone-300 focus:border-amber-500 focus:ring-amber-200'
            }`}
          />
        </div>
        {errors.date && (
          <p
            id="date-error"
            data-testid="error-date"
            role="alert"
            className="text-xs text-red-600 mt-1 font-medium"
          >
            {errors.date}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={disabled || isSubmitting}
        className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm text-white shadow-sm transition-all flex items-center justify-center space-x-2 ${
          disabled || isSubmitting
            ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
            : 'bg-amber-700 hover:bg-amber-800 active:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500'
        }`}
      >
        <CheckCircle2 className="w-4 h-4" />
        <span>{isSubmitting ? 'Processing Order...' : submitButtonText}</span>
      </button>
    </form>
  );
};
