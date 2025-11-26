import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import UserSignup from '../pages/UserSignup'
import UserLogin from '../pages/UserLogin'
import Home from '../pages/Home'
import FoodPartnerSignup from '../pages/FoodPartnerSignup'
import FoodPartnerLogin from '../pages/FoodPartnerLogin'
import FoodPartnerPage from '../pages/FoodPartnerPage'
import CreateFood from '../pages/CreateFood'
import UserProtectedWrapper from '../pages/UserProtectedWrapper'
import SaveFood from '../pages/saveFood'

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path='/saveFood' element={
          <UserProtectedWrapper>
            <SaveFood />
          </UserProtectedWrapper>
        }></Route>
        <Route path='/user/register' element={<UserSignup />}></Route>
        <Route path='/user/login' element={<UserLogin />}></Route>
        <Route path='/food-partner/register' element={<FoodPartnerSignup />}></Route>
        <Route path='/food-partner/login' element={
          <FoodPartnerLogin />

        }></Route>
        <Route path='/home' element={
          <UserProtectedWrapper>
            <Home />
          </UserProtectedWrapper>
        }></Route>
        <Route path='/foodPartnerPage' element={<FoodPartnerPage />}></Route>
        <Route path='/createFood' element={
          <UserProtectedWrapper>
            <CreateFood />
          </UserProtectedWrapper>
        }></Route>
      </Routes>
    </Router>
  )
}

export default AppRouter
