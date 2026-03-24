import { Link } from "react-router-dom"
import { LayoutDashboard, Users, Router, Package, MapPin, DollarSign } from "lucide-react"

export default function Sidebar() {

  return (

    <aside className="w-64 bg-slate-900 text-white min-h-screen p-6">

      <h1 className="text-xl font-bold mb-8">
        ISP Panel
      </h1>

      <nav className="space-y-4">

        <Link className="flex items-center gap-2 hover:text-blue-400" to="/dashboard">
          <LayoutDashboard size={18}/> Dashboard
        </Link>

        <Link className="flex items-center gap-2 hover:text-blue-400" to="/monitoring">
          <Router size={18}/> Monitoring
        </Link>

        <Link className="flex items-center gap-2 hover:text-blue-400" to="/customers">
          <Users size={18}/> Customers
        </Link>

        <Link className="flex items-center gap-2 hover:text-blue-400" to="/odp">
          <MapPin size={18}/> ODP
        </Link>

        <Link className="flex items-center gap-2 hover:text-blue-400" to="/packages">
          <Package size={18}/> Packages
        </Link>

        <Link className="flex items-center gap-2 hover:text-blue-400" to="/finance">
          <DollarSign size={18}/> Finance
        </Link>

      </nav>

    </aside>

  )

}