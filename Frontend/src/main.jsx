import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import { UserProvider } from './context/UserContext';
import ProtectedRoute from './components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: "/",
    element:<ProtectedRoute></ProtectedRoute>,
    children:[
      {
        path: "/",
        element: <Home/>
      }
    ]
  },
  {
    path:"/login",
    element:<Login></Login>
  },
  {
    path:"/register",
    element:<Register></Register>
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
    <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>,
)
