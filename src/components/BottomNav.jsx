import { useNavigate, useLocation } from 'react-router-dom'

const tabs = [
  { path: '/', label: 'Setup', icon: '⚙️' },
  { path: '/bracket', label: 'Bracket', icon: '🏆' },
  { path: '/match', label: 'Утакмица', icon: '⚽' },
  { path: '/stats', label: 'Статистика', icon: '📊' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 480, background: 'var(--bg2)',
      borderTop: '1px solid var(--b1)', display: 'flex',
      zIndex: 100, height: 60,
    }}>
      {tabs.map(t => {
        const active = location.pathname === t.path
        return (
          <button key={t.path} onClick={() => navigate(t.path)} style={{
            flex: 1, border: 'none', background: 'none',
            color: active ? 'var(--acc)' : 'var(--t3)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 2, fontSize: 11, fontWeight: active ? 600 : 400,
            borderTop: active ? '2px solid var(--acc)' : '2px solid transparent',
            transition: 'all .15s',
          }}>
            <span style={{ fontSize: 20 }}>{t.icon}</span>
            {t.label}
          </button>
        )
      })}
    </nav>
  )
}