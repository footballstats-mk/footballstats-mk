import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import SetupPage from './pages/SetupPage'
import BracketPage from './pages/BracketPage'
import MatchPage from './pages/MatchPage'
import StatsPage from './pages/StatsPage'
import './index.css'

const tabs = [
  { path: '/', label: 'Setup', icon: '⚙️' },
  { path: '/bracket', label: 'Bracket', icon: '🏆' },
  { path: '/match', label: 'Утакмица', icon: '⚽' },
  { path: '/stats', label: 'Статистика', icon: '📊' },
]

function Layout() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* SIDEBAR — desktop */}
      <aside className="sidebar" style={{
        width: 220, background: 'var(--bg2)', borderRight: '1px solid var(--b1)',
        display: 'flex', flexDirection: 'column', position: 'fixed',
        top: 0, left: 0, bottom: 0, zIndex: 100,
      }}>
        <div style={{ padding: '20px 18px 10px', borderBottom: '1px solid var(--b1)' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--acc)' }}>⚽ FootballStats</div>
          <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>mk</div>
        </div>
        <nav style={{ padding: '10px 8px', flex: 1 }}>
          {tabs.map(t => {
            const active = location.pathname === t.path
            return (
              <button key={t.path} onClick={() => navigate(t.path)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 'var(--rs)', border: 'none',
                background: active ? 'var(--accbg)' : 'none',
                color: active ? 'var(--acc)' : 'var(--t2)',
                fontSize: 14, fontWeight: active ? 600 : 400,
                marginBottom: 2, textAlign: 'left', cursor: 'pointer',
                transition: 'all .15s',
              }}>
                <span style={{ fontSize: 18 }}>{t.icon}</span>
                {t.label}
              </button>
            )
          })}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content" style={{
        flex: 1, marginLeft: 220,
        height: '100vh', overflowY: 'auto',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Top bar */}
        <div style={{
          height: 50, background: 'var(--bg2)', borderBottom: '1px solid var(--b1)',
          display: 'flex', alignItems: 'center', padding: '0 20px',
          position: 'sticky', top: 0, zIndex: 50, flexShrink: 0,
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--t2)' }}>
            {tabs.find(t => t.path === location.pathname)?.label}
          </div>
        </div>
        <div style={{ maxWidth: 900, margin: '0 auto', width: '100%', flex: 1 }}>
          <Routes>
            <Route path="/" element={<SetupPage />} />
            <Route path="/bracket" element={<BracketPage />} />
            <Route path="/match" element={<MatchPage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </div>
      </main>

      {/* BOTTOM NAV — mobile */}
      <nav className="bottom-nav" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'var(--bg2)', borderTop: '1px solid var(--b1)',
        display: 'flex', zIndex: 999, height: 60,
      }}>
        {tabs.map(t => {
          const active = location.pathname === t.path
          return (
            <button key={t.path} onClick={() => navigate(t.path)} style={{
              flex: 1, border: 'none', background: 'none',
              color: active ? 'var(--acc)' : 'var(--t3)',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 2, fontSize: 11,
              fontWeight: active ? 600 : 400,
              borderTop: active ? '2px solid var(--acc)' : '2px solid transparent',
            }}>
              <span style={{ fontSize: 20 }}>{t.icon}</span>
              {t.label}
            </button>
          )
        })}
      </nav>

    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter basename="/footballstats-mk">
      <Layout />
    </BrowserRouter>
  )
}