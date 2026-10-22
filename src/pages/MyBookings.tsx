import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Bus, Calendar, MapPin, Ticket, XCircle } from 'lucide-react';

const MyBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const res = await API.get('/bookings/my');
      setBookings(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [token, navigate]);

  const handleCancel = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking? 10% cancellation fee applies.')) return;
    try {
      await API.post(`/bookings/${bookingId}/cancel`);
      alert('Booking cancelled successfully');
      fetchBookings();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Cancellation failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfaf5]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b82025]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfaf5] py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">My Bookings</h2>

        {bookings.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center">
            <Ticket size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No Bookings Yet</h3>
            <p className="text-gray-500 mb-6">Looks like you haven't booked any tickets.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-[#b82025] text-white px-6 py-2 rounded-lg hover:bg-[#991b1f] transition shadow-md"
            >
              Book a Ticket
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((b) => (
              <div key={b.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                
                {/* Ticket Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-[#b82025] font-bold">
                    <Bus size={20} />
                    <span>S Antony Travels</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      b.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                      b.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                    {b.status}
                  </span>
                </div>

                {/* Ticket Body */}
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        {b.trip.route.source} <MapPin size={16} className="text-gray-400"/> {b.trip.route.destination}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <Calendar size={14} /> {new Date(b.trip.journeyDate).toDateString()} | {b.trip.departureTime}
                      </p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Booking ID</p>
                      <p className="font-mono text-sm font-semibold text-gray-800">{b.id.split('-')[0].toUpperCase()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Bus / Type</p>
                      <p className="font-semibold text-gray-800 text-sm">{b.trip.bus.busNumber}</p>
                      <p className="text-xs text-gray-500">{b.trip.bus.busType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Seats</p>
                      <p className="font-semibold text-gray-800 text-sm">{b.passengers.map((p: any) => p.seatNumber).join(', ')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Boarding</p>
                      <p className="font-semibold text-gray-800 text-xs truncate" title={b.boardingPoint}>{b.boardingPoint || 'Default'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Total Fare</p>
                      <p className="font-bold text-[#b82025]">₹{b.totalAmount}</p>
                    </div>
                  </div>

                  {/* Passengers List */}
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-2">Passengers:</p>
                    <div className="flex flex-wrap gap-2">
                      {b.passengers.map((p: any, idx: number) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                          {p.name} ({p.age}, {p.gender})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Ticket Footer (Actions) */}
                {b.status !== 'CANCELLED' && (
                  <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-end">
                    <button
                      onClick={() => handleCancel(b.id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-semibold transition"
                    >
                      <XCircle size={16} /> Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;