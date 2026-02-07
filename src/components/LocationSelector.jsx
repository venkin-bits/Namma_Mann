export default function LocationSelector({ setLocation, data }) {
  return (
    <select
      className="p-4 rounded-xl shadow-md w-72 text-lg"
      onChange={(e) => setLocation(e.target.value)}
    >
      <option>Select Your Location</option>
      {Object.keys(data).map((city) => (
        <option key={city}>{city}</option>
      ))}
    </select>
  );
}
