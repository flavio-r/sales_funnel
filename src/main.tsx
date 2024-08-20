import ReactDOM from 'react-dom/client'
import { router } from './App.tsx'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import AuthProvider from './context/authProvider.tsx' 

ReactDOM.createRoot(document.getElementById('root')!).render(
      <AuthProvider>
      <RouterProvider router={ router } />
      </AuthProvider>
)
