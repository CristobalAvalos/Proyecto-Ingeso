import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from "./Login";
import Catalogo from './catalogo/catalogo';

function App() {
  return (
    <BrowserRouter>
      {/* Barra de navegación de prueba */}
      <nav style={{ padding: '1rem', background: '#333', color: 'white' }}>
        <Link to="/" style={{ marginRight: '1rem', color: 'white' }}>Home (Login)</Link>
        <Link to="/catalogo" style={{ color: 'white' }}>Catálogo</Link>
      </nav>
      
      <Routes>
        {/* Ruta principal que muestra el componente Login (reemplaza a Prueba) */}
        <Route path="/" element={<Login />} />
        
        {/* Rutas adicionales */}
        <Route path="/catalogo" element={<Catalogo />} />
        
        {/* Si quieres mantener 'Prueba' en una ruta diferente, puedes hacerlo: */}
        {/* <Route path="/prueba" element={<Prueba />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;