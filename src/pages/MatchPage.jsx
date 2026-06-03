import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTournament } from '../store/useTournament'

export default function MatchPage() {
  const { state, setSelMatch, updateResult, addGoal, removeGoal, adjStat, ensureResult, getMatch, getRoundOfMatch } = useTournament()
  const navigate = useNavigate()
  const [goalForm, setGoalForm] = useState({ h: { name: '', min: '' }, a: { name: '', min: '' } })

  const s = {
    page: { padding: '16px 14px' },
    btn: { padding: '7px 14px', borderRadius: 'var(--rs)', border: '1px solid var(--b2)', background: 'var(--bg3)', color: 'var(--t1)', fontSize: 13 },
    btnP: { padding: '7px 14px', borderRadius: 'var(--rs)', border: '1px solid var(--acc)', background: 'var(--acc)', color: '#fff', fontSize: 13 },
    btnSm: { padding: '5px 10px', borderRadius: 'var(--rs)', border: '1px solid var(--b2)', background: 'var(--bg3)', color: 'var(--t1)', fontSize: 12 },
    btnG: { padding: '5px 10px', borderRadius: 'var(--rs)', border: '1px solid var(--b1)', background: 'none', color: 'var(--t3)', fontSize: 12 },
    card: { background: 'var(--bg2)', border: '1px solid var(--b1)', borderRadius: 'var(--r)', padding: '14px 16px', marginBottom: 12 },
    ct: { fontSize: 11, fontWeight: 600, letterSpacing: '.6px', textTransform: 'uppercase', color: 'var(--t3)', marginBottom: 10 },
    input: { padding: '8px 11px', background: 'var(--bg3)', border: '1px solid var(--b2)', borderRadius: 'var(--rs)', color: 'var(--t1)', fontSize: 13, outline: 'none' },
    scIn: { width: 48, padding: '7px 8px', textAlign: 'center', background: 'var(--bg3)', border: '1px solid var(--b2)', borderRadius: 'var(--rs)', color: 'var(--t1)', fontSize: 18, fontFamily: 'DM Mono', fontWeight: 600, outline: 'none' },
    adj: { width: 30, height: 30, borderRadius: '50%', border: '1px solid var(--b2)', background: 'var(--bg3)', color: 'var(--t2)', fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
    badge: (bg, c) => ({ display: 'inline-block', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 500, background: bg, color: c }),
  }

  // Match list
  if (!state.selMatch) {
    return (
      <div style={s.page}>
        <div style={{ fontSize: 13, color: 'var(--t2)', marginBottom: 14 }}>Одбери утакмица:</div>
        {state.rounds.map(r => (
          <div key={r.id}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--t3)', letterSpacing: '.5px', textTransform: 'uppercase', margin: '14px 0 6px' }}>{r.name}</div>
            {r.matches.map(m => {
              const res = state.results[m.id] || {}
              const done = res.ft_h !== '' && res.ft_h !== null && res.ft_h !== undefined
              return (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', padding: '10px 12px', background: 'var(--bg3)', borderRadius: 'var(--rs)', border: '1px solid var(--b1)', marginBottom: 6, cursor: 'pointer', gap: 10 }}
                  onClick={() => setSelMatch(m.id)}>
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{m.home || 'TBD'}</span>
                  <span style={{ fontFamily: 'DM Mono', fontSize: 13, fontWeight: 600, color: done ? 'var(--acc)' : 'var(--t3)' }}>{done ? `${res.ft_h} : ${res.ft_a}` : 'vs'}</span>
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 500, textAlign: 'right' }}>{m.away || 'TBD'}</span>
                  {done && <span style={s.badge('var(--grnbg)', 'var(--grn)')}>✓</span>}
                </div>
              )
            })}
          </div>
        ))}
        {!state.rounds.length && <div style={{ textAlign: 'center', padding: 28, color: 'var(--t3)', fontSize: 13 }}>Нема утакмици.</div>}
      </div>
    )
  }

  const mid = state.selMatch
  const m = getMatch(mid)
  if (!m) { setSelMatch(null); return null }
  const res = state.results[mid] || {}
  const round = getRoundOfMatch(mid)
  const hn = m.home || 'Домаќин'
  const an = m.away || 'Гостин'
  const ftH = res.ft_h !== '' && res.ft_h !== null && res.ft_h !== undefined ? res.ft_h : '—'
  const ftA = res.ft_a !== '' && res.ft_a !== null && res.ft_a !== undefined ? res.ft_a : '—'

  function setFT(side, val) {
    const updates = side === 'h' ? { ft_h: val } : { ft_a: val }
    updateResult(mid, updates)
    setTimeout(() => {
      const r = state.results[mid] || {}
      const h = parseInt(r.ft_h), a = parseInt(r.ft_a)
      if (!r.pens && !isNaN(h) && !isNaN(a) && h !== a) {
        updateResult(mid, { winner: h > a ? m.home : m.away })
      } else if (!r.pens) {
        updateResult(mid, { winner: null })
      }
    }, 50)
  }

  function handleAddGoal(side, type) {
    const f = goalForm[side]
    if (!f.name.trim()) return
    addGoal(mid, side, { name: f.name.trim(), min: parseInt(f.min) || 0, type })
    setGoalForm(prev => ({ ...prev, [side]: { name: '', min: '' } }))
  }

  return (
    <div style={s.page}>
      {/* Back */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        <button style={s.btnG} onClick={() => setSelMatch(null)}>← Назад</button>
        {round && <span style={s.badge('var(--bg3)', 'var(--t2)')}>{round.name}</span>}
        {res.pens && <span style={s.badge('var(--yelbg)', 'var(--yel)')}>Пенали</span>}
        {res.winner && <span style={s.badge('var(--grnbg)', 'var(--grn)')}>✓ Завршено</span>}
      </div>

      {/* Header */}
      <div style={s.card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, fontSize: 15, fontWeight: 600 }}>{hn}</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'DM Mono', fontSize: 28, fontWeight: 600, color: 'var(--acc)' }}>{ftH} : {ftA}</div>
            {res.ht_h !== '' && res.ht_a !== '' && res.ht_h !== undefined && (
              <div style={{ fontSize: 11, color: 'var(--t3)' }}>HT: {res.ht_h} : {res.ht_a}</div>
            )}
          </div>
          <div style={{ flex: 1, fontSize: 15, fontWeight: 600, textAlign: 'right' }}>{an}</div>
        </div>
      </div>

      {/* Score */}
      <div style={s.card}>
        <div style={s.ct}>Резултат</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--t2)', marginBottom: 5 }}>Полувреме</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input type="number" min="0" style={s.scIn} value={res.ht_h || ''} placeholder="0"
                onChange={e => updateResult(mid, { ht_h: e.target.value })} />
              <span style={{ color: 'var(--t3)', fontWeight: 600 }}>:</span>
              <input type="number" min="0" style={s.scIn} value={res.ht_a || ''} placeholder="0"
                onChange={e => updateResult(mid, { ht_a: e.target.value })} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--t2)', marginBottom: 5 }}>Краен резултат</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input type="number" min="0" style={s.scIn} value={res.ft_h || ''} placeholder="0"
                onChange={e => setFT('h', e.target.value)} />
              <span style={{ color: 'var(--t3)', fontWeight: 600 }}>:</span>
              <input type="number" min="0" style={s.scIn} value={res.ft_a || ''} placeholder="0"
                onChange={e => setFT('a', e.target.value)} />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
            <input type="checkbox" checked={res.pens || false} onChange={e => updateResult(mid, { pens: e.target.checked })} />
            Пенали
          </label>
          {res.pens && (
            <select style={{ ...s.input, fontSize: 12 }} value={res.winner || ''} onChange={e => updateResult(mid, { winner: e.target.value || null })}>
              <option value="">— победник по пенали —</option>
              <option value={m.home}>{hn}</option>
              <option value={m.away}>{an}</option>
            </select>
          )}
          {res.winner && !res.pens && <span style={s.badge('var(--grnbg)', 'var(--grn)')}>Победник: {res.winner}</span>}
        </div>
      </div>

      {/* Goals */}
      <div style={s.card}>
        <div style={s.ct}>Голови</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {['h', 'a'].map(side => {
            const goals = (side === 'h' ? res.goals_h : res.goals_a) || []
            const label = side === 'h' ? hn : an
            return (
              <div key={side}>
                <div style={{ fontSize: 11, color: 'var(--t2)', fontWeight: 500, marginBottom: 7 }}>{label}</div>
                {goals.length === 0 && <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 6 }}>Нема голови</div>}
                {goals.map((g, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 8px', background: 'var(--bg3)', borderRadius: 'var(--rs)', border: '1px solid var(--b1)', marginBottom: 4, fontSize: 12 }}>
                    <span style={{ fontFamily: 'DM Mono', fontSize: 11, color: 'var(--t3)', minWidth: 24 }}>{g.min}'</span>
                    <span style={{ flex: 1 }}>{g.name}</span>
                    {g.type === 'og' && <span style={s.badge('var(--redbg)', 'var(--red)')}>АГ</span>}
                    {g.type === 'pen' && <span style={s.badge('var(--yelbg)', 'var(--yel)')}>П</span>}
                    <button style={{ background: 'none', border: 'none', color: 'var(--t3)', fontSize: 13, cursor: 'pointer' }} onClick={() => removeGoal(mid, side, i)}>✕</button>
                  </div>
                ))}
                <div style={{ background: 'var(--bg3)', borderRadius: 'var(--rs)', padding: 8, border: '1px solid var(--b1)', marginTop: 4 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
                    <input style={{ ...s.input, flex: 1, fontSize: 12, padding: '5px 8px' }} placeholder="Стрелец"
                      value={goalForm[side].name} onChange={e => setGoalForm(p => ({ ...p, [side]: { ...p[side], name: e.target.value } }))} />
                    <input type="number" style={{ ...s.input, width: 46, fontSize: 12, padding: '5px 6px' }} placeholder="мин"
                      value={goalForm[side].min} onChange={e => setGoalForm(p => ({ ...p, [side]: { ...p[side], min: e.target.value } }))} />
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button style={{ ...s.btnSm, background: 'var(--acc)', borderColor: 'var(--acc)', color: '#fff' }} onClick={() => handleAddGoal(side, 'normal')}>⚽</button>
                    <button style={{ ...s.btnSm, background: 'var(--redbg)', borderColor: 'rgba(239,68,68,0.25)', color: 'var(--red)' }} onClick={() => handleAddGoal(side, 'og')}>АГ</button>
                    <button style={{ ...s.btnSm, background: 'var(--yelbg)', borderColor: 'var(--yelb)', color: 'var(--yel)' }} onClick={() => handleAddGoal(side, 'pen')}>Пенал</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Shots */}
      <div style={s.card}>
        <div style={s.ct}>Шутови</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 30px 1fr', gap: 8, alignItems: 'start' }}>
          {[['h', hn], ['a', an]].map(([side, label], idx) => {
            const on = side === 'h' ? (res.sh_on || 0) : (res.sa_on || 0)
            const off = side === 'h' ? (res.sh_off || 0) : (res.sa_off || 0)
            return (
              <div key={side} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 8 }}>{label}</div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                  {[['on', 'Во рамка', 'var(--grn)', side === 'h' ? 'sh_on' : 'sa_on'], ['off', 'Надвор', 'var(--t2)', side === 'h' ? 'sh_off' : 'sa_off']].map(([k, lbl, clr, key]) => (
                    <div key={k} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 10, color: clr, marginBottom: 4 }}>{lbl}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <button style={s.adj} onClick={() => adjStat(mid, key, -1)}>−</button>
                        <span style={{ fontFamily: 'DM Mono', fontSize: 17, fontWeight: 600, color: clr, minWidth: 22, textAlign: 'center' }}>{k === 'on' ? on : off}</span>
                        <button style={s.adj} onClick={() => adjStat(mid, key, 1)}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 5 }}>Вкупно: {on + off}</div>
              </div>
            )
          })}
          <div style={{ textAlign: 'center', paddingTop: 28, fontSize: 12, color: 'var(--t3)' }}>vs</div>
        </div>
      </div>

      {/* Saves */}
      <div style={s.card}>
        <div style={s.ct}>Одбрани 🧤</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 30px 1fr', gap: 8, alignItems: 'center' }}>
          {[['h', hn, 'sv_h'], ['a', an, 'sv_a']].map(([side, label, key], idx) => (
            <div key={side} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 7 }}>{label}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                <button style={s.adj} onClick={() => adjStat(mid, key, -1)}>−</button>
                <span style={{ fontFamily: 'DM Mono', fontSize: 26, fontWeight: 600, color: 'var(--blu)', minWidth: 34, textAlign: 'center' }}>{res[key] || 0}</span>
                <button style={{ ...s.adj, borderColor: 'var(--blub)', color: 'var(--blu)' }} onClick={() => adjStat(mid, key, 1)}>+</button>
              </div>
            </div>
          ))}
          <div style={{ textAlign: 'center', fontSize: 20 }}>🧤</div>
        </div>
      </div>
    </div>
  )
}