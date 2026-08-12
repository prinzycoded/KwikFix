import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { formatNaira } from '../../lib/format';
import { useApp } from '../../contexts/AppContext';

const NIGERIAN_BANKS = ['Access Bank', 'First Bank of Nigeria', 'Guaranty Trust Bank (GTBank)', 'United Bank for Africa (UBA)', 'Zenith Bank', 'Polaris Bank', 'Fidelity Bank', 'Union Bank', 'Ecobank Nigeria', 'Stanbic IBTC Bank', 'Sterling Bank', 'Wema Bank', 'Keystone Bank', 'Unity Bank', 'Heritage Bank', 'Providus Bank', 'SunTrust Bank', 'Globus Bank', 'Titan Trust Bank', 'Lotus Bank', 'OPay Digital Services', 'PalmPay', 'Moniepoint Microfinance Bank', 'Kuda Microfinance Bank', 'Sparkle Microfinance Bank', 'VFD Microfinance Bank'];

function WithdrawFunds() {
  const navigate = useNavigate();
  const { addWithdrawal } = useApp();
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const inputClass = 'w-full px-4 py-3 rounded-lg border border-white/15 bg-navy-700 text-white placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm transition-all';
  const labelClass = 'block text-sm font-semibold text-white mb-1.5';
  const selectClass = 'w-full px-4 py-3 rounded-lg border border-white/15 bg-navy-700 text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm appearance-none cursor-pointer';

  const validate = () => {
    const e = {};
    const cleanedAccount = accountNumber.replace(/\s/g, '');
    if (cleanedAccount.length !== 10) e.accountNumber = 'Account number must be exactly 10 digits';
    if (!accountName.trim()) e.accountName = 'Account name is required';
    if (!bankName) e.bankName = 'Please select a bank';
    if (!amount || parseFloat(amount) <= 0) e.amount = 'Please enter a valid amount';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => { if (validate()) setShowConfirmModal(true); };
  const handleConfirm = async () => {
    setShowConfirmModal(false);
    setSubmitting(true);
    try {
      await addWithdrawal({
        accountNumber: accountNumber.replace(/\s/g, ''),
        accountName,
        bankName,
        amount: Number(amount),
      });
      setShowSuccess(true);
      setTimeout(() => { setShowSuccess(false); navigate(-1); }, 2500);
    } finally {
      setSubmitting(false);
    }
  };

  const renderError = (field) => {
    if (!errors[field]) return null;
    return <p className="text-[#EF4444] text-xs mt-1 flex items-center gap-1"><X size={12} />{errors[field]}</p>;
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-lg"><ChevronLeft size={24} className="text-white" /></button>
        <h1 className="text-2xl font-bold text-white">Withdraw Funds</h1>
      </div>

      <div className="bg-gradient-to-r from-navy-800 to-navy rounded-2xl p-6 mb-6 text-white border border-white/10">
        <p className="text-sm opacity-80 mb-1">Available Balance</p>
        <h2 className="text-3xl font-bold">{formatNaira(45200)}</h2>
        <p className="text-xs opacity-60 mt-1">Minimum withdrawal: {formatNaira(1000)}</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className={labelClass}>Account Number</label>
          <input type="text" inputMode="numeric" maxLength={10} placeholder="e.g. 0123456789" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))} className={inputClass} />
          {renderError('accountNumber')}
        </div>
        <div>
          <label className={labelClass}>Account Name</label>
          <input type="text" placeholder="e.g. Chinedu Okafor" value={accountName} onChange={(e) => setAccountName(e.target.value)} className={inputClass} />
          {renderError('accountName')}
        </div>
        <div>
          <label className={labelClass}>Select Bank</label>
          <select value={bankName} onChange={(e) => setBankName(e.target.value)} className={selectClass}>
            <option value="">Select your bank</option>
            {NIGERIAN_BANKS.map((bank) => (<option key={bank} value={bank} className="bg-navy-800">{bank}</option>))}
          </select>
          {renderError('bankName')}
        </div>
        <div>
          <label className={labelClass}>Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted">₦</span>
            <input type="number" min={1000} placeholder="e.g. 10000" value={amount} onChange={(e) => setAmount(e.target.value)} className={`${inputClass} pl-14`} />
          </div>
          {renderError('amount')}
        </div>

        <button onClick={handleSubmit} className="w-full py-4 bg-white text-navy rounded-2xl font-bold text-lg hover:bg-slate-100 transition-all shadow-lg">Submit Withdrawal Request</button>

        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-300">Processing Notice</p>
              <p className="text-xs text-amber-200/80 mt-1">Withdrawals are processed within 1-3 business days. A 2% commission fee applies to all completed jobs.</p>
            </div>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-navy-800 border border-white/10 rounded-2xl p-6 w-full max-w-sm text-center">
            <div className="w-16 h-16 rounded-full bg-amber-500/15 flex items-center justify-center mx-auto mb-4"><AlertTriangle size={32} className="text-amber-400" /></div>
            <h3 className="text-lg font-bold text-white mb-2">Confirm Withdrawal</h3>
            <div className="text-left space-y-2 mb-4 p-4 rounded-xl bg-navy-700">
              <div className="flex justify-between text-sm"><span className="text-muted">Account:</span><span className="font-medium text-white">{accountName} ({accountNumber})</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted">Bank:</span><span className="font-medium text-white">{bankName}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted">Amount:</span><span className="font-bold text-accent">{formatNaira(amount)}</span></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-2.5 border border-white/15 rounded-xl text-sm font-semibold text-muted hover:bg-white/5">Cancel</button>
              <button onClick={handleConfirm} disabled={submitting} className="flex-1 py-2.5 bg-accent text-white rounded-xl text-sm font-semibold hover:bg-accent-dark disabled:opacity-60">{submitting ? 'Submitting...' : 'Confirm'}</button>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-navy-800 border border-white/10 rounded-2xl p-8 w-full max-w-sm text-center">
            <div className="w-20 h-20 rounded-full bg-[#10B981]/15 flex items-center justify-center mx-auto mb-4"><CheckCircle size={48} className="text-[#10B981]" /></div>
            <h3 className="text-xl font-bold text-white mb-2">Request Submitted!</h3>
            <p className="text-sm text-muted">Your withdrawal of <span className="font-bold text-white">{formatNaira(amount)}</span> will be processed within 1-3 business days.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default WithdrawFunds;
