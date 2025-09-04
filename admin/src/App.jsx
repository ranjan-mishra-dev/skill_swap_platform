import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../src/Pages/Login'
// import Login from '../../frontend/src/pages/Login'
import DashBoard from '../src/Pages/DashBoard'
import Announcement from '../src/Pages/Announcement'
import Navbar from '../src/compenents/Navbar'

const App = () => {
  return (
    <div>
      {<Navbar />}

      <Routes>
        <Route path='/admin/login' element={<Login />}></Route>
        <Route path='/admin/dashboard' element={<DashBoard />}></Route>
        <Route path='/admin' element={<DashBoard />}></Route>
        <Route path='/' element={<Login />}></Route>
        <Route path='/admin/announcement' element={<Announcement />}></Route>
      </Routes>
    </div>
  )
}

export default App
