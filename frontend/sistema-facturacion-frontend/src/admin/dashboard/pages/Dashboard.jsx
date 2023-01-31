import { Navbar } from '../../components/Navbar';


export const Dashboard = () => {
  return (
    <>
        <header className='w-72 shadow-xl h-screen p-5'>

            <div className='flex mb-5'>
                <img src="https://cdn-icons-png.flaticon.com/128/456/456212.png" alt="Icono Admin" />
                <p className='flex items-center'>Bienvenido/a, Nidya</p>
            </div>

            <hr className='w-full mb-5 border border-blue-500' />

            <Navbar />

        </header>
    </>
  )
}
