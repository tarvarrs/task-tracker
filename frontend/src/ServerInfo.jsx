import { useState, useEffect } from 'react';

function ServerInfo() {
  const [serverInfo, setServerInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/server-info')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch server info');
        }
        return response.json();
      })
      .then((data) => {
        setServerInfo(data);
      })
      .catch((err) => {
        console.error(err);
        setError('Не удалось загрузить информацию о сервере');
      });
  }, []);

  if (error) {
    return <div className="server-info-error">{error}</div>;
  }

  if (!serverInfo) {
    return <div className="server-info-loading">Загрузка информации о сервере...</div>;
  }

  return (
    <div className="server-info">
      <h2>Информация о сервере</h2>
      <p><strong>Платформа:</strong> {serverInfo.platform}</p>
      <p><strong>Архитектура:</strong> {serverInfo.arch}</p>
    </div>
  );
}

export default ServerInfo;
