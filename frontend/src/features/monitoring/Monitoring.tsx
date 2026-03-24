import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { mikrotikApi } from "../../api/endpoints"

export default function Monitoring() {

  const [search, setSearch] = useState("")

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["ppp-active"],
    queryFn: mikrotikApi.active,
    refetchInterval: 10000
  })

  const users = Array.isArray(data?.data) ? data.data : []

  const filtered = users.filter((u:any) =>
    u.name?.toLowerCase().includes(search.toLowerCase())
  )

  async function disconnectUser(username:string){

    if(!confirm(`Disconnect ${username}?`)) return

    try{

      await mikrotikApi.disconnect(username)

      refetch()

    }catch(err){

      alert("Failed to disconnect user")

    }

  }

  return (

    <div className="space-y-6">

      <h1 className="text-2xl font-bold">
        PPP Monitoring
      </h1>

      {/* Search */}

      <input
        placeholder="Search PPP user..."
        className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 w-full max-w-sm"
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
      />

      {/* Table */}

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-slate-800">

            <tr>

              <th className="p-3 text-left">Username</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Uptime</th>
              <th className="p-3 text-left">Download</th>
              <th className="p-3 text-left">Upload</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>

            </tr>

          </thead>

          <tbody>

            {isLoading && (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-400">
                  Loading PPP sessions...
                </td>
              </tr>
            )}

            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-400">
                  No PPP sessions found
                </td>
              </tr>
            )}

            {filtered.map((u:any)=>(
              <tr
                key={u.name}
                className="border-t border-slate-800 hover:bg-slate-800"
              >

                <td className="p-3">{u.name}</td>

                <td className="p-3">
                  {u.address ?? "-"}
                </td>

                <td className="p-3">
                  {u.uptime ?? "-"}
                </td>

                <td className="p-3">
                  {u.bytesIn ?? 0}
                </td>

                <td className="p-3">
                  {u.bytesOut ?? 0}
                </td>

                <td className="p-3">

                  <span className="text-green-400">
                    Online
                  </span>

                </td>

                <td className="p-3">

                  <button
                    onClick={()=>disconnectUser(u.name)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs"
                  >
                    Disconnect
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>

  )

}