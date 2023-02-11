import { Navbar } from '../components/Navbar';
import { DashboardPage } from './pages/DashboardPage';


export const Dashboard = () => {
  return (
    <div className='flex'>
      <Navbar />
      <DashboardPage />
    </div>
  )
}
