import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

function App() {
  const [data, setData] = useState<string>("");
  
  useEffect(() => {
    fetch("http://localhost:3000/holamundo/holamundo")
        .then(res => res.json())
        .then((data: string) => setData(data))
        .catch(err => console.error(err));
        }, []);

    return (
    <div style={{ padding: "2rem" }}>
      <h1>MI PRIMREA PAGINA WEB</h1>
      <div>
        <h3>El backend dice:</h3>
        <p>{data}</p> {}
      </div>
    </div>
  );
}

export default App;