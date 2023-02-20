import { Navbar } from '../components/Navbar';
import { DashboardPage } from './pages/DashboardPage';


export const Dashboard = () => {
  return (
    <section className='flex'>
      <Navbar />
      <DashboardPage />
    </section>
  )
}
