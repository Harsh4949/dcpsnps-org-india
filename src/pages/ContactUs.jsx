import { useState } from 'react';

const stateDistrictData = {
  Maharashtra: ['Kolhapur', 'Sangli', 'Pune', 'Mumbai', 'Nashik', 'Nagpur'],
  Gujarat: ['Ahmedabad', 'Surat', 'Vadodara'],
  Karnataka: ['Bengaluru', 'Mysore', 'Mangalore'],
};

const ContactUs = () => {
  const [selectedState, setSelectedState] = useState('');
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setDistricts(stateDistrictData[state] || []);
    setSelectedDistrict('');
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
  };

  return (
    <div id="Contact" className="min-h-screen flex items-center justify-center px-4 " style={{ background: "var(--body-color)" }}>
      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-6 text-center">
          📞 Contact Us
        </h2>

        <form className="space-y-5">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full px-5 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none text-gray-700"
          />

          <input
            type="email"
            placeholder="Your Email"
            className="w-full px-5 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none text-gray-700"
          />

          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <select
              value={selectedState}
              onChange={handleStateChange}
              className="flex-1 px-5 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none text-gray-700"
            >
              <option value="">Select your state</option>
              {Object.keys(stateDistrictData).map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>

            <select
              value={selectedDistrict}
              onChange={handleDistrictChange}
              className="flex-1 px-5 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none text-gray-700"
              disabled={!selectedState}
            >
              <option value="">
                {selectedState ? 'Select your district' : 'Select state first'}
              </option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          <textarea
            rows="4"
            placeholder="Your Message"
            className="w-full px-5 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none text-gray-700 resize-none"
          />

          <button
            type="submit"
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-lg transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
