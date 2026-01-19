import { Outlet, useNavigate } from 'react-router-dom'
import { auth } from '../firebase'
import Dashboardheader from '../components/dashboard-header'
import { useEffect } from 'react'
import Dashboardhero from '../components/dashboard-hero'
import TrailerModal from '../components/trailer-modal'
const dashboard = () => {
    const navigate = useNavigate()

    useEffect(() => {
        if (!auth.currentUser) {
        navigate("/login")
    }
    }, [])
  
  return (
    <div>
        {/* Header */}
        <Dashboardheader />
        <Dashboardhero />
        <TrailerModal />
        <Outlet />

        
    </div>
  )
}

export default dashboard