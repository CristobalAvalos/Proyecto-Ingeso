import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Prueba from './prueba';
import Catalogo from './catalogo/catalogo';

function App() {
  return (
      <BrowserRouter>
        <nav style={{ padding: '1rem', background: '#333', color: 'white' }}>
          <Link to="/" style={{ marginRight: '1rem', color: 'white' }}>Home</Link>
          <Link to="/catalogo" style={{ color: 'white' }}>Catálogo</Link>
        </nav>
        
        <Routes>
          <Route path="/" element={<Prueba />} />
          <Route path="/catalogo" element={<Catalogo />} />
        </Routes>
      </BrowserRouter>
    );
}

export default App
