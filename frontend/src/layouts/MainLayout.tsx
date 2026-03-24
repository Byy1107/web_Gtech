import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"

export default function MainLayout() {

  return (

    <div className="flex min-h-screen bg-slate-950 text-white">

      <Sidebar/>

      <div className="flex-1 flex flex-col">

        <Navbar/>

        <main className="p-6 max-w-7xl mx-auto w-full">

          <Outlet/>

        </main>

      </div>

    </div>

  )

}