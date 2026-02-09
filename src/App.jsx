import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import PropertyList from './pages/PropertyList'
import PropertyDetail from './pages/PropertyDetail'
import SellForm from './pages/SellForm'
import Contact from './pages/Contact'

export default function App(){
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/comprar" element={<PropertyList operationType="buy" />} />
            <Route path="/alquiler" element={<PropertyList operationType="rent" />} />
            <Route path="/alquiler-temporario" element={<PropertyList operationType="short-rent" />} />
            <Route path="/propiedad/:id" element={<PropertyDetail/>} />
            <Route path="/vender" element={<SellForm/>} />
            <Route path="/contactanos" element={<Contact/>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
