import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { TasksProvider } from './context/TasksContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <TasksProvider>
        <App />
      </TasksProvider>
    </HashRouter>
  </React.StrictMode>,
)
