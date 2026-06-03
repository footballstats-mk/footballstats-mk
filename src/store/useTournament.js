import { useState, useEffect } from 'react'

const STORAGE_KEY = 'footballstats_mk'

function loadState() {
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    return s ? JSON.parse(s) : null
  } catch { return null }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

const defaultState = {
  name: 'Мој Турнир',
  rounds: [],
  results: {},
  selMatch: null,
  _id: 1,
}

let _state = loadState() || { ...defaultState }
let _listeners = []

function getState() { return _state }

function setState(updater) {
  _state = typeof updater === 'function' ? updater(_state) : { ..._state, ...updater }
  saveState(_state)
  _listeners.forEach(fn => fn(_state))
}

function subscribe(fn) {
  _listeners.push(fn)
  return () => { _listeners = _listeners.filter(l => l !== fn) }
}

export function useTournament() {
  const [, forceUpdate] = useState(0)

  useEffect(() => {
    const unsub = subscribe(() => forceUpdate(n => n + 1))
    return unsub
  }, [])

  function uid() {
    const id = _state._id
    setState(s => ({ ...s, _id: s._id + 1 }))
    return id
  }

  function setName(name) { setState(s => ({ ...s, name })) }

  function addRound(name, count) {
    const matches = Array.from({ length: count }, () => ({ id: uid(), home: '', away: '' }))
    setState(s => ({ ...s, rounds: [...s.rounds, { id: uid(), name, matches }] }))
  }

  function updateRound(rid, name, count) {
    setState(s => ({
      ...s,
      rounds: s.rounds.map(r => {
        if (r.id !== rid) return r
        let matches = [...r.matches]
        while (matches.length < count) matches.push({ id: uid(), home: '', away: '' })
        while (matches.length > count) matches.pop()
        return { ...r, name, matches }
      })
    }))
  }

  function deleteRound(rid) {
    setState(s => ({ ...s, rounds: s.rounds.filter(r => r.id !== rid) }))
  }

  function setSlot(mid, side, value) {
    setState(s => ({
      ...s,
      rounds: s.rounds.map(r => ({
        ...r,
        matches: r.matches.map(m => m.id !== mid ? m : { ...m, [side]: value })
      }))
    }))
  }

  function getMatch(mid) {
    for (const r of _state.rounds)
      for (const m of r.matches)
        if (m.id === mid) return m
    return null
  }

  function getRoundOfMatch(mid) {
    for (const r of _state.rounds)
      for (const m of r.matches)
        if (m.id === mid) return r
    return null
  }

  function ensureResult(mid) {
    if (!_state.results[mid]) {
      setState(s => ({
        ...s,
        results: {
          ...s.results,
          [mid]: { ht_h: '', ht_a: '', ft_h: '', ft_a: '', winner: null, pens: false, goals_h: [], goals_a: [], sh_on: 0, sh_off: 0, sa_on: 0, sa_off: 0, sv_h: 0, sv_a: 0, date: '', time: '' }
        }
      }))
    }
    return _state.results[mid]
  }

  function updateResult(mid, updates) {
    ensureResult(mid)
    setState(s => ({
      ...s,
      results: { ...s.results, [mid]: { ...s.results[mid], ...updates } }
    }))
  }

  function addGoal(mid, side, goal) {
    ensureResult(mid)
    const key = side === 'h' ? 'goals_h' : 'goals_a'
    setState(s => {
      const arr = [...(s.results[mid][key] || []), goal].sort((a, b) => a.min - b.min)
      return { ...s, results: { ...s.results, [mid]: { ...s.results[mid], [key]: arr } } }
    })
  }

  function removeGoal(mid, side, idx) {
    const key = side === 'h' ? 'goals_h' : 'goals_a'
    setState(s => {
      const arr = [...(s.results[mid][key] || [])]
      arr.splice(idx, 1)
      return { ...s, results: { ...s.results, [mid]: { ...s.results[mid], [key]: arr } } }
    })
  }

  function adjStat(mid, key, delta) {
    ensureResult(mid)
    setState(s => ({
      ...s,
      results: { ...s.results, [mid]: { ...s.results[mid], [key]: Math.max(0, (s.results[mid][key] || 0) + delta) } }
    }))
  }

  function setSelMatch(mid) { setState(s => ({ ...s, selMatch: mid })) }

  function resetTournament() { setState({ ...defaultState, _id: _state._id }) }

  function loadTemplate(t) {
    setState(s => ({ ...s, rounds: [], results: {} }))
    if (t === '4') { addRound('Полуфинале', 2); addRound('Финале', 1) }
    else if (t === '8') { addRound('Четвртфинале', 4); addRound('Полуфинале', 2); addRound('Финале', 1) }
    else if (t === '13sf') { addRound('1/8 Финале', 6); addRound('Четвртфинале', 3); addRound('Полуфинале', 2); addRound('Финале', 1) }
    else if (t === '16') { addRound('1/8 Финале', 8); addRound('Четвртфинале', 4); addRound('Полуфинале', 2); addRound('Финале', 1) }
    else if (t === '32') { addRound('1/16 Финале', 16); addRound('1/8 Финале', 8); addRound('Четвртфинале', 4); addRound('Полуфинале', 2); addRound('Финале', 1) }
  }

  function allTeams() {
    const set = new Set()
    _state.rounds.forEach(r => r.matches.forEach(m => {
      if (m.home) set.add(m.home)
      if (m.away) set.add(m.away)
    }))
    return [...set].sort()
  }

  function getChampion() {
    const rounds = _state.rounds
    if (!rounds.length) return null
    const last = rounds[rounds.length - 1]
    const m = last.matches[0]
    if (!m) return null
    const res = _state.results[m.id]
    return res?.winner || null
  }

  return {
    state: getState(),
    setName, addRound, updateRound, deleteRound,
    setSlot, getMatch, getRoundOfMatch,
    ensureResult, updateResult, addGoal, removeGoal, adjStat,
    setSelMatch, resetTournament, loadTemplate, allTeams, getChampion,
  }
}