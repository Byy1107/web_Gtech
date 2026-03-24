import { createBrowserRouter } from "react-router-dom"
import MainLayout from "../layouts/MainLayout"

import Monitoring from "../features/monitoring/Monitoring"
import Customers from "../features/customers/Customers"
import Odp from "../features/odp/Odp"
import Packages from "../features/packages/Packages"
import Finance from "../features/finance/Finance"

import Dashboard from "../features/dashboard/Dashboard"

import Login from "../pages/Login"


export const router = createBrowserRouter([

{
path:"/login",
element:<Login/>
},

{
path:"/",
element:<MainLayout/>,

children:[

{ path:"dashboard", element:<Dashboard/> },
{ path:"monitoring", element:<Monitoring/> },
{ path:"customers", element:<Customers/> },
{ path:"odp", element:<Odp/> },
{ path:"packages", element:<Packages/> },
{ path:"finance", element:<Finance/> }

]

}

])