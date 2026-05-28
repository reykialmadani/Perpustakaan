import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-900">
      <div className="w-full max-w-md px-4">
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout
