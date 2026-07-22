import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, MapPin, Crosshair } from 'lucide-react'

const timeOptions = [
  { label: '15 mins', value: '15' },
  { label: '30 mins', value: '30' },
  { label: '1 hour', value: '60' },
  { label: '2 hours', value: '120' },
  { label: '4+ hours', value: '240' },
  { label: 'Flexible', value: 'flexible' },
]

export default function BookingForm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
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

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/auth')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1">
            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Book a Service</h1>
            {serviceName && <p className="text-sm text-[#FF6600] font-medium">{serviceName}</p>}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
              <textarea rows={2} placeholder="e.g. 123 Main Street, Ikeja, Lagos" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#003366] resize-none" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description of Task</label>
              <textarea rows={3} placeholder="e.g. I need someone to fix my kitchen sink" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#003366] resize-none" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">I am hiring for</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="hiringFor" value="myself" checked={hiringFor === 'myself'} onChange={() => setHiringFor('myself')} className="accent-[#003366]" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Myself</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="hiringFor" value="someoneElse" checked={hiringFor === 'someoneElse'} onChange={() => setHiringFor('someoneElse')} className="accent-[#003366]" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Someone else</span>
                </label>
              </div>
              {hiringFor === 'myself' ? (
                <div className="mt-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={useLiveLocation} onChange={(e) => setUseLiveLocation(e.target.checked)} className="rounded accent-[#003366]" />
                    <MapPin className="w-4 h-4 text-[#FF6600]" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Use My Live Location</span>
                  </label>
                  {useLiveLocation && <p className="mt-1 text-xs text-green-600 flex items-center gap-1"><Crosshair className="w-3 h-3" /> Live location enabled</p>}
                </div>
              ) : (
                <div className="mt-3">
                  <input type="text" placeholder="e.g. 45 Adeola Odeku Street" value={fullAddress} onChange={(e) => setFullAddress(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time Request</label>
              <div className="flex flex-wrap gap-2">
                {timeOptions.map((opt) => (
                  <label key={opt.value} className={`px-4 py-2 rounded-full border text-sm cursor-pointer transition-colors ${time === opt.value ? 'bg-[#003366] text-white border-[#003366]' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-[#FF6600]'}`}>
                    <input type="radio" name="time" value={opt.value} checked={time === opt.value} onChange={() => setTime(opt.value)} className="sr-only" />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Will the handyman need to bring tools?</label>
              <div className="flex items-center gap-3">
                <span className={`text-sm ${!toolsRequired ? 'text-[#003366] dark:text-white font-medium' : 'text-gray-500'}`}>No</span>
                <button type="button" onClick={() => setToolsRequired(!toolsRequired)} className={`relative w-12 h-6 rounded-full transition-colors ${toolsRequired ? 'bg-[#003366]' : 'bg-gray-300'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${toolsRequired ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
                <span className={`text-sm ${toolsRequired ? 'text-[#003366] dark:text-white font-medium' : 'text-gray-500'}`}>Yes</span>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Privacy</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:border-[#FF6600]">
                  <input type="radio" name="privacy" value="standard" checked={privacy === 'standard'} onChange={() => setPrivacy('standard')} className="mt-0.5 accent-[#003366]" />
                  <div>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Standard</span>
                    <p className="text-xs text-gray-500 mt-0.5">Your name and contact details will be shared with the handyman</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:border-[#FF6600]">
                  <input type="radio" name="privacy" value="anonymous" checked={privacy === 'anonymous'} onChange={() => setPrivacy('anonymous')} className="mt-0.5 accent-[#003366]" />
                  <div>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Anonymous</span>
                    <p className="text-xs text-gray-500 mt-0.5">Your identity stays private until you accept a handyman</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <button type="submit" className="w-full md:w-auto px-12 py-3.5 bg-[#003366] text-white font-semibold rounded-lg text-base hover:bg-[#002244] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF6600] focus:ring-offset-2">
            Find a Kwikfixer
          </button>
        </form>
      </div>
    </div>
  )
}
