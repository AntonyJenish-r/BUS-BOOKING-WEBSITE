// MOCK API - Portfolio Version (No Backend Needed)
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Database ah LocalStorage la set panrom
const getDB = (key: string) => JSON.parse(localStorage.getItem(key) || '[]');
const setDB = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data));

// Initial Data Setup (Admin user)
if (!localStorage.getItem('users')) {
  setDB('users', [{ id: 1, name: 'Antony', email: 'antony@test.com', password: 'password123', gender: 'Male', role: 'ADMIN' }]);
}
if (!localStorage.getItem('bookings')) {
  setDB('bookings', []);
}

const API = {
  post: async (url: string, data: any) => {
    await wait(500); // Loading animation kaatta

    // Auth: Register
    if (url === '/auth/register') {
      const users = getDB('users');
      if (users.find((u: any) => u.email === data.email)) throw new Error('User already exists');
      const newUser = { id: Date.now(), ...data };
      setDB('users', [...users, newUser]);
      return { data: { success: true, data: newUser } };
    }

    // Auth: Login
    if (url === '/auth/login') {
      const users = getDB('users');
      const user = users.find((u: any) => u.email === data.email && u.password === data.password);
      if (!user) throw new Error('Invalid credentials');
      const token = 'mock-token-' + user.id;
      return { data: { success: true, data: { user, token } } };
    }

    // Booking: Lock Seats
    if (url === '/bookings/lock') {
      return { data: { success: true, message: 'Seats locked' } };
    }

    // Booking: Create
    if (url === '/bookings') {
      const bookings = getDB('bookings');
      const newBooking = {
        id: 'BK' + Date.now(),
        userId: JSON.parse(localStorage.getItem('user') || '{}').id,
        status: 'CONFIRMED',
        totalAmount: 1500 * data.seatNumbers.length,
        boardingPoint: data.boardingPoint,
        droppingPoint: data.droppingPoint,
        ...data,
        createdAt: new Date().toISOString(),
        trip: {
          route: { source: 'Chennai', destination: 'Bangalore' },
          bus: { busNumber: 'TN-01-AB-1234', busType: 'AC Sleeper' },
          journeyDate: new Date().toISOString(),
          departureTime: '22:00',
          arrivalTime: '06:00',
        },
        passengers: data.passengers,
      };
      setDB('bookings', [...bookings, newBooking]);
      return { data: { success: true, data: newBooking } };
    }

    // Payments (Mock)
    if (url === '/payments/create-order') return { data: { success: true, data: { id: 'order_mock' } } };
    if (url === '/payments/verify') return { data: { success: true, message: 'Verified' } };

    // Coupons
    if (url === '/coupons/validate') {
      if (data.code === 'DIWALI20') return { data: { success: true, discount: 300 } };
      throw new Error('Invalid Coupon');
    }

    throw new Error('URL not found');
  },

  get: async (url: string) => {
    await wait(500);

    // Search Trips (Hardcoded Chennai to Bangalore)
    if (url.includes('/trips/search')) {
      return {
        data: {
          success: true,
          data: [
            {
              id: 1,
              bus: { busNumber: 'TN-01-AB-1234', busType: 'AC Sleeper', operator: { name: 'S Antony Travels' } },
              departureTime: '22:00',
              arrivalTime: '06:00',
              journeyDate: new Date().toISOString(),
              fare: 1500,
            },
          ],
        },
      };
    }

    // Get Seats (Mock Seats with some booked by female)
    if (url.includes('/seats')) {
      const seats = [];
      for (let i = 1; i <= 40; i++) {
        seats.push({
          id: i,
          seatNumber: `S${i}`,
          status: (i === 5 || i === 15) ? 'BOOKED' : 'AVAILABLE',
          bookedGender: (i === 5 || i === 15) ? 'Female' : null,
        });
      }
      return { data: { success: true, data: seats } };
    }

    // My Bookings
    if (url === '/bookings/my') {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const allBookings = getDB('bookings');
      const myBookings = allBookings.filter((b: any) => b.userId === user.id);
      return { data: { success: true, data: myBookings } };
    }

    throw new Error('URL not found');
  },
};

export default API;