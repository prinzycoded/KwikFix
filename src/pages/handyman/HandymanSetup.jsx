import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Upload,
  Camera,
  Shield,
  User,
  FileText,
  Phone,
  X,
  Check,
  Info,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';

const STEPS = [
  { label: 'Personal Info', icon: User },
  { label: 'Qualification', icon: FileText },
  { label: 'Verification', icon: Shield },
  { label: 'Phone', icon: Phone },
  { label: 'Final Setup', icon: CheckCircle },
];

const NICHES = ['Plumbing', 'Carpentry', 'Electrical', 'Mechanic'];

const EDUCATION_LEVELS = [
  'First School Leaving',
  'BECE',
  'WAEC/NECO/GCE',
  'BSc',
  'Masters',
];

const TERMS_TEXT = `TERMS AND CONDITIONS FOR KWIKFIX HANDYMAN SERVICES

1. INTRODUCTION
These Terms and Conditions govern your registration and use of the KWIKFIX platform as a Handyman Service Provider. By creating an account and using the platform, you agree to be bound by these terms.

2. ELIGIBILITY
You must be at least 18 years of age and not more than 50 years of age to register as a Handyman. You must possess the necessary skills, qualifications, and licenses required to perform the services you offer. You agree to provide accurate and complete information during registration.

3. VERIFICATION REQUIREMENTS
You agree to provide your National Identification Number (NIN) and Bank Verification Number (BVN) for identity verification purposes. Your personal information will be handled in accordance with our Privacy Policy and applicable data protection regulations.

4. COMMISSION FEES
A commission fee of 2% (two percent) will be applied to every job you accept and complete through the KWIKFIX platform. This fee is deducted from the total job payment before disbursement to your account. KWIKFIX reserves the right to adjust this commission rate with prior notice.

5. SERVICE OBLIGATIONS
As a Handyman, you agree to:
- Perform services with reasonable skill and care
- Arrive at scheduled appointments on time
- Communicate professionally with customers
- Maintain the confidentiality of customer information
- Comply with all applicable laws and regulations

6. PAYMENT TERMS
Payments for completed jobs will be processed through the KWIKFIX platform. Withdrawals are processed within 1-3 business days. KWIKFIX may hold payments pending dispute resolution if a customer raises a complaint.

7. CODE OF CONDUCT
You agree to maintain professional conduct at all times. Harassment, discrimination, fraud, or any illegal activity will result in immediate account termination and possible legal action.

8. ACCOUNT TERMINATION
KWIKFIX reserves the right to suspend or terminate your account for violation of these terms, provision of false information, poor service ratings, or any activity that harms the platform's reputation.

9. DISPUTE RESOLUTION
Any disputes arising from services provided through the platform will be mediated by KWIKFIX. Both parties agree to participate in good faith in the dispute resolution process.

10. LIABILITY
KWIKFIX acts as a marketplace connecting Handymen with Customers. We are not liable for the quality of services provided. Handymen are responsible for their own insurance coverage and liability.

11. DATA PROTECTION
Your personal data will be collected, stored, and processed in accordance with the Nigeria Data Protection Regulation (NDPR) and other applicable laws.

12. MODIFICATIONS
KWIKFIX reserves the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the modified terms.

13. GOVERNING LAW
These terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria.`;

function getAge(dateString) {
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function HandymanSetup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { updateHandymanRegistration } = useApp();

  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [areaOfSpecialization, setAreaOfSpecialization] = useState('');

  const [pastWorkImages, setPastWorkImages] = useState([]);
  const [highestEducation, setHighestEducation] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [references, setReferences] = useState([
    { name: '', phone: '' },
    { name: '', phone: '' },
    { name: '', phone: '' },
  ]);

  const [nin, setNin] = useState('');
  const [ninVerified, setNinVerified] = useState(false);
  const [ninError, setNinError] = useState('');

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpRequests, setOtpRequests] = useState(0);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState('');
  const phoneNumber = '+234 801 234 5678';

  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [locationPermission, setLocationPermission] = useState(false);
  const [audioPermission, setAudioPermission] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const otpRefs = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (otpTimer > 0) {
      timerRef.current = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [otpTimer]);

  useEffect(() => {
    if (otpCooldown > 0) {
      const cd = setInterval(() => {
        setOtpCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(cd);
            setOtpRequests(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(cd);
    }
  }, [otpCooldown]);

  const handleOtpChange = (index, value) => {
    if (otpVerified) return;
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError('');

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    const fullOtp = newOtp.join('');
    if (fullOtp.length === 6) {
      setTimeout(() => {
        setOtpVerified(true);
      }, 500);
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    if (otpVerified) return;
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '');
    if (pasted.length === 0) return;
    const newOtp = ['', '', '', '', '', ''];
    for (let i = 0; i < Math.min(pasted.length, 6); i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    setOtpError('');
    const focusIdx = Math.min(pasted.length, 5);
    otpRefs.current[focusIdx]?.focus();
    if (pasted.length >= 6) {
      setTimeout(() => setOtpVerified(true), 500);
    }
  };

  const handleRequestCode = () => {
    if (otpCooldown > 0) return;
    if (otpRequests >= 3) {
      setOtpCooldown(1800);
      setOtpRequests(0);
      return;
    }
    setOtpRequests((prev) => prev + 1);
    setOtpTimer(60);
  };

  const validateStep = (s) => {
    const newErrors = {};

    if (s === 0) {
      if (!firstName.trim()) newErrors.firstName = 'First name is required';
      if (!lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!age) {
        newErrors.age = 'Age is required';
      } else {
        const ageNum = parseInt(age, 10);
        if (isNaN(ageNum) || ageNum < 18 || ageNum > 50)
          newErrors.age = 'Age must be between 18 and 50';
      }
      if (!gender) newErrors.gender = 'Please select your gender';
      if (!dateOfBirth) {
        newErrors.dateOfBirth = 'Date of birth is required';
      } else {
        const calculatedAge = getAge(dateOfBirth);
        const enteredAge = parseInt(age, 10);
        if (calculatedAge < 18 || calculatedAge > 50)
          newErrors.dateOfBirth = 'Age from DOB must be between 18 and 50';
        else if (!isNaN(enteredAge) && calculatedAge !== enteredAge)
          newErrors.dateOfBirth = 'Date of birth does not match entered age';
      }
      if (!areaOfSpecialization)
        newErrors.areaOfSpecialization =
          'Please select your area of specialization';
    }

    if (s === 1) {
      if (!highestEducation)
        newErrors.highestEducation = 'Please select your highest education level';
      if (!yearsOfExperience) {
        newErrors.yearsOfExperience = 'Years of experience is required';
      } else {
        const exp = parseInt(yearsOfExperience, 10);
        if (isNaN(exp) || exp < 1)
          newErrors.yearsOfExperience = 'Minimum 1 year of experience required';
      }
      if (!references[0].name.trim())
        newErrors.ref1Name = 'Reference 1 name is required';
      if (!references[0].phone.trim())
        newErrors.ref1Phone = 'Reference 1 phone is required';
      if (!references[1].name.trim())
        newErrors.ref2Name = 'Reference 2 name is required';
      if (!references[1].phone.trim())
        newErrors.ref2Phone = 'Reference 2 phone is required';
    }

    if (s === 2) {
      if (!ninVerified) newErrors.nin = 'Please verify your NIN';
    }

    if (s === 3) {
      if (!otpVerified) newErrors.otp = 'Please enter and verify the OTP';
    }

    if (s === 4) {
      if (!username.trim())
        newErrors.username = 'Username is required';
      if (!acceptTerms)
        newErrors.acceptTerms = 'You must accept the Terms & Conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0));
    setErrors({});
  };

  const handleVerifyNin = () => {
    const cleaned = nin.replace(/\D/g, '');
    if (cleaned.length !== 11) {
      setNinError('NIN must be exactly 11 digits');
      return;
    }
    setNinError('');
    setTimeout(() => {
      setNinVerified(true);
    }, 800);
  };

  const handleCreateAccount = () => {
    if (!validateStep(4)) return;
    signup({
      fullName: `${firstName} ${lastName}`,
      niche: areaOfSpecialization.toLowerCase(),
      role: 'handyman',
    });
    updateHandymanRegistration('step1', {
      name: `${firstName} ${lastName}`,
      age: parseInt(age, 10),
      gender,
      dateOfBirth,
      areaOfSpecialization: areaOfSpecialization.toLowerCase(),
    });
    updateHandymanRegistration('step2', {
      pastWorkImages,
      highestEducation: highestEducation.toLowerCase().replace(/\s/g, '_'),
      yearsOfExperience: parseInt(yearsOfExperience, 10),
      references: references.filter((r) => r.name.trim() || r.phone.trim()),
    });
    updateHandymanRegistration('step3', { nin });
    updateHandymanRegistration('step4', { otp: otp.join('') });
    updateHandymanRegistration('step5', {
      username,
      profilePicture,
      permissions: { location: locationPermission, audio: audioPermission },
    });
    setShowSuccessModal(true);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8 px-4">
      {STEPS.map((s, idx) => (
        <div key={idx} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                ${
                  step === idx
                    ? 'bg-[#FF6600] text-white shadow-lg shadow-orange-200'
                    : step > idx
                      ? 'bg-[#10B981] text-white'
                      : 'bg-[#F4F4F4] text-gray-400 border-2 border-gray-200'
                }`}
            >
              {step > idx ? (
                <CheckCircle size={20} />
              ) : (
                <span>{idx + 1}</span>
              )}
            </div>
            <span
              className={`text-[10px] mt-1 hidden sm:block ${
                step === idx
                  ? 'text-[#FF6600] font-semibold'
                  : step > idx
                    ? 'text-[#10B981]'
                    : 'text-gray-400'
              }`}
            >
              {s.label}
            </span>
          </div>
          {idx < STEPS.length - 1 && (
            <div
              className={`h-0.5 w-8 sm:w-12 mx-1 sm:mx-2 rounded ${
                step > idx ? 'bg-[#10B981]' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderError = (field) => {
    if (!errors[field]) return null;
    return (
      <p className="text-[#EF4444] text-xs mt-1 flex items-center gap-1">
        <X size={12} />
        {errors[field]}
      </p>
    );
  };

  const inputClass =
    'w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6600] focus:border-transparent text-sm transition-all bg-white';
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1.5';
  const selectClass =
    'w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6600] focus:border-transparent text-sm bg-white appearance-none cursor-pointer';

  const renderStep0 = () => (
    <div className="space-y-5 animate-fadeIn">
      <h2 className="text-2xl font-bold text-[#003366] mb-6">
        Personal Information
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>First Name</label>
          <input
            type="text"
            placeholder="e.g. John"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={`${inputClass} ${errors.firstName ? 'border-[#EF4444]' : ''}`}
          />
          {renderError('firstName')}
        </div>
        <div>
          <label className={labelClass}>Last Name</label>
          <input
            type="text"
            placeholder="e.g. Doe"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={`${inputClass} ${errors.lastName ? 'border-[#EF4444]' : ''}`}
          />
          {renderError('lastName')}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Age</label>
          <input
            type="number"
            placeholder="e.g. 25"
            min={18}
            max={50}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className={`${inputClass} ${errors.age ? 'border-[#EF4444]' : ''}`}
          />
          {renderError('age')}
        </div>
        <div>
          <label className={labelClass}>Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className={`${selectClass} ${errors.gender ? 'border-[#EF4444]' : ''}`}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {renderError('gender')}
        </div>
      </div>

      <div>
        <label className={labelClass}>Date of Birth</label>
        <input
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          className={`${inputClass} ${errors.dateOfBirth ? 'border-[#EF4444]' : ''}`}
        />
        {renderError('dateOfBirth')}
      </div>

      <div>
        <label className={labelClass}>Area of Specialization / Niche</label>
        <select
          value={areaOfSpecialization}
          onChange={(e) => setAreaOfSpecialization(e.target.value)}
          className={`${selectClass} ${errors.areaOfSpecialization ? 'border-[#EF4444]' : ''}`}
        >
          <option value="">Select your niche</option>
          {NICHES.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        {renderError('areaOfSpecialization')}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-[#003366] mb-6">Qualification</h2>

      <div>
        <label className={labelClass}>Upload Past Work Pictures</label>
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2, 3, 4, 5].map((idx) => (
            <div
              key={idx}
              className="aspect-square rounded-lg bg-[#F4F4F4] border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#FF6600] transition-all"
              onClick={() => {
                setPastWorkImages((prev) => {
                  const next = [...prev];
                  next[idx] = 'uploaded';
                  return next;
                });
              }}
            >
              {pastWorkImages[idx] ? (
                <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                  <CheckCircle size={24} className="text-[#10B981]" />
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <Upload size={20} />
                  <span className="text-[10px] mt-1">Upload</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>Highest Education Level</label>
        <select
          value={highestEducation}
          onChange={(e) => setHighestEducation(e.target.value)}
          className={`${selectClass} ${errors.highestEducation ? 'border-[#EF4444]' : ''}`}
        >
          <option value="">Select education level</option>
          {EDUCATION_LEVELS.map((el) => (
            <option key={el} value={el}>
              {el}
            </option>
          ))}
        </select>
        {renderError('highestEducation')}
      </div>

      <div>
        <label className={labelClass}>Years of Experience</label>
        <input
          type="number"
          min={1}
          placeholder="e.g. 5"
          value={yearsOfExperience}
          onChange={(e) => setYearsOfExperience(e.target.value)}
          className={`${inputClass} ${errors.yearsOfExperience ? 'border-[#EF4444]' : ''}`}
        />
        {renderError('yearsOfExperience')}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          References (at least 2)
        </label>
        {references.map((ref, idx) => (
          <div
            key={idx}
            className="p-4 mb-3 rounded-lg border border-gray-100 bg-[#F4F4F4]/50"
          >
            <p className="text-xs font-medium text-gray-500 mb-2">
              Reference {idx + 1}
              {idx === 2 && (
                <span className="text-gray-400 font-normal">
                  {' '}
                  (optional)
                </span>
              )}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  placeholder="e.g. Mr. Adebayo"
                  value={ref.name}
                  onChange={(e) => {
                    const newRefs = [...references];
                    newRefs[idx] = { ...newRefs[idx], name: e.target.value };
                    setReferences(newRefs);
                  }}
                  className={inputClass}
                />
                {idx === 0 && renderError('ref1Name')}
                {idx === 1 && renderError('ref2Name')}
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="e.g. 08012345678"
                  value={ref.phone}
                  onChange={(e) => {
                    const newRefs = [...references];
                    newRefs[idx] = { ...newRefs[idx], phone: e.target.value };
                    setReferences(newRefs);
                  }}
                  className={inputClass}
                />
                {idx === 0 && renderError('ref1Phone')}
                {idx === 1 && renderError('ref2Phone')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-[#003366] mb-6">
        NIN Verification
      </h2>

      <div className="p-5 rounded-xl border border-gray-200 bg-white">
        <label className={labelClass}>
          National Identification Number (NIN)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="text"
            inputMode="numeric"
            maxLength={11}
            placeholder="e.g. 12345678901"
            value={nin}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 11);
              setNin(val);
              setNinVerified(false);
              setNinError('');
            }}
            disabled={ninVerified}
            className={`${inputClass} flex-1 ${ninVerified ? 'bg-gray-50 opacity-75' : ''} ${ninError ? 'border-[#EF4444]' : ''}`}
          />
          {!ninVerified ? (
            <button
              onClick={handleVerifyNin}
              className="px-5 py-3 bg-[#FF6600] text-white rounded-lg font-semibold text-sm hover:bg-orange-600 transition-colors whitespace-nowrap"
            >
              Verify NIN
            </button>
          ) : (
            <div className="flex items-center gap-2 text-[#10B981] font-semibold text-sm whitespace-nowrap">
              <CheckCircle size={20} />
              Verified
            </div>
          )}
        </div>
        {ninError && (
          <p className="text-[#EF4444] text-xs mt-1">{ninError}</p>
        )}
        {renderError('nin')}
      </div>

      {ninVerified && (
        <div className="p-4 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center gap-3">
          <Shield size={24} className="text-[#10B981]" />
          <p className="text-sm text-gray-700 font-medium">
            NIN verification complete.
          </p>
        </div>
      )}
    </div>
  );

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const renderStep3 = () => (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-[#003366] mb-6">
        Phone Verification
      </h2>

      <div className="p-5 rounded-xl bg-[#F4F4F4] border border-gray-200">
        <label className="text-sm text-gray-500">Phone Number</label>
        <p className="text-lg font-bold text-[#003366]">{phoneNumber}</p>
      </div>

      <div>
        <label className={labelClass}>Enter OTP Code</label>
        <div
          className="flex items-center justify-center gap-2 sm:gap-3 my-4"
          onPaste={handleOtpPaste}
        >
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                otpRefs.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(idx, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(idx, e)}
              className={`w-11 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#FF6600] transition-all
                ${otpVerified ? 'border-[#10B981] bg-[#10B981]/5' : 'border-gray-200 bg-white'}
                ${otpError && !otpVerified ? 'border-[#EF4444]' : ''}`}
              disabled={otpVerified}
            />
          ))}
        </div>
        {otpError && (
          <p className="text-[#EF4444] text-xs text-center">{otpError}</p>
        )}
        {otpVerified && (
          <p className="text-[#10B981] text-xs text-center flex items-center justify-center gap-1 mt-1">
            <CheckCircle size={14} />
            Verified successfully
          </p>
        )}
        {renderError('otp')}
      </div>

      <div className="flex flex-col items-center gap-3">
        {otpCooldown > 0 ? (
          <div className="text-center">
            <p className="text-sm text-[#EF4444] font-medium mb-1">
              Maximum requests reached. Try again in:
            </p>
            <p className="text-lg font-bold text-[#003366]">
              {formatTime(otpCooldown)}
            </p>
          </div>
        ) : (
          <button
            onClick={handleRequestCode}
            disabled={otpTimer > 0 || otpVerified}
            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all
              ${
                otpTimer > 0 || otpVerified
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-[#003366] text-white hover:bg-[#002244]'
              }`}
          >
            {otpTimer > 0
              ? `Resend code in ${formatTime(otpTimer)}`
              : otpRequests >= 3
                ? 'Maximum requests reached'
                : 'Request Code'}
          </button>
        )}
        <p className="text-xs text-gray-400">
          {otpRequests < 3
            ? `${3 - otpRequests} request${3 - otpRequests !== 1 ? 's' : ''} remaining`
            : 'Cooldown period active'}
        </p>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-[#003366] mb-6">Final Setup</h2>

      <div className="flex flex-col items-center mb-6">
        <div
          className="w-24 h-24 rounded-full bg-[#F4F4F4] border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#FF6600] transition-all overflow-hidden"
          onClick={() =>
            setProfilePicture(
              profilePicture ? '' : 'https://via.placeholder.com/100',
            )
          }
        >
          {profilePicture ? (
            <img
              src={profilePicture}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center text-gray-400">
              <Camera size={28} />
              <span className="text-xs mt-1">Upload</span>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-2">Upload Profile Picture</p>
      </div>

      <div>
        <label className={labelClass}>Username</label>
        <input
          type="text"
          placeholder="e.g. johnfixer"
          value={username}
          onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
          className={`${inputClass} ${errors.username ? 'border-[#EF4444]' : ''}`}
        />
        {renderError('username')}
      </div>

      <div>
        <label className={labelClass}>App Permissions</label>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer hover:border-[#FF6600] transition-all">
            <div>
              <p className="font-medium text-gray-700 text-sm">Location</p>
              <p className="text-xs text-gray-400">
                Allow access to your location
              </p>
            </div>
            <div
              onClick={() => setLocationPermission(!locationPermission)}
              className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${
                locationPermission ? 'bg-[#10B981]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow transition-transform ${
                  locationPermission ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </div>
          </label>
          <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer hover:border-[#FF6600] transition-all">
            <div>
              <p className="font-medium text-gray-700 text-sm">Audio</p>
              <p className="text-xs text-gray-400">
                Allow access to microphone
              </p>
            </div>
            <div
              onClick={() => setAudioPermission(!audioPermission)}
              className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${
                audioPermission ? 'bg-[#10B981]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow transition-transform ${
                  audioPermission ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </div>
          </label>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
        <div className="flex items-start gap-3">
          <Info size={20} className="text-amber-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              Commission Fee Notice
            </p>
            <p className="text-xs text-amber-700 mt-1">
              A 2% commission fee will be applied to every job you accept and
              complete through the KWIKFIX platform.
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <div
            onClick={() => setAcceptTerms(!acceptTerms)}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 mt-0.5 ${
              acceptTerms
                ? 'bg-[#FF6600] border-[#FF6600]'
                : 'border-gray-300 bg-white'
            }`}
          >
            {acceptTerms && <Check size={14} className="text-white" />}
          </div>
          <p className="text-sm text-gray-600">
            I accept the{' '}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowTermsModal(true);
              }}
              className="text-[#FF6600] font-semibold underline"
            >
              Terms & Conditions
            </button>
          </p>
        </label>
        {renderError('acceptTerms')}
      </div>

      <button
        onClick={handleCreateAccount}
        className="w-full py-4 bg-[#FF6600] text-white rounded-xl font-bold text-lg hover:bg-orange-600 transition-all shadow-lg shadow-orange-200"
      >
        Create Account
      </button>
    </div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return renderStep0();
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={24} className="text-[#003366]" />
          </button>
          <h1 className="text-lg font-bold text-[#003366]">
            Handyman Registration
          </h1>
          <div className="w-10" />
        </div>

        {renderStepIndicator()}

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          {renderStepContent()}
        </div>

        {step < 4 && (
          <div className="flex justify-between mt-6">
            <button
              onClick={handleBack}
              disabled={step === 0}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2
                ${
                  step === 0
                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
            >
              <ChevronLeft size={18} />
              Back
            </button>
            <button
              onClick={handleContinue}
              className="px-8 py-3 bg-[#FF6600] text-white rounded-xl font-semibold text-sm hover:bg-orange-600 transition-all flex items-center gap-2 shadow-lg shadow-orange-200"
            >
              Continue
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="flex justify-start mt-6">
            <button
              onClick={handleBack}
              className="px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              <ChevronLeft size={18} />
              Back
            </button>
          </div>
        )}
      </div>

      {showTermsModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-bold text-[#003366] text-lg">
                Terms & Conditions
              </h3>
              <button
                onClick={() => setShowTermsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="overflow-y-auto p-5 text-sm text-gray-600 leading-relaxed space-y-4">
              {TERMS_TEXT.split('\n\n').map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
            <div className="p-5 border-t border-gray-100">
              <button
                onClick={() => setShowTermsModal(false)}
                className="w-full py-3 bg-[#FF6600] text-white rounded-xl font-semibold hover:bg-orange-600 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center">
            <div className="w-20 h-20 rounded-full bg-[#10B981]/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={48} className="text-[#10B981]" />
            </div>
            <h2 className="text-2xl font-bold text-[#003366] mb-2">
              Account Created Successfully!
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Welcome to KWIKFIX! Your handyman profile has been created.
            </p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/handyman/dashboard');
              }}
              className="w-full py-3 bg-[#FF6600] text-white rounded-xl font-bold hover:bg-orange-600 transition-all"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}

export default HandymanSetup;
