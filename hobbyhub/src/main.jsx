import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { createClient } from '@supabase/supabase-js'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Create from './components/Create.jsx'
import Post from './components/Post.jsx'
import Update from './components/Update.jsx'
import Home from './components/Home.jsx'
import NotFoundPage from './components/NotFoundPage.jsx'


const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;
const supabaseUrl = 'https://ugxbfizuqepumyjumbsg.supabase.co';
const supabaseKey = ACCESS_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: '/',
        element: <Home />,
      }, {
        path: '/home',
        element: <Home />,
      }, {
        path: '/create',
        element: <Create />,
      }, {
        path: '/update/:id',
        element: <Update />,
      }, {
        path: '/post/:id',
        element: <Post />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <RouterProvider router={router} />
    </SessionContextProvider>
  </React.StrictMode>,
)
