import { Outlet, useNavigate } from 'react-router-dom'
import { auth } from '../firebase'
import Dashboardheader from '../components/dashboard-header'
import { useEffect } from 'react'
import Dashboardhero from '../components/dashboard-hero'
import TrailerModal from '../components/trailer-modal'
import Footer from '../components/footer'
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
        <Footer />
        
    </div>
  )
}

export default dashboard