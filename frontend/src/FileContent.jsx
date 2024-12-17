import { useState, useEffect } from 'react';

function FileContent() {
  const [fileContent, setFileContent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/file-content')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch file content');
        }
        return response.json();
      })
      .then((data) => {
        setFileContent(data.content);
      })
      .catch((err) => {
        console.error(err);
        setError('Не удалось загрузить информацию из файла');
      });
  }, []);

  if (error) {
    return <div className="file-content-error">{error}</div>;
  }

  if (!fileContent) {
    return <div className="file-content-loading">Загрузка содержимого файла...</div>;
  }

  return (
    <div className="file-content">
      <h2>Содержимое файла</h2>
      <p>{fileContent}</p>
    </div>
  );
}

export default FileContent;
