import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTournament } from '../store/useTournament'

const templates = [
  { id: '4', label: '4 тима', sub: 'SF + Финале' },
  { id: '8', label: '8 тима', sub: 'QF + SF + Финале' },
  { id: '13sf', label: '13 тима', sub: '1/8 + QF + SF + Финале' },
  { id: '16', label: '16 тима', sub: '1/8 + QF + SF + Финале' },
  { id: '32', label: '32 тима', sub: '1/16 + 1/8 + QF + SF + Финале' },
]

export default function SetupPage() {
  const { state, setName, addRound, updateRound, deleteRound, setSlot, loadTemplate, resetTournament } = useTournament()
  const navigate = useNavigate()
  const [expandedRound, setExpandedRound] = useState(null)
  const [editModal, setEditModal] = useState(null)
  const [editName, setEditName] = useState('')
  const [editCount, setEditCount] = useState(2)
  const [addModal, setAddModal] = useState(false)
  const [newName, setNewName] = useState('')
  const [newCount, setNewCount] = useState(2)

  const s = {
    page: { padding: '16px 14px' },
    label: { fontSize: 11, fontWeight: 600, letterSpacing: '.6px', textTransform: 'uppercase', color: 'var(--t3)', marginBottom: 5 },
    input: { width: '100%', padding: '9px 12px', background: 'var(--bg3)', border: '1px solid var(--b2)', borderRadius: 'var(--rs)', color: 'var(--t1)', fontSize: 14, outline: 'none' },
    btn: { padding: '8px 16px', borderRadius: 'var(--rs)', border: '1px solid var(--b2)', background: 'var(--bg3)', color: 'var(--t1)', fontSize: 13, fontWeight: 500 },
    btnP: { padding: '8px 16px', borderRadius: 'var(--rs)', border: '1px solid var(--acc)', background: 'var(--acc)', color: '#fff', fontSize: 13, fontWeight: 500 },
    btnSm: { padding: '5px 11px', borderRadius: 'var(--rs)', border: '1px solid var(--b2)', background: 'var(--bg3)', color: 'var(--t1)', fontSize: 12 },
    btnD: { padding: '5px 11px', borderRadius: 'var(--rs)', border: '1px solid rgba(239,68,68,0.25)', background: 'none', color: 'var(--red)', fontSize: 12 },
    card: { background: 'var(--bg2)', border: '1px solid var(--b1)', borderRadius: 'var(--r)', marginBottom: 10, overflow: 'hidden' },
    section: { fontSize: 11, fontWeight: 600, letterSpacing: '.6px', textTransform: 'uppercase', color: 'var(--t3)', margin: '20px 0 10px' },
    overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 },
    modal: { background: 'var(--bg2)', border: '1px solid var(--b2)', borderRadius: 'var(--r)', padding: 20, width: '100%', maxWidth: 360 },
  }

  return (
    <div style={s.page}>
      {/* Tournament name */}
      <div style={{ marginBottom: 20 }}>
        <div style={s.label}>Ime на турнирот</div>
        <input style={s.input} value={state.name} onChange={e => setName(e.target.value)} placeholder="Турнир 2025" />
      </div>

      {/* Templates */}
      <div style={s.section}>Брзи шаблони</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {templates.map(t => (
          <button key={t.id} style={s.btnSm} onClick={() => {
            if (state.rounds.length && !window.confirm('Ова ќе ги замени постоечките рунди. Продолжи?')) return
            loadTemplate(t.id)
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Rounds */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={s.section}>Рунди</div>
        <button style={s.btnSm} onClick={() => setAddModal(true)}>+ Рунда</button>
      </div>

      {state.rounds.length === 0 && (
        <div style={{ textAlign: 'center', padding: 28, color: 'var(--t3)', fontSize: 13, border: '1px dashed var(--b1)', borderRadius: 'var(--r)', marginBottom: 14 }}>
          Нема рунди. Одбери шаблон или додај рачно.
        </div>
      )}

      {state.rounds.map(r => (
        <div key={r.id} style={s.card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', cursor: 'pointer' }}
            onClick={() => setExpandedRound(expandedRound === r.id ? null : r.id)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{r.name}</span>
              <span style={{ fontSize: 11, background: 'var(--bg3)', border: '1px solid var(--b1)', borderRadius: 20, padding: '2px 8px', color: 'var(--t2)' }}>{r.matches.length} мечеви</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button style={s.btnSm} onClick={e => { e.stopPropagation(); setEditModal(r.id); setEditName(r.name); setEditCount(r.matches.length) }}>✎</button>
              <button style={s.btnD} onClick={e => { e.stopPropagation(); if (window.confirm('Избриши рунда?')) deleteRound(r.id) }}>✕</button>
            </div>
          </div>

          {expandedRound === r.id && (
            <div style={{ borderTop: '1px solid var(--b1)', padding: '10px 14px' }}>
              {r.matches.map((m, mi) => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--t3)', minWidth: 50 }}>Меч {mi + 1}</span>
                  <input value={m.home} onChange={e => setSlot(m.id, 'home', e.target.value)}
                    placeholder="Домаќин" style={{ ...s.input, fontSize: 12, padding: '6px 9px' }} />
                  <span style={{ color: 'var(--t3)', fontSize: 13, fontWeight: 600 }}>vs</span>
                  <input value={m.away} onChange={e => setSlot(m.id, 'away', e.target.value)}
                    placeholder="Гостин" style={{ ...s.input, fontSize: 12, padding: '6px 9px' }} />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {state.rounds.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
          <button style={s.btnP} onClick={() => navigate('/bracket')}>Прикажи Bracket →</button>
          <button style={{ ...s.btn, color: 'var(--red)', borderColor: 'rgba(239,68,68,0.25)' }}
            onClick={() => { if (window.confirm('Ресетирај сè?')) resetTournament() }}>Ресетирај</button>
        </div>
      )}

      {/* Add round modal */}
      {addModal && (
        <div style={s.overlay} onClick={() => setAddModal(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Додај рунда</div>
            <div style={{ marginBottom: 10 }}>
              <div style={s.label}>Ime</div>
              <input style={s.input} value={newName} onChange={e => setNewName(e.target.value)} placeholder="н.п. Полуфинале" autoFocus />
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={s.label}>Број на мечеви</div>
              <select style={s.input} value={newCount} onChange={e => setNewCount(parseInt(e.target.value))}>
                {[1,2,3,4,6,8,16].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button style={s.btn} onClick={() => setAddModal(false)}>Откажи</button>
              <button style={s.btnP} onClick={() => { if (newName.trim()) { addRound(newName.trim(), newCount); setAddModal(false); setNewName(''); setNewCount(2) } }}>Додај</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit round modal */}
      {editModal && (
        <div style={s.overlay} onClick={() => setEditModal(null)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Уреди рунда</div>
            <div style={{ marginBottom: 10 }}>
              <div style={s.label}>Ime</div>
              <input style={s.input} value={editName} onChange={e => setEditName(e.target.value)} autoFocus />
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={s.label}>Број на мечеви</div>
              <select style={s.input} value={editCount} onChange={e => setEditCount(parseInt(e.target.value))}>
                {[1,2,3,4,6,8,16].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button style={s.btn} onClick={() => setEditModal(null)}>Откажи</button>
              <button style={s.btnP} onClick={() => { updateRound(editModal, editName, editCount); setEditModal(null) }}>Зачувај</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}