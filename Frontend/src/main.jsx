import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';

import ProtectedRoute from './components/ProtectedRoute';
import Profile from './components/Profile';
import UserContextProvider from './context/UserContextProvider';

const router = createBrowserRouter([
  {
    path: "/",
    element:<ProtectedRoute></ProtectedRoute>,
    children:[
      {
        path: "",
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
  },
  {
    path:"/profile",
    element:<Profile></Profile>
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContextProvider>
      <RouterProvider router={router} />
    </UserContextProvider>
    
  </StrictMode>,
)
