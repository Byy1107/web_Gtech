export default function StatusBadge({ status }: { status: string }) {
  const color =
    status === "online"
      ? "bg-green-500"
      : "bg-gray-500"

  return (
    <span className={`px-2 py-1 text-xs rounded text-white ${color}`}>
      {status}
    </span>
  )
}