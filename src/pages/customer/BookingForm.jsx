import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, MapPin, Crosshair, AlertCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const timeOptions = [
  { label: '15 mins', value: '15' },
  { label: '30 mins', value: '30' },
  { label: '1 hour', value: '60' },
  { label: '2 hours', value: '120' },
  { label: '4+ hours', value: '240' },
  { label: 'Flexible', value: 'flexible' },
]

const baseField = 'w-full rounded-lg border bg-navy-700 text-white px-3 py-2 text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent resize-none transition-colors'

export default function BookingForm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isAuthenticated } = useAuth()
  const serviceName = searchParams.get('service') || ''

  const [address, setAddress] = useState('')
  const [description, setDescription] = useState('')
  const [hiringFor, setHiringFor] = useState('myself')
  const [useLiveLocation, setUseLiveLocation] = useState(false)
  const [fullAddress, setFullAddress] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [toolsRequired, setToolsRequired] = useState(false)
  const [privacy, setPrivacy] = useState('standard')
  const [errors, setErrors] = useState({})

  const today = new Date().toISOString().split('T')[0]

  const validate = () => {
    const e = {}
    if (!address.trim() && !useLiveLocation) e.address = 'Please enter your address'
    if (!description.trim()) e.description = 'Please describe the task briefly'
    if (!date) e.date = 'Please pick a date'
    if (!time) e.time = 'Please select a time'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      const finalAddress = hiringFor === 'someoneElse'
        ? fullAddress
        : (useLiveLocation ? 'Live location (shared when the handyman arrives)' : address)
      const params = new URLSearchParams({ service: serviceName, date, time, address: finalAddress })
      navigate(isAuthenticated ? `/matching?${params.toString()}` : `/auth?${params.toString()}`)
    }
  }

  const fieldClass = (hasError) =>
    `${baseField} ${hasError ? 'border-red-500/70 focus:ring-red-500/60' : 'border-white/15 focus:ring-accent'}`

  const renderError = (field) =>
    errors[field] ? (
      <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12} /> {errors[field]}</p>
    ) : null

  return (
    <div className="min-h-screen bg-navy">
      <div className="bg-navy-800 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-white">Book a Service</h1>
            {serviceName && <p className="text-sm text-accent font-medium">{serviceName}</p>}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-200 mb-1">Address <span className="text-accent">*</span></label>
              <textarea rows={2} placeholder="e.g. 12, Azikiwe Road, Umuahia, Abia State" value={address} onChange={(e) => { setAddress(e.target.value); setErrors((prev) => ({ ...prev, address: undefined })) }} className={fieldClass(errors.address)} />
              {renderError('address')}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-200 mb-1">Description of Task <span className="text-accent">*</span></label>
              <textarea rows={3} placeholder="e.g. I need someone to fix my kitchen sink" value={description} onChange={(e) => { setDescription(e.target.value); setErrors((prev) => ({ ...prev, description: undefined })) }} className={fieldClass(errors.description)} />
              {renderError('description')}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-200 mb-2">I am hiring for</label>
              <div className="flex gap-4 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="hiringFor" value="myself" checked={hiringFor === 'myself'} onChange={() => setHiringFor('myself')} className="accent-[#FF6B1A]" />
                  <span className="text-sm text-slate-200">Myself</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="hiringFor" value="someoneElse" checked={hiringFor === 'someoneElse'} onChange={() => setHiringFor('someoneElse')} className="accent-[#FF6B1A]" />
                  <span className="text-sm text-slate-200">Someone else</span>
                </label>
              </div>
              {hiringFor === 'myself' ? (
                <div className="mt-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={useLiveLocation} onChange={(e) => setUseLiveLocation(e.target.checked)} className="rounded accent-[#FF6B1A]" />
                    <MapPin className="w-4 h-4 text-accent" />
                    <span className="text-sm text-slate-200">Use My Live Location</span>
                  </label>
                  {useLiveLocation && <p className="mt-1 text-xs text-emerald-400 flex items-center gap-1"><Crosshair className="w-3 h-3" /> Live location enabled</p>}
                </div>
              ) : (
                <div className="mt-3">
                  <input type="text" placeholder="e.g. 7, Faulks Road, Aba" value={fullAddress} onChange={(e) => setFullAddress(e.target.value)} className={fieldClass(false)} />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">Date <span className="text-accent">*</span></label>
              <input type="date" min={today} value={date} onChange={(e) => { setDate(e.target.value); setErrors((prev) => ({ ...prev, date: undefined })) }} className={`${fieldClass(errors.date)} [color-scheme:dark]`} />
              {renderError('date')}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Time Request <span className="text-accent">*</span></label>
              <div className="flex flex-wrap gap-2">
                {timeOptions.map((opt) => (
                  <label key={opt.value} className={`px-4 py-2 rounded-full border text-sm cursor-pointer transition-colors ${time === opt.value ? 'bg-accent text-white border-accent' : 'bg-navy-800 text-muted border-white/15 hover:border-accent'}`}>
                    <input type="radio" name="time" value={opt.value} checked={time === opt.value} onChange={() => { setTime(opt.value); setErrors((prev) => ({ ...prev, time: undefined })) }} className="sr-only" />
                    {opt.label}
                  </label>
                ))}
              </div>
              {renderError('time')}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-200 mb-2">Will the handyman need to bring tools?</label>
              <div className="flex items-center gap-3">
                <span className={`text-sm ${!toolsRequired ? 'text-white font-medium' : 'text-muted'}`}>No</span>
                <button type="button" onClick={() => setToolsRequired(!toolsRequired)} className={`relative w-12 h-6 rounded-full transition-colors ${toolsRequired ? 'bg-accent' : 'bg-white/20'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${toolsRequired ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
                <span className={`text-sm ${toolsRequired ? 'text-white font-medium' : 'text-muted'}`}>Yes</span>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-200 mb-2">Privacy</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex items-start gap-3 p-3 rounded-lg border border-white/10 bg-navy-800 cursor-pointer hover:border-accent">
                  <input type="radio" name="privacy" value="standard" checked={privacy === 'standard'} onChange={() => setPrivacy('standard')} className="mt-0.5 accent-[#FF6B1A]" />
                  <div>
                    <span className="text-sm font-medium text-white">Standard</span>
                    <p className="text-xs text-muted mt-0.5">Your name and contact details will be shared with the handyman</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-3 rounded-lg border border-white/10 bg-navy-800 cursor-pointer hover:border-accent">
                  <input type="radio" name="privacy" value="anonymous" checked={privacy === 'anonymous'} onChange={() => setPrivacy('anonymous')} className="mt-0.5 accent-[#FF6B1A]" />
                  <div>
                    <span className="text-sm font-medium text-white">Anonymous</span>
                    <p className="text-xs text-muted mt-0.5">Your identity stays private until you accept a handyman</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <button type="submit" className="w-full px-12 py-4 bg-white text-navy font-bold rounded-2xl text-base hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-accent active:scale-[0.99]">
            Find a KWIKFIXER
          </button>
        </form>
      </div>
    </div>
  )
}
