import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Armchair, ShieldCheck, ArrowRight, Info, CircleDot, DoorOpen } from 'lucide-react';
import toast from 'react-hot-toast'; // Ithu mukkiyam

const BusDetails = () => {
  const { id } = useParams();
  const [seats, setSeats] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [fare, setFare] = useState(0);
  
  const navigate = useNavigate();
  const { token, user } = useAuth();

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const res = await API.get(`/trips/${id}/seats?t=${Date.now()}`);
        
        const sortedSeats = res.data.data.sort((a: any, b: any) => {
          const numA = parseInt(a.seatNumber.replace(/\D/g, ''));
          const numB = parseInt(b.seatNumber.replace(/\D/g, ''));
          return numA - numB;
        });

        setSeats(sortedSeats);
        setFare(1500); 
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSeats();
  }, [id]);

  const toggleSeat = (seat: any) => {
    if (seat.status !== 'AVAILABLE') return;

    if (seat.bookedGender?.toLowerCase() === 'female') {
      toast.error('This seat is already booked by a female.');
      return;
    }

    const currentNum = parseInt(seat.seatNumber.replace(/\D/g, ''));

    const isNextToFemale = seats.some(s => {
      if (s.bookedGender?.toLowerCase() !== 'female') return false;
      const sNum = parseInt(s.seatNumber.replace(/\D/g, ''));

      const row1 = Math.floor((currentNum - 1) / 4);
      const row2 = Math.floor((sNum - 1) / 4);
      const col1 = (currentNum - 1) % 4;
      const col2 = (sNum - 1) % 4;

      if (row1 === row2) {
         if ((col1 === 0 && col2 === 1) || (col1 === 1 && col2 === 0)) return true;
         if ((col1 === 2 && col2 === 3) || (col1 === 3 && col2 === 2)) return true;
      }
      return false;
    });

    const isUserMale = user?.gender?.toLowerCase() === 'male';

    if (isUserMale && isNextToFemale) {
      toast.error('This seat is adjacent to a female passenger. Reserved for females only.');
      return;
    }

    if (selected.includes(seat.seatNumber)) {
      setSelected(selected.filter((s) => s !== seat.seatNumber));
    } else {
      setSelected([...selected, seat.seatNumber]);
    }
  };

  const handleContinue = () => {
    if (selected.length === 0) return toast.error('Please select at least one seat');
    if (!token) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }
    navigate(`/booking/${id}?seats=${selected.join(',')}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b82025]"></div>
      </div>
    );
  }

  const seatRows = [];
  for (let i = 0; i < seats.length; i += 4) {
    seatRows.push(seats.slice(i, i + 4));
  }

  return (
    <div className="min-h-screen bg-[#fdfaf5] py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Select Your Seats</h2>
          <p className="text-gray-500 text-sm mt-1">AC Bus - 2+2 Layout</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          
          <div className="flex-1 bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex justify-center">
            
            <div className="border-4 border-gray-300 rounded-[2rem] p-4 md:p-6 w-full max-w-[320px] bg-gray-50 relative">
              
              <div className="flex justify-between items-end mb-8 border-b-2 border-dashed border-gray-300 pb-3">
                <div className="flex flex-col items-center text-gray-400">
                   <DoorOpen size={24} />
                   <span className="text-[10px] font-bold mt-1">Door</span>
                </div>
                <div className="flex flex-col items-center text-gray-500 bg-gray-200 p-2 rounded-full">
                  <CircleDot size={24} />
                  <span className="text-[10px] font-bold mt-1">Driver</span>
                </div>
              </div>

              <div className="space-y-4">
                {seatRows.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex justify-between items-center">
                    
                    <div className="flex gap-2">
                      {row[0] && <SeatButton seat={row[0]} selected={selected} toggleSeat={toggleSeat} />}
                      {row[1] && <SeatButton seat={row[1]} selected={selected} toggleSeat={toggleSeat} />}
                    </div>

                    <div className="w-8 md:w-12 text-center text-xs font-bold text-gray-300">
                      {rowIndex + 1}
                    </div>

                    <div className="flex gap-2">
                      {row[2] && <SeatButton seat={row[2]} selected={selected} toggleSeat={toggleSeat} />}
                      {row[3] && <SeatButton seat={row[3]} selected={selected} toggleSeat={toggleSeat} />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-80">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              
              <div className="flex flex-wrap gap-3 mb-6 pb-4 border-b border-gray-100 text-xs font-medium">
                <div className="flex items-center gap-1"><div className="w-4 h-4 rounded-sm border-2 border-gray-300 bg-white"></div> Available</div>
                <div className="flex items-center gap-1"><div className="w-4 h-4 rounded-sm bg-[#b82025]"></div> Selected</div>
                <div className="flex items-center gap-1"><div className="w-4 h-4 rounded-sm bg-pink-100 border border-pink-300"></div> Female</div>
                <div className="flex items-center gap-1"><div className="w-4 h-4 rounded-sm bg-gray-200"></div> Booked</div>
              </div>

              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-3">Booking Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Selected Seats:</span>
                  <span className="font-semibold text-gray-800">{selected.length > 0 ? selected.join(', ') : 'None'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Base Fare:</span>
                  <span className="font-semibold text-gray-800">₹{fare} x {selected.length}</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-800 font-bold">Total Amount:</span>
                  <span className="text-2xl font-bold text-[#b82025]">₹{fare * selected.length}</span>
                </div>
              </div>

              <button
                onClick={handleContinue}
                disabled={selected.length === 0}
                className="w-full bg-[#b82025] text-white py-3 rounded-xl hover:bg-[#991b1f] font-bold transition-all duration-300 shadow-md flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Continue <ArrowRight size={18} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const SeatButton = ({ seat, selected, toggleSeat }: { seat: any, selected: string[], toggleSeat: (seat: any) => void }) => {
  const isSelected = selected.includes(seat.seatNumber);
  const isAvailable = seat.status === 'AVAILABLE';
  const isFemaleBooked = seat.bookedGender?.toLowerCase() === 'female'; 
  
  let seatClasses = "w-12 h-14 md:w-14 md:h-16 rounded-lg font-bold text-xs md:text-sm flex flex-col items-center justify-center transition-all duration-200 border-2 ";
  
  if (isSelected) {
    seatClasses += "bg-[#b82025] border-[#b82025] text-white shadow-md transform scale-105";
  } else if (isFemaleBooked) {
    seatClasses += "bg-pink-100 border-pink-300 text-pink-600 cursor-not-allowed"; 
  } else if (isAvailable) {
    seatClasses += "bg-white border-gray-300 text-gray-600 hover:border-[#b82025] cursor-pointer";
  } else {
    seatClasses += "bg-gray-200 border-gray-200 text-gray-400 cursor-not-allowed";
  }

  return (
    <button
      onClick={() => toggleSeat(seat)}
      disabled={!isAvailable}
      className={seatClasses}
      title={isFemaleBooked ? "Reserved for Female" : ""}
    >
      <Armchair size={16} className="mb-0.5 opacity-70" />
      {seat.seatNumber}
    </button>
  );
};

export default BusDetails;