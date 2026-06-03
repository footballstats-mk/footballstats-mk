import { useTournament } from '../store/useTournament'

export default function StatsPage() {
  const { state, getChampion } = useTournament()

  const s = {
    page: { padding: '16px 14px' },
    card: { background: 'var(--bg2)', border: '1px solid var(--b1)', borderRadius: 'var(--r)', padding: '14px 16px', marginBottom: 12 },
    ct: { fontSize: 11, fontWeight: 600, letterSpacing: '.6px', textTransform: 'uppercase', color: 'var(--t3)', marginBottom: 10 },
    badge: (bg, c) => ({ display: 'inline-block', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 500, background: bg, color: c }),
  }

  const champion = getChampion()

  // Aggregate
  const teamStats = {}
  const scorerMap = {}
  let totalM = 0, totalG = 0

  state.rounds.forEach(r => r.matches.forEach(m => {
    const res = state.results[m.id]
    if (!res || res.ft_h === '' || res.ft_h === null || res.ft_h === undefined) return
    totalM++
    const sides = [
      { team: m.home, side: 'h', goals: res.goals_h || [], on: res.sh_on || 0, off: res.sh_off || 0, sv: res.sv_h || 0, opGoals: res.goals_a || [] },
      { team: m.away, side: 'a', goals: res.goals_a || [], on: res.sa_on || 0, off: res.sa_off || 0, sv: res.sv_a || 0, opGoals: res.goals_h || [] },
    ]
    sides.forEach(({ team, goals, on, off, sv, opGoals }) => {
      if (!team) return
      if (!teamStats[team]) teamStats[team] = { name: team, m: 0, w: 0, g: 0, ga: 0, son: 0, soff: 0, sv: 0 }
      teamStats[team].m++
      teamStats[team].son += on
      teamStats[team].soff += off
      teamStats[team].sv += sv
      teamStats[team].g += goals.filter(g => g.type !== 'og').length + opGoals.filter(g => g.type === 'og').length
      teamStats[team].ga += opGoals.filter(g => g.type !== 'og').length + goals.filter(g => g.type === 'og').length
      if (res.winner === team) teamStats[team].w++
    })
    ;(res.goals_h || []).forEach(g => {
      if (g.type === 'og') return
      totalG++
      if (!scorerMap[g.name]) scorerMap[g.name] = { name: g.name, team: m.home, g: 0, p: 0 }
      scorerMap[g.name].g++
      if (g.type === 'pen') scorerMap[g.name].p++
    })
    ;(res.goals_a || []).forEach(g => {
      if (g.type === 'og') return
      totalG++
      if (!scorerMap[g.name]) scorerMap[g.name] = { name: g.name, team: m.away, g: 0, p: 0 }
      scorerMap[g.name].g++
      if (g.type === 'pen') scorerMap[g.name].p++
    })
  }))

  const scorers = Object.values(scorerMap).sort((a, b) => b.g - a.g).slice(0, 10)
  const tlist = Object.values(teamStats).filter(t => t.m > 0).sort((a, b) => b.w - a.w)

  return (
    <div style={s.page}>

      {/* Champion */}
      {champion && (
        <div style={{ ...s.card, border: '1px solid rgba(255,102,0,0.3)', textAlign: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 28 }}>🏆</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--acc)', marginTop: 4 }}>{champion}</div>
          <div style={{ fontSize: 12, color: 'var(--t2)', marginTop: 3 }}>Шампион на {state.name}</div>
        </div>
      )}

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
        {[
          { val: totalM, lbl: 'Одиграни', clr: 'var(--acc)' },
          { val: totalG, lbl: 'Голови', clr: 'var(--grn)' },
          { val: totalM > 0 ? (totalG / totalM).toFixed(1) : 0, lbl: 'Г/Меч', clr: 'var(--blu)' },
        ].map(({ val, lbl, clr }) => (
          <div key={lbl} style={{ ...s.card, textAlign: 'center', padding: '12px 8px' }}>
            <div style={{ fontSize: 24, fontWeight: 600, color: clr }}>{val}</div>
            <div style={{ fontSize: 11, color: 'var(--t2)', marginTop: 2 }}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* Scorers */}
      {scorers.length > 0 && (
        <div style={s.card}>
          <div style={s.ct}>Стрелци</div>
          {scorers.map((sc, i) => (
            <div key={sc.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderTop: i > 0 ? '1px solid var(--b1)' : 'none' }}>
              <span style={{ fontFamily: 'DM Mono', fontSize: 11, color: 'var(--t3)', minWidth: 16 }}>{i + 1}</span>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{sc.name}</span>
              <span style={{ fontSize: 12, color: 'var(--t2)' }}>{sc.team}</span>
              {sc.p > 0 && <span style={s.badge('var(--yelbg)', 'var(--yel)')}>{sc.p}P</span>}
              <span style={{ fontFamily: 'DM Mono', fontSize: 15, fontWeight: 600, color: 'var(--acc)' }}>{sc.g}</span>
            </div>
          ))}
        </div>
      )}

      {/* Team stats */}
      {tlist.length > 0 && (
        <div style={s.card}>
          <div style={s.ct}>По тим</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse', minWidth: 340 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--b1)' }}>
                  {['Тим', 'М', 'П', 'Г+', 'Г−', '↑', '↓', '🧤'].map((h, i) => (
                    <th key={h} style={{ padding: '5px 6px', fontSize: 11, color: 'var(--t3)', fontWeight: 600, textAlign: i === 0 ? 'left' : 'center' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tlist.map(t => (
                  <tr key={t.name} style={{ borderBottom: '1px solid var(--b1)' }}>
                    <td style={{ padding: '7px 6px', fontSize: 12, fontWeight: 500 }}>{t.name}</td>
                    <td style={{ padding: '7px 6px', textAlign: 'center', fontFamily: 'DM Mono' }}>{t.m}</td>
                    <td style={{ padding: '7px 6px', textAlign: 'center', fontFamily: 'DM Mono', color: 'var(--acc)', fontWeight: 600 }}>{t.w}</td>
                    <td style={{ padding: '7px 6px', textAlign: 'center', fontFamily: 'DM Mono', color: 'var(--grn)' }}>{t.g}</td>
                    <td style={{ padding: '7px 6px', textAlign: 'center', fontFamily: 'DM Mono', color: 'var(--red)' }}>{t.ga}</td>
                    <td style={{ padding: '7px 6px', textAlign: 'center', fontFamily: 'DM Mono' }}>{t.son}</td>
                    <td style={{ padding: '7px 6px', textAlign: 'center', fontFamily: 'DM Mono' }}>{t.soff}</td>
                    <td style={{ padding: '7px 6px', textAlign: 'center', fontFamily: 'DM Mono', color: 'var(--blu)' }}>{t.sv}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 8 }}>М=Мечеви · П=Победи · Г+=Голови · Г−=Примени · ↑=Шут во рамка · ↓=Шут надвор · 🧤=Одбрани</div>
        </div>
      )}

      {!tlist.length && (
        <div style={{ textAlign: 'center', padding: 28, color: 'var(--t3)', fontSize: 13, border: '1px dashed var(--b1)', borderRadius: 'var(--r)' }}>
          Нема статистика. Внеси резултати во Утакмица.
        </div>
      )}
    </div>
  )
}