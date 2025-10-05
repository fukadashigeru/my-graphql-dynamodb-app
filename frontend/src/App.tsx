// frontend/src/App.tsx
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

type ListUsersData = {
  listUsers: Array<{
    id: string;
    email: string;
    name: string;
    role: string;
  }>;
};

const LIST_USERS = gql`
  query ListUsers {
    listUsers {
      id
      email
      name
      role
    }
  }
`;

export default function App() {
  const { data, loading, error } = useQuery<ListUsersData>(LIST_USERS);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error.message}</div>;

  return (
    <div style={{ padding: 16 }}>
      <h1>Users</h1>
      <ul>
        {data?.listUsers?.map((u) => (
          <li key={u.id}>
            {u.name} ({u.email}) - {u.role} - {u.id}
          </li>
        ))}
      </ul>
    </div>
  );
}
