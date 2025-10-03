import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  
  useEffect(() => {
    fetch("http://localhost:3000/holamundo/holamundo")
        .then(res => res.json())
        .then((data: User[]) => setUsers(data))
        .catch(err => console.error(err));
        }, []);

    return (
    <div style={{ padding: "2rem" }}>
      <h1>Usuarios (mock)</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;