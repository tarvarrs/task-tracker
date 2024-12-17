import { useState, useEffect } from 'react';
import './App.css';
import {normalizePriority} from './scripts/normalizePriority';
import ServerInfo from './ServerInfo';
import FileContent from './FileContent';

function App() {
  const [tasks, setTasks] = useState([]); // Все задачи
  const [isLoading, setIsLoading] = useState(true); // Состояние загрузки
  const [searchTaskId, setSearchTaskId] = useState(''); // ID для поиска
  const [searchResult, setSearchResult] = useState(null); // Результат поиска
  const [formData, setFormData] = useState({
    task_name: '',
    description: '',
    date_end: '',
    priority: '!',
  });

  useEffect(() => {
    fetch('http://localhost:4000/tasks')
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
        setIsLoading(false);
      });
  }, []);

  const handleSearch = () => {
    if (!searchTaskId.trim()) {
      setSearchResult(null);
      return;
    }

    fetch(`http://localhost:4000/tasks/${searchTaskId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Task not found');
        }
      return response.json();
      })
      .then((task) => {
          setSearchResult(task);
        })
      .catch((error) => {
        console.warn(error.message);
        alert('Задача с указанным ID не найдена');
        setSearchResult(null);
      });
  }

  const handleSortTasks = (sortOption) => {
    let sortParam = '';
    switch (sortOption) {
      case 'ID':
        sortParam = 'id';
        break;
      case 'дате':
        sortParam = 'deadline';
        break;
      case 'статусу':
        sortParam = 'status';
        break;
      case 'приоритету':
        sortParam = 'priority';
        break;
      default:
        sortParam = 'id';
    }
    fetch(`http://localhost:4000/tasks/ordered_by_${sortParam}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch sorted tasks');
        }
        return response.json();
      })
      .then((sortedTasks) => {
        setTasks(sortedTasks);
      })
      .catch((error) => {
        console.error('Error fetching sorted tasks:', error);
        alert('Не удалось загрузить отсорированные задачи');
      });
  };

  const handleFilterTasks = (filterOption) => {
    let filterParam = '';
    switch (filterOption) {
      case 'Все':
        filterParam = 'all';
        break;
      case 'В ожидании':
        filterParam = 'pending';
        break;
      case 'В процессе':
        filterParam = 'process';
        break;
      case 'Выполнено':
        filterParam = 'done';
        break;
      default:
        filterParam = 'all';
    }
    fetch(`http://localhost:4000/tasks/filtered_${filterParam}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch filtered tasks');
        }
        return response.json();
      })
      .then((filteredTasks) => {
        setTasks(filteredTasks);
      })
      .catch((error) => {
        console.error('Error fetching filtered tasks', error);
        alert('Не удалось загрузить задачи по фильтру');
      });
  };

  const handleStatusChange = (taskId, newStatus) => {
    fetch(`http://localhost:4000/tasks/${taskId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update task status');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.message);
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? { ...task, status: newStatus, date_update: new Date().toISOString().slice(0, 10) } : task
      ));
      })
      .catch((error) => {
        console.log('Error updating task status:', error);
        alert('Не удалось обновить статус задачи');
      });
  };

  const handleDeleteTask = (taskId) => {
    if (!window.confirm('Вы точно хотите удалить эту задачу? Это действие безвозвратно')) {
      return;
    }
    fetch(`http://localhost:4000/tasks/${taskId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete task');
        }
      return response.json();
      })
      .then((data) => {
        console.log(data.message);
        setTasks((prevTask) => prevTask.filter((task) => task.id !== taskId));
      })
      .catch((error) => {
        console.error('Error deleting task:', error);
        alert('Не удалось удалить задачу');
      });
  }

  const handleAddTask = (e) => {
    e.preventDefault();

    fetch('http://localhost:4000/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to add task');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.message);
        setTasks((prevTasks) => [
          ...prevTasks,
          {
            id: data.taskId,
            task_name: formData.task_name,
            description: formData.description,
            date_create: new Date().toISOString().slice(0, 10),
            date_update: new Date().toISOString().slice(0, 10),
            date_end: formData.date_end,
            status: 'В ожидании',
            priority: formData.priority,
          },
        ]);
        setFormData({
          task_name: '',
          description: '',
          date_end: '',
          priority: '!',
        });
      })
      .catch((error) => {
        console.error('Error adding task:', error);
        alert('Не удалось добавить задачу');
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="task-tracker">
      <header className="header">
        <form className='add-task-form' onSubmit={handleAddTask}>
          <div>
            <label htmlFor='task_name'>Название задачи: </label>
            <input
              type='text'
              id='task_name'
              name='task_name'
              value={formData.task_name}
              onChange={handleInputChange}
              required
              />
          </div>
          <div>
            <label htmlFor='description'>Описание: </label>
            <textarea
              id='description'
              name='description'
              value={formData.description}
              onChange={handleInputChange}
              />
          </div>
          <div>
            <label htmlFor='date_end'>Срок выполнения: </label>
            <input
              type='date'
              id='date_end'
              name='date_end'
              value={formData.date_end}
              onChange={handleInputChange}
              />
          </div>
          <div>
            <label htmlFor='priority'>Приоритет: </label>
            <select
              id='priority'
              name='priority'
              value={formData.priority}
              onChange={handleInputChange}
              >
                <option value='!'>!</option>
                <option value='!!'>!!</option>
                <option value='!!!'>!!!</option>
              </select>
          </div>
          <button type='submit'>Добавить задачу</button>
        </form>
        <div className='header-second-line'>
          <div className='search-task'>
            <input 
              type="text" 
              name="task_id_input" 
              placeholder='Введите ID задачи' 
              value={searchTaskId}
              onChange={(e) => setSearchTaskId(e.target.value)}
              />
            <button className='search-btn' onClick={handleSearch}>Поиск</button>
          </div>
          <div className="sort-by">
            <label htmlFor="sort-1">Сортировать по </label>
            <select 
              id="sort-1"
              onChange={(e) => handleSortTasks(e.target.value)}
            >
              <option>ID</option>
              <option>дате</option>
              <option>статусу</option>
              <option>приоритету</option>
            </select>
          </div>
          <div className="filter-priority">
            <label htmlFor="sort-2">Статус </label>
            <select 
              id="sort-2"
              onChange={(e) => handleFilterTasks(e.target.value)}
            >
              <option>Все</option>
              <option>В ожидании</option>
              <option>В процессе</option>
              <option>Выполнено</option>
            </select>
          </div>
        </div>
      </header>

      <div className="task-list">
        {isLoading ? (
          <p>Загрузка задач...</p>
        ) : searchResult ? (
          <div className="task-card">
            <div className="task-info">
              <div className="task-header">
                <p className="task-id">ID {searchResult.id}</p>
              </div>
              <div className="task-content">
                <div className="task-left">
                  <p className="task-name">
                    <strong>{normalizePriority(searchResult.priority)}</strong> {searchResult.task_name}
                  </p>
                  <p className="task-description">{searchResult.description}</p>
                </div>
                <div className="task-right">
                  <p className="task-deadline">Дедлайн: {searchResult.date_end}</p>
                  <div className="task-status">
                    <label htmlFor={`status-${searchResult.id}`}>Статус: </label>
                    <select
                      id={`status-${searchResult.id}`}
                      // defaultValue={searchResult.status}
                      value={searchResult.status}
                      onChange={(e) => handleStatusChange(searchResult.id, e.target.value)}
                    >
                      <option>В ожидании</option>
                      <option>В процессе</option>
                      <option>Выполнено</option>
                    </select>
                  </div>
                  <button 
                    className='delete-task-btn'
                    onClick={() => handleDeleteTask(searchResult.id)}
                    >Удалить</button>
                </div>
              </div>
            </div>
            <div className="task-dates">
              <p>
                <strong>Добавлено:</strong> {searchResult.date_create}
              </p>
              <p>
                <strong>Обновлено:</strong> {searchResult.date_update}
              </p>
            </div>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="task-card">
              <div className="task-info">
                <div className="task-header">
                  <p className="task-id">ID {task.id}</p>
                </div>
                <div className="task-content">
                  <div className="task-left">
                    <p className="task-name">
                      <strong>{normalizePriority(task.priority)}</strong> {task.task_name}
                    </p>
                    <p className="task-description">{task.description}</p>
                  </div>
                  <div className="task-right">
                    <p className="task-deadline">Дедлайн: {task.date_end}</p>
                    <div className="task-status">
                      <label htmlFor={`status-${task.id}`}>Статус: </label>
                      <select 
                        id={`status-${task.id}`} 
                        // defaultValue={task.status}
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        >
                        <option>В ожидании</option>
                        <option>В процессе</option>
                        <option>Выполнено</option>
                      </select>
                    </div>
                    <button 
                      className="delete-task-btn"
                      onClick={() => handleDeleteTask(task.id)}
                      >Удалить</button>
                  </div>
                </div>
              </div>
              <div className="task-dates">
                <p>
                  <strong>Добавлено:</strong> {task.date_create}
                </p>
                <p>
                  <strong>Обновлено:</strong> {task.date_update}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      <footer>
        <main>
          <ServerInfo />
          <FileContent />
        </main>
      </footer>
    </div>
  );
}

export default App;
