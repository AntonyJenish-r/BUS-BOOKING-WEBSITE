import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Search, Bus, ShieldCheck, IndianRupee, Phone, Mail, User } from 'lucide-react';

const CITIES = [
  { value: 'Chennai', label: 'Chennai (चेन्नई)' },
  { value: 'Bangalore', label: 'Bangalore (बेंगलुरु)' },
  { value: 'Mumbai', label: 'Mumbai (मुंबई)' },
  { value: 'Delhi', label: 'Delhi (दिल्ली)' },
  { value: 'Hyderabad', label: 'Hyderabad (हैदराबाद)' },
  { value: 'Coimbatore', label: 'Coimbatore (कोयंबटूर)' },
  { value: 'Madurai', label: 'Madurai (मदुरै)' },
];

const Home = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (from === to) {
      alert('Source and Destination cannot be the same!');
      return;
    }
    navigate(`/search?from=${from}&to=${to}&date=${date}`);
  };

  return (
    <div className="min-h-screen pb-10">
      
      {/* Hero Section - Clean Brand Color Background */}
      <div className="bg-[#b82025] text-white py-16 md:py-24 text-center px-4 rounded-b-[2rem] md:rounded-b-[3rem] shadow-lg">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight drop-shadow-sm">
          Book Your Bus Ticket
        </h1>
        <p className="text-white/90 text-base md:text-xl font-['Roboto_Mono']">
          Safe, Fast, and Reliable Travel with S Antony Travels
        </p>
      </div>

      {/* Search Form */}
      <div className="container mx-auto -mt-10 px-4 relative z-20">
        <form 
          onSubmit={handleSearch} 
          className="bg-white p-5 md:p-8 rounded-2xl shadow-xl flex flex-col md:flex-row gap-4 max-w-5xl mx-auto border border-gray-100"
        >
          {/* From */}
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
              <MapPin size={16} className="text-[#b82025]" /> From
            </label>
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b82025] focus:bg-white transition cursor-pointer text-gray-700"
              required
            >
              <option value="" disabled>Select Source City</option>
              {CITIES.map((city) => (
                <option key={`from-${city.value}`} value={city.value}>{city.label}</option>
              ))}
            </select>
          </div>

          {/* To */}
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
              <MapPin size={16} className="text-[#b82025]" /> To
            </label>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b82025] focus:bg-white transition cursor-pointer text-gray-700"
              required
            >
              <option value="" disabled>Select Destination City</option>
              {CITIES.map((city) => (
                <option key={`to-${city.value}`} value={city.value}>{city.label}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
              <Calendar size={16} className="text-[#b82025]" /> Journey Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b82025] focus:bg-white transition text-gray-700"
              required
            />
          </div>

          {/* Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full md:w-auto bg-[#b82025] text-white p-3 px-8 rounded-xl hover:bg-[#991b1f] font-bold transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 h-[50px]"
            >
              <Search size={20} />
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Features Section - Line by Line (No Cards) */}
      <div className="container mx-auto mt-20 px-4 max-w-3xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Why Choose Us?</h2>
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-4">
            <div className="bg-red-50 p-3 rounded-full text-[#b82025] shrink-0">
              <Bus size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Wide Network</h3>
              <p className="text-gray-600">Travel across multiple cities with our extensive bus network.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-green-50 p-3 rounded-full text-green-600 shrink-0">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Safe & Secure</h3>
              <p className="text-gray-600">Your payments and personal data are protected with top security.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-yellow-50 p-3 rounded-full text-yellow-600 shrink-0">
              <IndianRupee size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Best Prices</h3>
              <p className="text-gray-600">Get the most competitive prices on all your bus bookings.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Care Section - Brand Red Background */}
      <div className="container mx-auto mt-20 px-4 max-w-3xl">
        <div className="bg-[#b82025] text-white p-8 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold mb-2">Customer Care</h2>
            <p className="text-white/80">We are here to help you 24/7</p>
          </div>
          
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Phone className="text-white" size={20} />
              <div>
                <p className="text-xs text-white/80">Call Us</p>
                <p className="font-semibold">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="text-white" size={20} />
              <div>
                <p className="text-xs text-white/80">Owner Details</p>
                <p className="font-semibold">Antony (Proprietor)</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-white" size={20} />
              <div>
                <p className="text-xs text-white/80">Email</p>
                <p className="font-semibold">support@santonytravels.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;