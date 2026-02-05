/* eslint-disable @next/next/no-img-element */
'use client';

import React from "react"
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface MembershipData {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  mobileNumber: string;
  email: string;
  address: string;
  gothra: string;
  profilePhoto: File | null;
}

export default function RegistrationForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<MembershipData>({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    mobileNumber: '',
    email: '',
    address: '',
    gothra: '',
    profilePhoto: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoPreview, setPhotoPreview] = useState<string>('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.mobileNumber.trim()) newErrors.mobileNumber = 'Mobile number is required';
    if (!/^[0-9]{10}$/.test(formData.mobileNumber.replace(/\s/g, ''))) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }
    if (!formData.address.trim()) newErrors.address = 'Address/District is required';
    if (!formData.profilePhoto) newErrors.profilePhoto = 'Profile photo is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted with data:', formData);
      
      // Save form data to localStorage for use in next step
      const formDataForStorage = {
        ...formData,
        profilePhoto: photoPreview // Store the preview URL
      };
      localStorage.setItem('registrationData', JSON.stringify(formDataForStorage));
      
      // Navigate to membership selection page
      router.push('/membership');
    }
  };

  const handleChange = (field: keyof MembershipData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({
          ...prev,
          profilePhoto: 'Please upload a valid image file',
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          profilePhoto: 'Image size should be less than 5MB',
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        profilePhoto: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Clear error
      if (errors.profilePhoto) {
        setErrors((prev) => ({
          ...prev,
          profilePhoto: '',
        }));
      }
    }
  };

  return (
    <div className="bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-xl px-4 py-3">
          <div className="flex items-center justify-center gap-4">
            <Image
              src="/logo.png"
              alt="Akhila Bharatiya Brahmana Mahasangh Logo"
              width={60}
              height={60}
              className="object-contain"
            />
            <div className="flex flex-col justify-center">
              <h1 className="text-3xl font-bold text-primary">
                Akhila Bharatiya Brahmana Mahasangh
              </h1>
              <p className="text-muted-foreground">Membership Registration Portal</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="rounded-lg bg-card p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="mb-6 text-2xl font-bold text-foreground">
                Step 1: Your Details
              </h2>
              <p className="text-sm text-muted-foreground">
                Please provide your personal information to begin the membership registration process.
              </p>
            </div>

            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Personal Information</h3>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Full Name *
                </label>
                <Input
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className={errors.fullName ? 'border-destructive' : ''}
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-destructive">{errors.fullName}</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Date of Birth *
                  </label>
                  <Input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                    className={errors.dateOfBirth ? 'border-destructive' : ''}
                  />
                  {errors.dateOfBirth && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Gender *
                  </label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => handleChange('gender', value)}
                  >
                    <SelectTrigger className={errors.gender ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p className="mt-1 text-xs text-destructive">{errors.gender}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Mobile Number *
                  </label>
                  <Input
                    placeholder="Enter 10-digit mobile number"
                    value={formData.mobileNumber}
                    onChange={(e) => handleChange('mobileNumber', e.target.value)}
                    className={errors.mobileNumber ? 'border-destructive' : ''}
                    maxLength={10}
                  />
                  {errors.mobileNumber && (
                    <p className="mt-1 text-xs text-destructive">{errors.mobileNumber}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Email (Optional)
                  </label>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Address / District *
                </label>
                <Input
                  placeholder="Enter your address or district"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className={errors.address ? 'border-destructive' : ''}
                />
                {errors.address && (
                  <p className="mt-1 text-xs text-destructive">{errors.address}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Gothra (Optional)
                </label>
                <Input
                  placeholder="Enter your Gothra"
                  value={formData.gothra}
                  onChange={(e) => handleChange('gothra', e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Profile Photo *
                </label>
                <div className="space-y-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className={errors.profilePhoto ? 'border-destructive' : ''}
                  />
                  {errors.profilePhoto && (
                    <p className="mt-1 text-xs text-destructive">{errors.profilePhoto}</p>
                  )}
                  {photoPreview && (
                    <div className="flex justify-center">
                      <img
                        src={photoPreview}
                        alt="Profile preview"
                        className="h-32 w-32 rounded-lg object-cover border-2 border-border"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Continue to Membership Selection
              </Button>
            </div>
          </form>
        </div>
      </main>


    </div>
  );
}