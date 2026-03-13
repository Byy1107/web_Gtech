import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import { queryClient } from "@/lib/queryClient"

import MainLayout from "@/layouts/MainLayout"
import ProtectedRoute from "@/components/ProtectedRoute"

import Dashboard from "@/pages/Dashboard"
import Monitoring from "@/pages/Monitoring"
import Customers from "@/pages/Customers"
import Odp from "@/pages/Odp"
import Packages from "@/pages/Packages"
import Finance from "@/pages/Finance"
import Login from "@/pages/Login"

function App() {

 return (
  <QueryClientProvider client={queryClient}>
   <Router>

    <Routes>

     <Route path="/login" element={<Login/>}/>

     <Route
      path="/"
      element={
       <ProtectedRoute>
        <MainLayout/>
       </ProtectedRoute>
      }
     >

      <Route index element={<Dashboard/>}/>
<Route path="dashboard" element={<Dashboard/>}/>
      <Route path="monitoring" element={<Monitoring/>}/>
      <Route path="customers" element={<Customers/>}/>
      <Route path="odp" element={<Odp/>}/>
      <Route path="packages" element={<Packages/>}/>
      <Route path="finance" element={<Finance/>}/>

     </Route>

    </Routes>

   </Router>

   <ReactQueryDevtools initialIsOpen={false}/>

  </QueryClientProvider>
 )
}

export default App