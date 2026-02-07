export default function ResourceCard({ item }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border-l-8 border-green-700">
      <h2 className="text-2xl font-semibold">{item.name}</h2>
      <p className="text-green-700 font-medium">{item.tag}</p>
    </div>
  );
}
