import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return (
    <>
    <div class="task-tracker">
  <header class="header">
    <button class="add-task-btn">+</button>
    <span class="sort-label">Сортировать по</span>
  </header>

  <div class="task-card">
    <div class="task-info">
      <div class="task-header">
        <p class="task-id">ID 001</p>
      </div>
      <div class="task-content">
        <div class="task-left">
          <p class="task-name"><strong>!!</strong>Задача 1</p>
          <p class="task-description">Описание задачи 1</p>
        </div>
        <div class="task-right">
          <p class="task-deadline">Дедлайн: 15-12-2024</p>
          <div class="task-status">
            <label for="status-1">Статус:</label>
            <select id="status-1">
              <option>В ожидании</option>
              <option>В процессе</option>
              <option>Выполнено</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="task-dates">
      <p><strong>Добавлено:</strong></p>
      <p>10-09-2024</p>
      <p><strong>Обновлено:</strong></p>
      <p>11-09-2024</p>
    </div>
  </div>
  <div class="task-card">
    <div class="task-info">
      <div class="task-header">
        <p class="task-id">ID 001</p>
      </div>
      <div class="task-content">
        <div class="task-left">
          <p class="task-name"><strong>!!</strong>Задача 1</p>
          <p class="task-description">Описание задачи 1</p>
        </div>
        <div class="task-right">
          <p class="task-deadline">Дедлайн: 15-12-2024</p>
          <div class="task-status">
            <label for="status-1">Статус:</label>
            <select id="status-1">
              <option>В ожидании</option>
              <option>В процессе</option>
              <option>Выполнено</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="task-dates">
      <p><strong>Добавлено:</strong></p>
      <p>10-09-2024</p>
      <p><strong>Обновлено:</strong></p>
      <p>11-09-2024</p>
    </div>
  </div>
  <div class="task-card">
    <div class="task-info">
      <div class="task-header">
        <p class="task-id">ID 001</p>
      </div>
      <div class="task-content">
        <div class="task-left">
          <p class="task-name"><strong>!!</strong>Задача 1</p>
          <p class="task-description">Описание задачи 1</p>
        </div>
        <div class="task-right">
          <p class="task-deadline">Дедлайн: 15-12-2024</p>
          <div class="task-status">
            <label for="status-1">Статус:</label>
            <select id="status-1">
              <option>В ожидании</option>
              <option>В процессе</option>
              <option>Выполнено</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="task-dates">
      <p><strong>Добавлено:</strong></p>
      <p>10-09-2024</p>
      <p><strong>Обновлено:</strong></p>
      <p>11-09-2024</p>
    </div>
  </div>

</div>

    </>
  )
}

export default App
