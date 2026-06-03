import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTournament } from '../store/useTournament'

export default function BracketPage() {
  const { state, setSlot, setSelMatch, getChampion, allTeams } = useTournament()
  const navigate = useNavigate()
  const [slotModal, setSlotModal] = useState(null)
  const [slotVal, setSlotVal] = useState('')

  const champion = getChampion()
  const teams = allTeams()

  const s = {
    page: { padding: '16px 0 16px 14px' },
    lbl: { fontSize: 10, fontWeight: 600, letterSpacing: '.6px', textTransform: 'uppercase', color: 'var(--t3)', textAlign: 'center', padding: '0 6px 10px', whiteSpace: 'nowrap' },
    card: { background: 'var(--bg2)', border: '1px solid var(--b1)', borderRadius: 8, overflow: 'hidden', width: 160 },
    cardSel: { background: 'var(--bg2)', border: '1px solid var(--acc)', borderRadius: 8, overflow: 'hidden', width: 160, boxShadow: '0 0 0 1px var(--acc)' },
    cardDone: { background: 'var(--bg2)', border: '1px solid var(--grnb)', borderRadius: 8, overflow: 'hidden', width: 160 },
    slot: { display: 'flex', alignItems: 'center', padding: '6px 9px', minHeight: 32, gap: 5, cursor: 'pointer' },
    overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 },
    modal: { background: 'var(--bg2)', border: '1px solid var(--b2)', borderRadius: 'var(--r)', padding: 20, width: '100%', maxWidth: 340 },
    input: { width: '100%', padding: '9px 12px', background: 'var(--bg3)', border: '1px solid var(--b2)', borderRadius: 'var(--rs)', color: 'var(--t1)', fontSize: 14, outline: 'none' },
    btn: { padding: '7px 14px', borderRadius: 'var(--rs)', border: '1px solid var(--b2)', background: 'var(--bg3)', color: 'var(--t1)', fontSize: 13 },
    btnP: { padding: '7px 14px', borderRadius: 'var(--rs)', border: '1px solid var(--acc)', background: 'var(--acc)', color: '#fff', fontSize: 13 },
    btnD: { padding: '7px 14px', borderRadius: 'var(--rs)', border: '1px solid rgba(239,68,68,0.25)', background: 'none', color: 'var(--red)', fontSize: 13 },
  }

  function openSlot(mid, side, cur) {
    setSlotModal({ mid, side })
    setSlotVal(cur || '')
  }

  function saveSlot() {
    setSlot(slotModal.mid, slotModal.side, slotVal.trim())
    setSlotModal(null)
  }

  function clearSlot() {
    setSlot(slotModal.mid, slotModal.side, '')
    setSlotModal(null)
  }

  if (!state.rounds.length) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <div style={{ color: 'var(--t3)', fontSize: 13, marginBottom: 14 }}>Нема рунди. Прво постави во Setup.</div>
        <button style={s.btnP} onClick={() => navigate('/')}>← Setup</button>
      </div>
    )
  }

  return (
    <div style={s.page}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, paddingRight: 14, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 14, fontWeight: 600 }}>{state.name}</span>
        <span style={{ fontSize: 11, color: 'var(--t3)' }}>Клик на тим = промени</span>
      </div>

      <div style={{ overflowX: 'auto', paddingBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', minWidth: 'max-content', padding: '4px 0' }}>
          {state.rounds.map((r, ri) => {
            const spacer = Math.pow(2, ri)
            const unitH = 68
            return (
              <div key={r.id} style={{ display: 'flex', flexDirection: 'column', minWidth: 172 }}>
                <div style={s.lbl}>{r.name}</div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {r.matches.map((m, mi) => {
                    const res = state.results[m.id] || {}
                    const done = res.ft_h !== '' && res.ft_h !== null && res.ft_h !== undefined
                    const w = res.winner
                    const topM = mi === 0 ? (ri === 0 ? 4 : (spacer - 1) * unitH / 2) : (spacer * unitH - 2)

                    let cardStyle = done ? s.cardDone : s.card
                    if (state.selMatch === m.id) cardStyle = s.cardSel

                    const hcls = w ? (w === m.home ? 'win' : 'los') : (m.home ? '' : 'tbd')
                    const acls = w ? (w === m.away ? 'win' : 'los') : (m.away ? '' : 'tbd')

                    return (
                      <div key={m.id} style={{ marginTop: topM, marginBottom: 4, padding: '0 6px' }}>
                        <div style={cardStyle} onClick={() => { setSelMatch(m.id); navigate('/match') }}>
                          {/* Home */}
                          <div style={{
                            ...s.slot,
                            borderBottom: '1px solid var(--b1)',
                            background: hcls === 'win' ? 'rgba(255,102,0,0.1)' : 'none',
                            opacity: hcls === 'los' ? 0.3 : 1,
                          }} onClick={e => { e.stopPropagation(); openSlot(m.id, 'home', m.home) }}>
                            <span style={{ flex: 1, fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: hcls === 'win' ? 'var(--acc)' : hcls === 'tbd' ? 'var(--t3)' : 'var(--t1)', fontStyle: hcls === 'tbd' ? 'italic' : 'normal', fontWeight: hcls === 'win' ? 500 : 400 }}>
                              {m.home || '— постави тим'}
                            </span>
                            {done && <span style={{ fontFamily: 'DM Mono', fontSize: 12, fontWeight: 500, color: hcls === 'win' ? 'var(--acc)' : 'var(--t2)' }}>{res.ft_h}</span>}
                          </div>
                          {/* Away */}
                          <div style={{
                            ...s.slot,
                            background: acls === 'win' ? 'rgba(255,102,0,0.1)' : 'none',
                            opacity: acls === 'los' ? 0.3 : 1,
                          }} onClick={e => { e.stopPropagation(); openSlot(m.id, 'away', m.away) }}>
                            <span style={{ flex: 1, fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: acls === 'win' ? 'var(--acc)' : acls === 'tbd' ? 'var(--t3)' : 'var(--t1)', fontStyle: acls === 'tbd' ? 'italic' : 'normal', fontWeight: acls === 'win' ? 500 : 400 }}>
                              {m.away || '— постави тим'}
                            </span>
                            {done && <span style={{ fontFamily: 'DM Mono', fontSize: 12, fontWeight: 500, color: acls === 'win' ? 'var(--acc)' : 'var(--t2)' }}>{res.ft_a}</span>}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {/* Champion */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: 6, paddingTop: 24 }}>
            <div style={{ background: 'var(--bg2)', border: '1px solid rgba(255,102,0,0.3)', borderRadius: 'var(--r)', padding: '14px 16px', textAlign: 'center', minWidth: 130 }}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.6px', textTransform: 'uppercase', color: 'var(--t3)', marginBottom: 8 }}>🏆 Шампион</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: champion ? 'var(--acc)' : 'var(--t3)', fontStyle: champion ? 'normal' : 'italic' }}>{champion || 'TBD'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Slot modal */}
      {slotModal && (
        <div style={s.overlay} onClick={() => setSlotModal(null)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>
              {slotModal.side === 'home' ? 'Домаќин' : 'Гостин'}
            </div>
            <input style={{ ...s.input, marginBottom: 10 }} value={slotVal}
              onChange={e => setSlotVal(e.target.value)}
              placeholder="Внеси ime на тим..."
              autoFocus
              onKeyDown={e => e.key === 'Enter' && saveSlot()}
            />
            {teams.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: 'var(--t3)', marginBottom: 6 }}>Постоечки тимови:</div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {teams.filter(t => t !== slotVal).slice(0, 10).map(t => (
                    <button key={t} style={{ ...s.btn, fontSize: 11, padding: '3px 9px' }} onClick={() => setSlotVal(t)}>{t}</button>
                  ))}
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button style={s.btn} onClick={() => setSlotModal(null)}>Откажи</button>
              <button style={s.btnD} onClick={clearSlot}>Исчисти</button>
              <button style={s.btnP} onClick={saveSlot}>Зачувај</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}