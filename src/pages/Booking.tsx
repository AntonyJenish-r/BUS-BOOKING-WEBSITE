import { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MapPin, ArrowRight, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

const BOARDING_POINTS = ['Guindy (10:00 PM)', 'Egmore (10:30 PM)', 'Koyambedu (11:00 PM)'];
const DROPPING_POINTS = ['Majestic (05:30 AM)', 'Electronic City (06:00 AM)', 'Madiwala (06:30 AM)'];

const Booking = () => {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const seatNumbers: string[] = (params.get('seats') || '').split(',').filter(Boolean);

  const [passengers, setPassengers] = useState(
    seatNumbers.map((s: string) => ({ name: '', age: '', gender: 'Male', seatNumber: s }))
  );
  
  const [boardingPoint, setBoardingPoint] = useState('');
  const [droppingPoint, setDroppingPoint] = useState('');
  
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const baseFare = 1500; 
  const totalAmount = baseFare * seatNumbers.length;
  const finalAmount = totalAmount - discount;

  if (!token) {
    navigate('/login');
    return null;
  }

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...passengers];
    (updated[index] as any)[field] = value;
    setPassengers(updated);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setApplyingCoupon(true);
    setCouponMessage('');
    try {
      const res = await API.post('/coupons/validate', { code: couponCode, amount: totalAmount });
      setDiscount(res.data.discount);
      setCouponMessage(`Coupon applied! Saved ₹${res.data.discount}`);
      toast.success('Coupon Applied!');
    } catch (err: any) {
      setDiscount(0);
      setCouponMessage(err.response?.data?.message || 'Invalid coupon');
      toast.error('Invalid Coupon Code');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardingPoint || !droppingPoint) {
      setError('Please select boarding and dropping points.');
      toast.error('Select Boarding & Dropping Points');
      return;
    }
    
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      await API.post('/bookings/lock', { tripId: Number(id), seatNumbers });

      const bookingRes = await API.post('/bookings', {
        tripId: Number(id),
        seatNumbers,
        passengers: passengers.map((p: any) => ({ ...p, age: Number(p.age) })),
        boardingPoint,
        droppingPoint,
        couponCode: discount > 0 ? couponCode : undefined,
        discountAmount: discount
      });
      const bookingId = bookingRes.data.data.id;

      const orderRes = await API.post('/payments/create-order', { bookingId });
      const orderId = orderRes.data.data.id;

      await API.post('/payments/verify', {
        bookingId,
        razorpay_payment_id: 'mock_payment_' + Date.now(),
        razorpay_order_id: orderId,
        razorpay_signature: 'mock_signature',
      });

      toast.success('Booking Confirmed!');
      navigate('/my-bookings');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Booking failed. Please try again.');
      toast.error('Booking Failed');
      setLoading(false);
    }
  };

  return (
    /* PUDHU: px-4 and overflow-hidden add panniruken */
    <div className="min-h-screen bg-[#fdfaf5] py-8 px-2 md:px-4 overflow-hidden">
      <div className="container mx-auto max-w-3xl">
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Complete Your Booking</h2>
          <p className="text-gray-500 text-sm mt-1">Selected Seats: {seatNumbers.join(', ')}</p>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</div>}

        {/* PUDHU: p-4 md:p-8 nu maathiruken */}
        <form onSubmit={handleSubmit} className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 bg-gray-50 p-4 md:p-5 rounded-xl border border-gray-200">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1">
                <MapPin size={16} className="text-[#b82025]" /> Boarding Point
              </label>
              <select value={boardingPoint} onChange={(e) => setBoardingPoint(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#b82025] bg-white text-sm" required>
                <option value="" disabled>Select Boarding Point</option>
                {BOARDING_POINTS.map((pt) => <option key={pt} value={pt}>{pt}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1">
                <MapPin size={16} className="text-[#b82025]" /> Dropping Point
              </label>
              <select value={droppingPoint} onChange={(e) => setDroppingPoint(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#b82025] bg-white text-sm" required>
                <option value="" disabled>Select Dropping Point</option>
                {DROPPING_POINTS.map((pt) => <option key={pt} value={pt}>{pt}</option>)}
              </select>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Passenger Details</h3>
            <div className="space-y-4">
              {passengers.map((p, i) => (
                <div key={i} className="bg-white border border-gray-100 p-3 md:p-4 rounded-xl shadow-sm">
                  <h4 className="font-bold text-[#b82025] mb-3">Seat {p.seatNumber}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                    <input type="text" placeholder="Full Name" value={p.name} onChange={(e) => handleChange(i, 'name', e.target.value)} className="p-3 border rounded-lg focus:ring-2 focus:ring-[#b82025] bg-gray-50 text-sm w-full" required />
                    <input type="number" placeholder="Age" value={p.age} onChange={(e) => handleChange(i, 'age', e.target.value)} className="p-3 border rounded-lg focus:ring-2 focus:ring-[#b82025] bg-gray-50 text-sm w-full" required />
                    <select value={p.gender} onChange={(e) => handleChange(i, 'gender', e.target.value)} className="p-3 border rounded-lg focus:ring-2 focus:ring-[#b82025] bg-gray-50 text-sm w-full">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-4 md:p-5 rounded-xl border border-gray-200">
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1">
              <Tag size={16} className="text-[#b82025]" /> Apply Coupon
            </label>
            
            {/* PUDHU: Mobile la flex-col ah maarum, min-w-0 add panniruken */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="text" 
                placeholder="Enter code (e.g., DIWALI20)" 
                value={couponCode} 
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())} 
                className="flex-1 min-w-0 p-3 border rounded-lg focus:ring-2 focus:ring-[#b82025] bg-white text-sm" 
              />
              <button 
                type="button" 
                onClick={handleApplyCoupon} 
                disabled={applyingCoupon} 
                className="bg-gray-800 text-white px-6 py-3 sm:py-2 rounded-lg hover:bg-gray-900 transition text-sm w-full sm:w-auto"
              >
                {applyingCoupon ? 'Checking...' : 'Apply'}
              </button>
            </div>
            {couponMessage && (
              <p className={`text-sm mt-2 font-medium ${discount > 0 ? 'text-green-600' : 'text-red-500'}`}>{couponMessage}</p>
            )}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between text-gray-600 mb-2 text-sm md:text-base">
              <span>Base Fare ({seatNumbers.length} seats):</span>
              <span>₹{totalAmount}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600 mb-2 text-sm md:text-base">
                <span>Discount:</span>
                <span>- ₹{discount}</span>
              </div>
            )}
            <div className="flex justify-between text-lg md:text-xl font-bold text-gray-800 mt-2">
              <span>Total Payable:</span>
              <span className="text-[#b82025]">₹{finalAmount}</span>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#b82025] text-white p-3 md:p-4 rounded-xl hover:bg-[#991b1f] font-bold text-base md:text-lg transition-all shadow-md flex justify-center items-center gap-2 disabled:bg-gray-400">
            {loading ? 'Processing Payment...' : 'Confirm & Pay'} <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Booking;