export default function ServiceCard({ title, description, Icon }) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition">
      <Icon className="h-10 w-10 text-gray-900 mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
