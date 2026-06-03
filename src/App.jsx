import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import SetupPage from './pages/SetupPage'
import BracketPage from './pages/BracketPage'
import MatchPage from './pages/MatchPage'
import StatsPage from './pages/StatsPage'
import './index.css'

function AppInner() {
  return (
    <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', position: 'relative' }}>
      <Routes>
        <Route path="/" element={<SetupPage />} />
        <Route path="/bracket" element={<BracketPage />} />
        <Route path="/match" element={<MatchPage />} />
        <Route path="/stats" element={<StatsPage />} />
      </Routes>
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter basename="/footballstats-mk">
      <AppInner />
    </BrowserRouter>
  )
}