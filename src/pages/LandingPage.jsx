import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wrench, Zap, Settings, Hammer, AlertTriangle, Shield, Clock, BadgeCheck,
  Star, ArrowRight, Menu, X, Phone, Mail, MapPin, CheckCircle2, Users, Home, Search
} from 'lucide-react';

const services = [
  { name: 'Plumbing', icon: Wrench, desc: 'Leaks, pipes, fittings & installations' },
  { name: 'Electrical', icon: Zap, desc: 'Wiring, switches, lighting & repairs' },
  { name: 'Generator Repair', icon: Settings, desc: 'Servicing, fault diagnosis & fixes' },
  { name: 'Carpentry', icon: Hammer, desc: 'Furniture, shelves & woodwork' },
];

const steps = [
  { title: 'Choose a service', desc: 'Pick the exact service you need in seconds.', icon: Search },
  { title: 'Get matched fast', desc: 'We connect you with a verified handyman near you.', icon: Users },
  { title: 'Job done, job paid', desc: 'Transparent pricing. Pay securely when satisfied.', icon: BadgeCheck },
];

const features = [
  { title: 'Verified Professionals', desc: 'Every handyman is background-checked and vetted before joining.', icon: Shield },
  { title: 'Fast Response', desc: 'Quick, reliable response for urgent jobs.', icon: Clock },
  { title: 'Transparent Pricing', desc: 'Clear quotes up front. No hidden fees, ever.', icon: BadgeCheck },
  { title: 'Satisfaction Guarantee', desc: 'Not happy with the work? We make it right or refund you.', icon: CheckCircle2 },
];

const stats = [
  { value: '0', label: 'Jobs completed' },
  { value: '0', label: 'Verified handymen' },
  { value: '0 min', label: 'Avg. response time' },
  { value: '0.0/5', label: 'Customer rating' },
];
import { Wrench, Shield, ArrowRight, Star, Users, Zap, MapPin, Clock, CheckCircle, Search } from 'lucide-react';
import heroImg from '../assets/Kwik.img.png';

export default function LandingPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F4F4F9] dark:bg-gray-950 text-gray-900 dark:text-white">
      <header className="sticky top-0 z-50 bg-[#F4F4F9]/90 dark:bg-gray-950/90 backdrop-blur border-b border-gray-200/60 dark:border-gray-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-[#003366] flex items-center justify-center">
              <Wrench className="w-5 h-5 text-[#FF6600]" />
            </span>
            <span className="text-xl font-bold tracking-tight">Kwik<span className="text-[#FF6600]">Fix</span></span>
          </button>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700 dark:text-gray-300">
            <button onClick={() => scrollTo('services')} className="hover:text-[#FF6600] transition-colors">Services</button>
            <button onClick={() => scrollTo('how-it-works')} className="hover:text-[#FF6600] transition-colors">How it works</button>
            <button onClick={() => scrollTo('why-us')} className="hover:text-[#FF6600] transition-colors">Why KwikFix</button>
            <button onClick={() => scrollTo('reviews')} className="hover:text-[#FF6600] transition-colors">Reviews</button>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate('/handyman/login')}
              className="text-sm font-semibold text-[#003366] dark:text-white border-2 border-[#003366] dark:border-white px-5 py-2 rounded-xl hover:bg-[#003366] hover:text-white dark:hover:bg-white dark:hover:text-[#003366] transition-colors"
            >
              I offer services
            </button>
            <button
              onClick={() => navigate('/service-selection')}
              className="bg-[#FF6600] text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-[#e05500] transition-colors shadow-lg shadow-[#FF6600]/25 border-2 border-[#FF6600]"
            >
              Book a handyman
            </button>
          </div>

          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-gray-200/60 dark:border-gray-800/60 bg-[#F4F4F9] dark:bg-gray-950 px-4 py-4 flex flex-col gap-3">
            <button onClick={() => scrollTo('services')} className="text-left px-3 py-2 rounded-lg hover:bg-gray-200/60 dark:hover:bg-gray-800 font-medium">Services</button>
            <button onClick={() => scrollTo('how-it-works')} className="text-left px-3 py-2 rounded-lg hover:bg-gray-200/60 dark:hover:bg-gray-800 font-medium">How it works</button>
            <button onClick={() => scrollTo('why-us')} className="text-left px-3 py-2 rounded-lg hover:bg-gray-200/60 dark:hover:bg-gray-800 font-medium">Why KwikFix</button>
            <button onClick={() => scrollTo('reviews')} className="text-left px-3 py-2 rounded-lg hover:bg-gray-200/60 dark:hover:bg-gray-800 font-medium">Reviews</button>
            <button
              onClick={() => navigate('/handyman/login')}
              className="mt-1 bg-[#003366] text-white font-semibold py-3 rounded-xl"
            >
              I offer services
            </button>
            <button
              onClick={() => navigate('/service-selection')}
              className="bg-[#FF6600] text-white font-semibold py-3 rounded-xl"
            >
              Book a handyman
            </button>
          </div>
        )}
      </header>

      <section className="bg-gradient-to-br from-[#003366] via-[#004080] to-[#001a33] text-white relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#FF6600]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-24 w-96 h-96 bg-[#FF6600]/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide">
              <Star className="w-3.5 h-3.5 text-[#FF6600] fill-[#FF6600]" />
              Trusted home repairs, on demand
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              Your home deserves a <span className="text-[#FF6600]">KwikFix</span>
            </h1>
            <p className="mt-5 text-lg text-white/80 max-w-xl leading-relaxed">
              Book verified handymen for plumbing, electrical, carpentry and generator repairs.
              Fast matching, transparent pricing, guaranteed work.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/service-selection')}
                className="inline-flex items-center justify-center gap-2 bg-[#FF6600] text-white font-bold px-8 py-4 rounded-2xl hover:bg-[#e05500] transition-colors shadow-xl shadow-[#FF6600]/30"
              >
                Book a handyman <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/handyman/login')}
                className="inline-flex items-center justify-center gap-2 border-2 border-white/25 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/10 transition-colors"
              >
                I offer services
              </button>
            </div>

            <div className="mt-10 flex items-center gap-3 text-sm text-white/70">
              <BadgeCheck className="w-5 h-5 text-emerald-400" />
              Satisfaction guaranteed on every job
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#FF6600]/40 via-transparent to-sky-400/30 rounded-[2.5rem] blur-2xl" />

            <div className="relative bg-white/10 border border-white/15 backdrop-blur rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/60 font-medium uppercase tracking-wider">Matched handyman</p>
                  <p className="mt-1 text-2xl font-bold">Your handyman</p>
                </div>
                <span className="w-14 h-14 rounded-2xl bg-[#FF6600] flex items-center justify-center">
                  <Wrench className="w-7 h-7 text-white" />
                </span>
              </div>

              <div className="mt-6 flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3 border border-white/10">
                <BadgeCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">Verified professional</p>
                  <p className="text-xs text-white/60">Background checked · vetted by KwikFix</p>
                </div>
                <span className="text-xs font-bold bg-[#FF6600] px-3 py-1 rounded-full">New</span>
              </div>

              <div className="mt-4 flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3 border border-white/10">
                <span className="w-9 h-9 rounded-xl bg-[#FF6600]/20 flex items-center justify-center">
                  <Zap className="w-4.5 h-4.5 text-[#FF6600]" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">Plumbing · Kitchen sink leak</p>
                  <p className="text-xs text-white/60">Agreed quote before work begins</p>
                </div>
              </div>

              <button className="mt-6 w-full bg-[#FF6600] text-white font-bold py-3.5 rounded-2xl hover:bg-[#e05500] transition-colors shadow-lg shadow-[#FF6600]/30">
                Track my handyman
              </button>
            </div>

            <div className="absolute -top-6 -right-4 bg-white dark:bg-gray-900 rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 animate-bounce">
              <span className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </span>
              <div>
                <p className="font-bold text-sm">Job completed</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Satisfaction guaranteed</p>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-5 bg-white dark:bg-gray-900 rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-[#FF6600]/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#FF6600]" />
              </span>
              <div>
                <p className="font-bold text-sm">Fast service</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">matched with pros near you</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/10 pt-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-[#FF6600]">{s.value}</p>
                <p className="text-sm text-white/70 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-sm font-bold text-[#FF6600] uppercase tracking-widest">Our services</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">Fix anything, fast</h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            From small repairs to big installations — our vetted handymen handle it all.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <button
              key={service.name}
              onClick={() => navigate(`/booking-form?service=${service.key}`)}
              className="group bg-white dark:bg-gray-900 rounded-2xl p-8 text-left border border-gray-200/70 dark:border-gray-800 hover:border-[#FF6600] hover:shadow-xl hover:shadow-[#FF6600]/10 transition-all"
            >
              <span className="w-14 h-14 rounded-xl bg-[#003366] dark:bg-[#003366]/80 flex items-center justify-center group-hover:bg-[#FF6600] transition-colors">
                <service.icon className="w-7 h-7 text-[#FF6600] group-hover:text-white transition-colors" />
              </span>
              <h3 className="mt-5 text-lg font-bold">{service.name}</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{service.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#FF6600]">
                Book now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate('/diy-sos')}
          className="mt-6 w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          <AlertTriangle className="w-5 h-5" />
          Emergency? Try DIY SOS — instant step-by-step help
        </button>
      </section>

      <section id="how-it-works" className="bg-white dark:bg-gray-900 border-y border-gray-200/70 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-sm font-bold text-[#FF6600] uppercase tracking-widest">How it works</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">Repairs in 3 simple steps</h2>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.title} className="relative text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#003366] flex items-center justify-center shadow-lg">
                  <step.icon className="w-8 h-8 text-[#FF6600]" />
                </div>
                <span className="mt-4 inline-block bg-[#FF6600]/10 text-[#FF6600] text-xs font-bold px-3 py-1 rounded-full">
                  Step {i + 1}
                </span>
                <h3 className="mt-2 text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">{step.desc}</p>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-6 w-5 h-5 text-gray-300 dark:text-gray-700" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="why-us" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-sm font-bold text-[#FF6600] uppercase tracking-widest">Why KwikFix</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
              Professional standards, <span className="text-[#FF6600]">neighbor-friendly</span> prices
            </h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400 leading-relaxed">
              We built KwikFix to take the guesswork out of home repairs. Every handyman is verified,
              every job is backed by a satisfaction guarantee, and every price is agreed before work begins.
            </p>
            <button
              onClick={() => navigate('/service-selection')}
              className="mt-8 inline-flex items-center gap-2 bg-[#003366] text-white font-bold px-7 py-3.5 rounded-2xl hover:bg-[#004488] transition-colors"
            >
              Get started <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {features.map((f) => (
              <div key={f.title} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200/70 dark:border-gray-800 hover:shadow-lg transition-shadow">
                <span className="w-11 h-11 rounded-xl bg-[#FF6600]/10 flex items-center justify-center">
                  <f.icon className="w-5.5 h-5.5 text-[#FF6600]" />
                </span>
                <h3 className="mt-4 font-bold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="reviews" className="bg-[#003366] text-white overflow-hidden relative">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#FF6600]/15 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-sm font-bold text-[#FF6600] uppercase tracking-widest">Reviews</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">Customer reviews</h2>
          </div>

          <div className="mt-12 max-w-xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-10 text-center backdrop-blur">
            <span className="w-14 h-14 mx-auto rounded-2xl bg-[#FF6600]/15 flex items-center justify-center">
              <Star className="w-7 h-7 text-[#FF6600]" />
            </span>
            <h3 className="mt-4 text-lg font-bold">No reviews yet</h3>
            <p className="mt-2 text-sm text-white/60 leading-relaxed">
              Reviews from verified customers will appear here as soon as the first jobs are completed.
            </p>
            <button
              onClick={() => navigate('/service-selection')}
              className="mt-6 inline-flex items-center gap-2 bg-[#FF6600] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#e05500] transition-colors"
            >
              Book your first service <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="relative bg-gradient-to-r from-[#FF6600] to-[#ff8c33] rounded-3xl overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          <div className="relative px-8 py-12 sm:px-12 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Are you a skilled handyman?</h2>
              <p className="mt-2 text-white/90">Join a growing network of verified professionals earning on KwikFix today.</p>
            </div>
            <button
              onClick={() => navigate('/handyman/login')}
              className="shrink-0 inline-flex items-center gap-2 bg-white text-[#FF6600] font-bold px-8 py-4 rounded-2xl hover:bg-gray-50 transition-colors shadow-lg"
            >
              <Home className="w-5 h-5" />
              Become a handyman
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-[#001a33] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                <Wrench className="w-5 h-5 text-[#FF6600]" />
              </span>
              <span className="text-xl font-bold tracking-tight">Kwik<span className="text-[#FF6600]">Fix</span></span>
            </div>
            <p className="mt-4 text-sm text-white/60 leading-relaxed">
              Connecting trusted handymen with homeowners who need quick, quality repairs.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-white/90">Services</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-white/60">
              <li><button onClick={() => navigate('/booking-form?service=plumbing')} className="hover:text-[#FF6600] transition-colors">Plumbing</button></li>
              <li><button onClick={() => navigate('/booking-form?service=electrical')} className="hover:text-[#FF6600] transition-colors">Electrical</button></li>
              <li><button onClick={() => navigate('/booking-form?service=generator_repair')} className="hover:text-[#FF6600] transition-colors">Generator Repair</button></li>
              <li><button onClick={() => navigate('/booking-form?service=carpentry')} className="hover:text-[#FF6600] transition-colors">Carpentry</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-white/90">Company</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-white/60">
              <li><button onClick={() => scrollTo('how-it-works')} className="hover:text-[#FF6600] transition-colors">How it works</button></li>
              <li><button onClick={() => scrollTo('why-us')} className="hover:text-[#FF6600] transition-colors">Why KwikFix</button></li>
              <li><button onClick={() => navigate('/handyman/login')} className="hover:text-[#FF6600] transition-colors">Become a handyman</button></li>
              <li><button onClick={() => scrollTo('reviews')} className="hover:text-[#FF6600] transition-colors">Reviews</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-white/90">Contact</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-white/60">
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#FF6600]" /> 0800-KWIKFIX</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#FF6600]" /> hello@kwikfix.ng</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#FF6600]" /> Lagos, Nigeria</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
            <p>© {new Date().getFullYear()} KwikFix. All rights reserved.</p>
            <p>Connecting Professionals & Clients</p>
          </div>
        </div>
      </footer>
    <div className="min-h-screen bg-[#003366]">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left: Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 lg:py-0">
          <div className="w-full max-w-md flex flex-col items-center lg:items-start">

            <div className="flex items-center gap-2 mb-2">
              <Wrench className="w-8 h-8 text-[#FF6600]" />
              <span className="text-3xl font-bold text-white">
                Kwik<span className="text-[#FF6600]">Fix</span>
              </span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-white text-center lg:text-left leading-tight">
              Your Home.
              <br />
              <span className="text-[#FF6600]">Our Pros.</span>
            </h1>

            <p className="mt-4 text-white/70 text-sm leading-relaxed max-w-sm text-center lg:text-left">
              We connect you with trusted, vetted handymen in your area — so you can fix, build, and improve your home without the hassle.
            </p>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mt-8 w-full max-w-sm">
              {[
                { icon: Star, label: 'Verified Pros', color: 'text-[#FFD54F]' },
                { icon: Zap, label: 'Fast Matching', color: 'text-[#FF6600]' },
                { icon: Users, label: 'Local Experts', color: 'text-[#4FC3F7]' },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-sm hover:bg-white/20 hover:scale-110 transition-all duration-200">
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <span className="text-white/60 text-[10px] text-center leading-tight font-medium">{label}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="w-full flex flex-col gap-3 mt-8 max-w-sm">
              <button
                onClick={() => navigate('/service-selection')}
                className="w-full bg-white rounded-2xl px-6 py-4 flex items-center gap-3 cursor-pointer shadow-lg font-semibold text-base text-[#003366] hover:bg-gray-50 transition-all active:scale-[0.98] group"
              >
                <div className="bg-[#003366]/10 rounded-xl p-2">
                  <Search size={20} className="text-[#003366]" />
                </div>
                <span className="flex-1 text-left">Looking For Service</span>
                <ArrowRight size={18} className="text-[#003366]/40 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/handyman/login')}
                className="w-full bg-[#FF6600] rounded-2xl px-6 py-4 flex items-center gap-3 cursor-pointer shadow-lg font-semibold text-base text-white hover:bg-[#e05500] transition-all active:scale-[0.98] group"
              >
                <div className="bg-white/20 rounded-xl p-2">
                  <Shield size={20} className="text-white" />
                </div>
                <span className="flex-1 text-left">Offering Service</span>
                <ArrowRight size={18} className="text-white/60 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-5 mt-6 text-white/40 text-xs flex-wrap justify-center lg:justify-start">
              <span className="flex items-center gap-1.5">
                <MapPin size={12} /> Abia state,Nigeria.
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={12} /> Avg. 15min response
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle size={12} /> 4.8 ★ rating
              </span>
            </div>

            <p className="text-white/20 text-xs mt-8 pb-4 text-center lg:text-left">Connecting Professionals & Clients</p>
          </div>
        </div>

        {/* Right: Hero Image */}
        <div className="relative flex-1 min-h-[40vh] lg:min-h-screen overflow-hidden">
          <img
            src={heroImg}
            alt="Professional handyman tools and equipment"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#003366] via-[#003366]/30 to-transparent lg:bg-gradient-to-r lg:from-[#003366] lg:via-[#003366]/50 lg:to-transparent" />
        </div>
      </div>
    </div>
  );
}
