import { BrowserRouter } from 'react-router-dom'
import './styles/App.css'
import { CategoriasProvider } from './provider/CategoriasProvider'
import { CarritoProvider } from './provider/CarritoProvider'
import { Toaster } from 'react-hot-toast'
import { Rutas } from '../routes/Rutas'


function App() {
  return (
  <CategoriasProvider>
    <CarritoProvider>
      <BrowserRouter>
          <Rutas/>
          <Toaster/>
      </BrowserRouter>
    </CarritoProvider>
  </CategoriasProvider>

  )
}

export default App
