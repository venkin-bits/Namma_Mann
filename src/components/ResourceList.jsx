import ResourceCard from "./ResourceCard";

export default function ResourceList({ location, data }) {
  if (!location) return null;

  return (
    <div className="mt-10 grid gap-6 w-full max-w-xl">
      {data[location]?.map((item, index) => (
        <ResourceCard key={index} item={item} />
      ))}
    </div>
  );
}
