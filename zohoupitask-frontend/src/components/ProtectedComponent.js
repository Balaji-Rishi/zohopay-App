import { useEffect } from 'react';
import axios from 'axios';

const ProtectedComponent = () => {
  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://localhost:8080/api/test/protected', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      console.log(res.data); // Should log: "You have accessed a protected resource!"
    })
    .catch(err => {
      console.error('Access denied:', err);
    });
  }, []);

  return <div>Check console for protected data</div>;
};

export default ProtectedComponent;
