import { Navbar } from '../components/Navbar';
import { RegistrarEntradaPage } from './';
import { FunctionsProvider } from './context';


export const RegistrarEntrada = () => {

    

    return (
      <section className="flex h-screen lg:h-auto">

        <FunctionsProvider>
          <Navbar />
          <RegistrarEntradaPage />
        </FunctionsProvider>
  
      </section>
    )
}
