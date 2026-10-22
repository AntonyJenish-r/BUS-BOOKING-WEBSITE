import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { ArrowRight, Clock, Star, Bus } from 'lucide-react';

const SearchResults = () => {
  const [params] = useSearchParams();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const from = params.get('from');
  const to = params.get('to');
  const date = params.get('date');

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await API.get(`/trips/search?from=${from}&to=${to}`);
        setTrips(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, [from, to]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b82025]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfaf5] py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              {from} <ArrowRight size={20} className="text-gray-400" /> {to}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {date ? new Date(date).toDateString() : 'Select Date'} • {trips.length} Buses found
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="mt-3 md:mt-0 text-[#b82025] font-semibold text-sm hover:underline"
          >
            Modify Search
          </button>
        </div>

        {/* Bus List */}
        {trips.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow-sm text-center border border-gray-100">
            <Bus size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No Buses Found</h3>
            <p className="text-gray-500 mb-6">We couldn't find any buses for this route on the selected date.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-[#b82025] text-white px-6 py-2 rounded-lg hover:bg-[#991b1f] transition shadow-md"
            >
              Go Back Home
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                {/* Left: Bus Details */}
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-gray-800">
                      {trip.bus.busNumber}
                    </h3>
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded font-medium">
                      {trip.bus.busType}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                    <Bus size={14} /> {trip.bus.operator?.name || 'S Antony Travels'}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm font-medium text-gray-700 bg-gray-50 p-3 rounded-lg w-fit">
                    <div className="flex items-center gap-1">
                      <Clock size={14} className="text-[#b82025]" /> 
                      {trip.departureTime}
                    </div>
                    <div className="text-gray-300">---</div>
                    <div className="flex items-center gap-1">
                      {trip.arrivalTime}
                    </div>
                  </div>
                </div>

                {/* Right: Price and Action */}
                <div className="flex md:flex-col justify-between items-center md:items-end w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                  <div className="text-left md:text-right mb-0 md:mb-3">
                    <p className="text-2xl font-bold text-[#b82025]">₹{trip.fare}</p>
                    <p className="text-xs text-gray-500">per seat</p>
                  </div>
                  <button
                    onClick={() => navigate(`/bus/${trip.id}`)}
                    className="bg-[#b82025] text-white px-6 py-2.5 rounded-lg hover:bg-[#991b1f] font-semibold transition shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    Select Seats <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;