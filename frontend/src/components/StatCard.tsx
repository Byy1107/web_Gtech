interface Props {
  title: string
  value: string | number
}

export default function StatCard({ title, value }: Props) {

  return (

    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">

      <p className="text-sm text-gray-400">
        {title}
      </p>

      <h2 className="text-2xl font-bold mt-1">
        {value}
      </h2>

    </div>

  )

}