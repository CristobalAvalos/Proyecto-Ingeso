import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

function Prueba() {
  const [data, setData] = useState<string>("");

  const apiUrl = process.env.NODE_ENV === 'development' 
      ? "http://localhost:3000" 
      : "http://backend:3000";
  
  useEffect(() => {
    fetch(`${apiUrl}/holamundo/holamundo`)
      .then((res) => res.json())
      .then((data: { message: string }) => setData(data.message))  // ← Extraer .message
      .catch((err) => console.error(err));
  }, []);

    return (
    <div style={{ padding: "2rem" }}>
      <h1>MI PRIMERA PAGINA lol</h1>
      <div>
        <h3>El backend dice:</h3>
        <p>{data}</p> {}
      </div>
    </div>
  );
}

export default Prueba;