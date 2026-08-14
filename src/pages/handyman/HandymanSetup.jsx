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
  Mail,
  X,
  Check,
  Info,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { verifyNinWithMockData } from '../../lib/mockData';
import { NICHES, normalizeNiche } from '../../lib/niches';

const STEPS = [
  { label: 'Personal Info', icon: User },
  { label: 'Qualification', icon: FileText },
  { label: 'Verification', icon: Shield },
  { label: 'Account', icon: Mail },
  { label: 'Final Setup', icon: CheckCircle },
];

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

const getFriendlyError = (err) => {
  const code = err?.code || '';
  const messages = {
    'auth/email-already-in-use':
      'An account with this email already exists. Try logging in instead, or use a different email.',
    'auth/invalid-email': 'Please enter a valid email address',
    'auth/weak-password': 'Password must be at least 6 characters',
    'auth/too-many-requests': 'Too many attempts. Please try again later',
    'auth/operation-not-allowed': 'This sign-in method is not enabled in Firebase',
    'auth/network-request-failed': 'Network error. Check your connection and try again',
  };
  return messages[code] || (err?.message || 'Failed to create account. Please try again');
};

function HandymanSetup() {
  const navigate = useNavigate();
  const { signup, login, logout, sendVerificationEmail, firebaseReady, bootstrapHandymanProfile, firebaseUser, isAuthenticated, userRole } = useAuth();
  const { updateHandymanRegistration, saveHandymanProfile } = useApp();

  // A handyman who is already signed in as a handyman goes straight to
  // their dashboard (the login form is for switching/setup only).
  useEffect(() => {
    if (isAuthenticated && userRole === 'handyman') {
      navigate('/handyman/dashboard', { replace: true });
    }
  }, [isAuthenticated, userRole, navigate]);

  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [view, setView] = useState('signup');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [selectedNiches, setSelectedNiches] = useState([]);

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
  const [verifiedNinName, setVerifiedNinName] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [creating, setCreating] = useState(false);

  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [locationPermission, setLocationPermission] = useState(false);
  const [audioPermission, setAudioPermission] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const fileInputRef = useRef(null);
  const profilePicInputRef = useRef(null);
  const [targetSlot, setTargetSlot] = useState(null);

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
      if (selectedNiches.length === 0)
        newErrors.selectedNiches =
          'Select at least one niche you can work in';
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
      if (!email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!password) {
        newErrors.password = 'Password is required';
      } else if (password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      if (confirmPassword !== password) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
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
    const record = verifyNinWithMockData(cleaned, `${firstName} ${lastName}`.trim());
    if (!record) {
      setNinError('NIN must be exactly 11 digits');
      return;
    }
    setNinError('');
    setVerifiedNinName(record.fullName);
    setNinVerified(true);
  };

  const handlePastWorkFile = (e) => {
    const file = e.target.files?.[0];
    if (file && targetSlot !== null) {
      const url = URL.createObjectURL(file);
      setPastWorkImages((prev) => {
        const next = [...prev];
        next[targetSlot] = url;
        return next;
      });
    }
    e.target.value = '';
    setTargetSlot(null);
  };

  const handleProfilePicFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(URL.createObjectURL(file));
    }
    e.target.value = '';
  };

  const handleCreateAccount = async () => {
    if (!validateStep(4)) return;
    if (!firebaseReady) {
      setErrors({ acceptTerms: 'Firebase is not configured. Add your config to .env (see .env.example)' });
      return;
    }
    setCreating(true);
    try {
      const registration = {
        step1: {
          name: `${firstName} ${lastName}`,
          age: parseInt(age, 10),
          gender,
          dateOfBirth,
          niches: selectedNiches.map(normalizeNiche),
          areaOfSpecialization: normalizeNiche(selectedNiches[0] || ''),
        },
        step2: {
          pastWorkImages,
          highestEducation: highestEducation.toLowerCase().replace(/\s/g, '_'),
          yearsOfExperience: parseInt(yearsOfExperience, 10),
          references: references.filter((r) => r.name.trim() || r.phone.trim()),
        },
        step3: {
          nin,
          ninVerified: true,
          verifiedNinName,
        },
        step4: { email },
        step5: {
          username,
          profilePicture,
          permissions: { location: locationPermission, audio: audioPermission },
        },
      };
      await signup({
        fullName: `${firstName} ${lastName}`,
        email,
        password,
        phone: '',
        role: 'handyman',
        username,
        avatar: profilePicture,
        niche: normalizeNiche(selectedNiches[0] || ''),
        niches: selectedNiches.map(normalizeNiche),
      });
      updateHandymanRegistration('step1', registration.step1);
      updateHandymanRegistration('step2', registration.step2);
      updateHandymanRegistration('step3', registration.step3);
      updateHandymanRegistration('step4', registration.step4);
      updateHandymanRegistration('step5', registration.step5);
      await saveHandymanProfile(registration);
      setShowSuccessModal(true);
      try { await sendVerificationEmail(); } catch { /* verification email is optional */ }
    } catch (err) {
      setErrors({ acceptTerms: getFriendlyError(err) });
    } finally {
      setCreating(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!firebaseReady) {
      setLoginError('Firebase is not configured. Add your config to .env (see .env.example)');
      return;
    }
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Please fill in all fields');
      return;
    }
    setLoginSubmitting(true);
    try {
      if (firebaseUser?.email === loginEmail.trim()) {
        // Already signed in with this account (e.g. it was created in the
        // Firebase console and auto-signed-in as a customer). Just bootstrap
        // the handyman profile + directory entry and go to the dashboard.
        await bootstrapHandymanProfile();
      } else {
        if (firebaseUser) await logout();
        await login(loginEmail, loginPassword);
        await bootstrapHandymanProfile();
      }
      navigate('/handyman/dashboard');
    } catch (err) {
      setLoginError(getFriendlyError(err));
    } finally {
      setLoginSubmitting(false);
    }
  };

  const renderLoginView = () => (
    <div className="space-y-5 animate-fadeIn">
      <h2 className="text-2xl font-bold text-white mb-6">Log In</h2>
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className={labelClass}>Email Address</label>
          <input
            type="email"
            placeholder="e.g. johnfixer@email.com"
            value={loginEmail ?? ''}
            onChange={(e) => setLoginEmail(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Password</label>
          <input
            type="password"
            placeholder="Your password"
            value={loginPassword ?? ''}
            onChange={(e) => setLoginPassword(e.target.value)}
            className={inputClass}
          />
        </div>
        {loginError && (
          <p className="text-[#EF4444] text-xs flex items-center gap-1">
            <X size={12} />
            {loginError}
          </p>
        )}
        <button
          type="submit"
          disabled={loginSubmitting}
          className="w-full py-4 bg-accent text-white rounded-2xl font-bold text-lg hover:bg-accent-dark transition-all shadow-lg shadow-accent/30 disabled:opacity-60"
        >
          {loginSubmitting ? 'Logging in...' : 'Log In'}
        </button>
      </form>
    </div>
  );

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8 px-4">
      {STEPS.map((s, idx) => (
        <div key={idx} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                ${
                  step === idx
                    ? 'bg-accent text-white shadow-lg shadow-accent/30'
                    : step > idx
                      ? 'bg-[#10B981] text-white'
                      : 'bg-navy-800 text-muted border-2 border-white/10'
                }`}
            >
              {step > idx ? (
                <CheckCircle size={18} className="sm:w-5 sm:h-5" />
              ) : (
                <span>{idx + 1}</span>
              )}
            </div>
            <span
              className={`text-[10px] mt-1 hidden sm:block ${
                step === idx
                  ? 'text-accent font-semibold'
                  : step > idx
                    ? 'text-[#10B981]'
                    : 'text-muted'
              }`}
            >
              {s.label}
            </span>
          </div>
          {idx < STEPS.length - 1 && (
            <div
              className={`h-0.5 w-4 sm:w-12 mx-0.5 sm:mx-2 rounded ${
                step > idx ? 'bg-[#10B981]' : 'bg-white/10'
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
    'w-full px-4 py-3 rounded-lg border border-white/15 bg-navy-700 text-white placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm transition-all';
  const labelClass = 'block text-sm font-semibold text-white mb-1.5';
  const selectClass =
    'w-full px-4 py-3 rounded-lg border border-white/15 bg-navy-700 text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm appearance-none cursor-pointer';

  const renderStep0 = () => (
    <div className="space-y-5 animate-fadeIn">
      <h2 className="text-2xl font-bold text-white mb-6">
        Personal Information
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>First Name</label>
          <input
            type="text"
            placeholder="e.g. John"
            value={firstName ?? ''}
            onChange={(e) => setFirstName(e.target.value)}
            className={`${inputClass} ${errors.firstName ? 'border-[#EF4444]' : ''}`}
          />
          {renderError('firstName')}
        </div>
        <div>
          <label className={labelClass}>Last Name</label>
          <input
            type="text"
            placeholder="e.g. Okafor"
            value={lastName ?? ''}
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
            value={age ?? ''}
            onChange={(e) => setAge(e.target.value)}
            className={`${inputClass} ${errors.age ? 'border-[#EF4444]' : ''}`}
          />
          {renderError('age')}
        </div>
        <div>
          <label className={labelClass}>Gender</label>
          <select
            value={gender ?? ''}
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
          value={dateOfBirth ?? ''}
          onChange={(e) => setDateOfBirth(e.target.value)}
          className={`${inputClass} ${errors.dateOfBirth ? 'border-[#EF4444]' : ''}`}
        />
        {renderError('dateOfBirth')}
      </div>

      <div>
        <label className={labelClass}>Areas of Specialization / Niches</label>
        <p className="text-xs text-muted mb-2">Select all niches you can work in — you'll only be matched with services you selected.</p>
        <div className="grid grid-cols-2 gap-2">
          {NICHES.map((n) => {
            const selected = selectedNiches.includes(n.key);
            return (
              <button
                type="button"
                key={n.key}
                onClick={() => {
                  setSelectedNiches((prev) =>
                    selected ? prev.filter((k) => k !== n.key) : [...prev, n.key],
                  );
                  setErrors((prev) => ({ ...prev, selectedNiches: undefined }));
                }}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-all text-left ${
                  selected
                    ? 'border-accent bg-accent/15 text-white'
                    : 'border-white/15 bg-navy-700 text-muted hover:border-accent/50'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                    selected ? 'bg-accent border-accent' : 'border-white/25'
                  }`}
                >
                  {selected && <Check size={14} className="text-white" />}
                </span>
                {n.label}
              </button>
            );
          })}
        </div>
        {renderError('selectedNiches')}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-white mb-6">Qualification</h2>

      <div>
        <label className={labelClass}>Upload Past Work Pictures</label>
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2, 3, 4, 5].map((idx) => (
            <div
              key={idx}
              className="aspect-square rounded-lg bg-navy-800 border-2 border-dashed border-white/15 flex items-center justify-center cursor-pointer hover:border-accent transition-all overflow-hidden"
              onClick={() => {
                setTargetSlot(idx);
                fileInputRef.current?.click();
              }}
            >
              {pastWorkImages[idx] ? (
                <img
                  src={pastWorkImages[idx]}
                  alt={`Past work ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-muted">
                  <Upload size={20} />
                  <span className="text-[10px] mt-1">Upload</span>
                </div>
              )}
            </div>
          ))}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePastWorkFile}
        />
        <p className="text-xs text-muted mt-2">Tap a box to choose a picture from your device</p>
      </div>

      <div>
        <label className={labelClass}>Highest Education Level</label>
        <select
          value={highestEducation ?? ''}
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
          value={yearsOfExperience ?? ''}
          onChange={(e) => setYearsOfExperience(e.target.value)}
          className={`${inputClass} ${errors.yearsOfExperience ? 'border-[#EF4444]' : ''}`}
        />
        {renderError('yearsOfExperience')}
      </div>

      <div>
        <label className="block text-sm font-semibold text-white mb-3">
          References (at least 2)
        </label>
        {references.map((ref, idx) => (
          <div
            key={idx}
            className="p-4 mb-3 rounded-lg border border-white/10 bg-navy-800/50"
          >
            <p className="text-xs font-medium text-muted mb-2">
              Reference {idx + 1}
              {idx === 2 && (
                <span className="text-muted font-normal">
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
                  value={ref.name ?? ''}
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
                  value={ref.phone ?? ''}
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
      <h2 className="text-2xl font-bold text-white mb-6">
        NIN Verification
      </h2>

      <div className="p-5 rounded-xl border border-white/15 bg-navy-800">
        <label className={labelClass}>
          National Identification Number (NIN)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="text"
            inputMode="numeric"
            maxLength={11}
            placeholder="e.g. 12345678901"
            value={nin ?? ''}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 11);
              setNin(val);
              setNinVerified(false);
              setVerifiedNinName('');
              setNinError('');
            }}
            disabled={ninVerified}
            className={`${inputClass} flex-1 ${ninVerified ? 'bg-white/5 opacity-75' : ''} ${ninError ? 'border-[#EF4444]' : ''}`}
          />
          {!ninVerified ? (
            <button
              onClick={handleVerifyNin}
              className="px-5 py-3 bg-accent text-white rounded-lg font-semibold text-sm hover:bg-accent-dark transition-colors whitespace-nowrap"
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
          <div className="text-sm text-white font-medium">
            NIN verification complete.
            {verifiedNinName && (
              <p className="text-[#10B981] text-xs mt-0.5">
                Identity matched: {verifiedNinName} (NIMC record)
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-white mb-6">
        Account Setup
      </h2>

      <div>
        <label className={labelClass}>Email Address</label>
        <input
          type="email"
          placeholder="e.g. johnfixer@email.com"
          value={email ?? ''}
          onChange={(e) => setEmail(e.target.value)}
          className={`${inputClass} ${errors.email ? 'border-[#EF4444]' : ''}`}
        />
        <p className="text-xs text-muted mt-1.5">
          You'll use this to log in to your KWIKFIX account.
        </p>
        {renderError('email')}
      </div>

      <div>
        <label className={labelClass}>Password</label>
        <input
          type="password"
          placeholder="At least 6 characters"
          value={password ?? ''}
          onChange={(e) => setPassword(e.target.value)}
          className={`${inputClass} ${errors.password ? 'border-[#EF4444]' : ''}`}
        />
        {renderError('password')}
      </div>

      <div>
        <label className={labelClass}>Confirm Password</label>
        <input
          type="password"
          placeholder="Re-enter your password"
          value={confirmPassword ?? ''}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={`${inputClass} ${errors.confirmPassword ? 'border-[#EF4444]' : ''}`}
        />
        {renderError('confirmPassword')}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-white mb-6">Final Setup</h2>

      <div className="flex flex-col items-center mb-6">
        <div
          className="w-24 h-24 rounded-full bg-navy-800 border-2 border-dashed border-white/15 flex items-center justify-center cursor-pointer hover:border-accent transition-all overflow-hidden"
          onClick={() => profilePicInputRef.current?.click()}
        >
          {profilePicture ? (
            <img
              src={profilePicture}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center text-muted">
              <Camera size={28} />
              <span className="text-xs mt-1">Upload</span>
            </div>
          )}
        </div>
        <input
          ref={profilePicInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleProfilePicFile}
        />
        <p className="text-xs text-muted mt-2">Tap to choose a profile picture</p>
      </div>

      <div>
        <label className={labelClass}>Username</label>
        <input
          type="text"
          placeholder="e.g. johnfixer"
          value={username ?? ''}
          onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
          className={`${inputClass} ${errors.username ? 'border-[#EF4444]' : ''}`}
        />
        {renderError('username')}
      </div>

      <div>
        <label className={labelClass}>App Permissions</label>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-4 rounded-xl border border-white/15 cursor-pointer hover:border-accent transition-all">
            <div>
              <p className="font-medium text-white text-sm">Location</p>
              <p className="text-xs text-muted">
                Allow access to your location
              </p>
            </div>
            <div
              onClick={() => setLocationPermission(!locationPermission)}
              className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${
                locationPermission ? 'bg-[#10B981]' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow transition-transform ${
                  locationPermission ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </div>
          </label>
          <label className="flex items-center justify-between p-4 rounded-xl border border-white/15 cursor-pointer hover:border-accent transition-all">
            <div>
              <p className="font-medium text-white text-sm">Audio</p>
              <p className="text-xs text-muted">
                Allow access to microphone
              </p>
            </div>
            <div
              onClick={() => setAudioPermission(!audioPermission)}
              className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${
                audioPermission ? 'bg-[#10B981]' : 'bg-white/20'
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
                ? 'bg-accent border-accent'
                : 'border-white/25 bg-navy-800'
            }`}
          >
            {acceptTerms && <Check size={14} className="text-white" />}
          </div>
          <p className="text-sm text-muted">
            I accept the{' '}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowTermsModal(true);
              }}
              className="text-accent font-semibold underline"
            >
              Terms & Conditions
            </button>
          </p>
        </label>
        {renderError('acceptTerms')}
      </div>

      <button
        onClick={handleCreateAccount}
        disabled={creating}
        className="w-full py-4 bg-white text-navy rounded-2xl font-bold text-lg hover:bg-slate-100 transition-all shadow-lg disabled:opacity-60"
      >
        {creating ? 'Creating Account...' : 'Create Account'}
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
    <div className="min-h-screen bg-navy">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
          <h1 className="text-lg font-bold text-white">
            {view === 'login' ? 'Handyman Login' : 'Handyman Registration'}
          </h1>
          <div className="w-10" />
        </div>

        <div className="grid grid-cols-2 gap-2 mb-6 bg-navy-800 border border-white/10 rounded-xl p-1.5">
          <button
            onClick={() => setView('signup')}
            className={`py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              view === 'signup' ? 'bg-accent text-white shadow-lg shadow-accent/30' : 'text-muted hover:text-white'
            }`}
          >
            Register
          </button>
          <button
            onClick={() => setView('login')}
            className={`py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              view === 'login' ? 'bg-accent text-white shadow-lg shadow-accent/30' : 'text-muted hover:text-white'
            }`}
          >
            Log In
          </button>
        </div>

        {view === 'login' ? (
          <div className="bg-navy-800 rounded-2xl p-6 border border-white/10 shadow-sm">
            {renderLoginView()}
          </div>
        ) : (
          <>
            {renderStepIndicator()}

            <div className="bg-navy-800 rounded-2xl p-6 border border-white/10 shadow-sm">
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
                        ? 'bg-white/5 text-muted/50 cursor-not-allowed'
                        : 'bg-white/10 border border-white/15 text-white hover:bg-white/20'
                    }`}
                >
                  <ChevronLeft size={18} />
                  Back
                </button>
                <button
                  onClick={handleContinue}
                  className="px-8 py-3 bg-accent text-white rounded-xl font-semibold text-sm hover:bg-accent-dark transition-all flex items-center gap-2 shadow-lg shadow-accent/30"
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
                  className="px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 bg-white/10 border border-white/15 text-white hover:bg-white/20"
                >
                  <ChevronLeft size={18} />
                  Back
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showTermsModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-navy-800 border border-white/10 rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h3 className="font-bold text-white text-lg">
                Terms & Conditions
              </h3>
              <button
                onClick={() => setShowTermsModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} className="text-muted" />
              </button>
            </div>
            <div className="overflow-y-auto p-5 text-sm text-muted leading-relaxed space-y-4">
              {TERMS_TEXT.split('\n\n').map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
            <div className="p-5 border-t border-white/10">
              <button
                onClick={() => setShowTermsModal(false)}
                className="w-full py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent-dark transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-navy-800 border border-white/10 rounded-2xl p-8 w-full max-w-sm text-center">
            <div className="w-20 h-20 rounded-full bg-[#10B981]/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={48} className="text-[#10B981]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Account Created Successfully!
            </h2>
            <p className="text-muted text-sm mb-6">
              Welcome to KWIKFIX! Your handyman profile has been created. We've sent a verification link to your email — click it before accepting jobs.
            </p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/handyman/dashboard');
              }}
              className="w-full py-3 bg-white text-navy rounded-2xl font-bold hover:bg-slate-100 transition-all"
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
