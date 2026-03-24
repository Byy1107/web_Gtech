import { useQuery } from "@tanstack/react-query"
import { dashboardApi, mikrotikApi } from "../../api/endpoints"

import StatCard from "../../components/StatCard"
import TrafficChart from "../../components/TrafficChart"

export default function Dashboard() {

  const { data: stats } = useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardApi.stats,
    refetchInterval: 30000
  })

  const { data: traffic } = useQuery({
    queryKey: ["traffic"],
    queryFn: dashboardApi.traffic,
    refetchInterval: 10000
  })

  const { data: active } = useQuery({
    queryKey: ["active"],
    queryFn: mikrotikApi.active,
    refetchInterval: 10000
  })

  // SAFE DATA HANDLING
  const statsData = stats?.data ?? {}

  const trafficData = Array.isArray(traffic?.data)
    ? traffic.data
    : []

  const activeUsers = Array.isArray(active?.data)
    ? active.data
    : []

  return (

    <div className="space-y-6">

      {/* Header */}

      <h1 className="text-2xl font-bold">
        Network Operations Center
      </h1>

      {/* Stat Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard
          title="Total Customers"
          value={statsData.totalCustomers ?? 0}
        />

        <StatCard
          title="Online PPP"
          value={statsData.onlineCustomers ?? 0}
        />

        <StatCard
          title="Offline PPP"
          value={statsData.offlineCustomers ?? 0}
        />

        <StatCard
          title="Bandwidth"
          value={`${statsData?.bandwidthUsage?.download ?? 0} bps`}
        />

      </div>

      {/* Main Panels */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Traffic Chart */}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">

          <h2 className="font-semibold mb-4">
            Network Traffic
          </h2>

          <TrafficChart data={trafficData} />

        </div>

        {/* Active PPP */}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">

          <h2 className="font-semibold mb-4">
            Active PPP Sessions
          </h2>

          <div className="space-y-2">

            {activeUsers.length === 0 && (
              <p className="text-sm text-gray-400">
                No active PPP sessions
              </p>
            )}

            {activeUsers.slice(0, 10).map((u: any) => (

              <div
                key={u.name}
                className="flex justify-between text-sm border-b border-slate-800 pb-1"
              >

                <span>{u.name}</span>

                <span>{u.uptime ?? "-"}</span>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  )

}