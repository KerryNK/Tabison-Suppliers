import React, { Suspense } from "react"
import { Routes, Route } from "react-router-dom"
import { Loading } from "../components/Loading"

// Lazy load components for better performance
const SupplierRegistrationForm = React.lazy(() => import("../components/SupplierRegistrationForm"))
const Dashboard = React.lazy(() => import("../pages/Dashboard"))
const ProductList = React.lazy(() => import("../pages/ProductList"))
const SupplierList = React.lazy(() => import("../pages/SupplierList"))

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/register" element={<SupplierRegistrationForm />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/suppliers" element={<SupplierList />} />
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
