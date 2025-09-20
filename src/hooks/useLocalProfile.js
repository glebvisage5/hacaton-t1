import { create } from 'zustand'

const defaultProfile = {
    fullName: 'Иван Иванов',
    role: 'Frontend Developer',
    years: 3,
    education: 'ГУУ',
    location: 'Москва',
    prefs: 'Team Lead, Архитектор',
    skills: ['React','TypeScript','CSS','Node.js'],
    skillLevels: { React:70, TypeScript:60, 'Node.js':45, CSS:55 },
    soft: 'Коммуникации, наставничество',
    projects: 'ЛК клиента, дизайн-система, миграция на TS',
    rotation: '1-3',
    xp: 240,
    endorsements: [
        { skill:'React', by:'Мария', count:2 },
        { skill:'TypeScript', by:'Дмитрий', count:1 },
    ],
    searching: true,
}

const calcCompleteness = (p) => {
    const keys = ['fullName','role','years','education','location','prefs','skills','projects','soft']
    const f = keys.filter(k=>{
        const v = p[k]
        return Array.isArray(v) ? v.length>0 : (typeof v==='number' || String(v||'').trim().length>0)
    }).length
    return f / keys.length
}

const calcScore = (p) => {
    const c = calcCompleteness(p)
    const xp = Math.min(1, (p.xp||0)/800)
    const skills = Math.min(1, (p.skills?.length||0)/12)
    return Math.round((0.45*c + 0.25*xp + 0.3*skills) * 100)
}

const load = () => {
    const raw = localStorage.getItem('hr_profile')
    return raw ? JSON.parse(raw) : defaultProfile
}

const save = (p) => localStorage.setItem('hr_profile', JSON.stringify(p))

export const useLocalProfile = create((set, get) => {
    const initial = load()
    return {
        profile: initial,
        completeness: calcCompleteness(initial),
        score: calcScore(initial),
        setProfile: (partial) => {
            const p = { ...get().profile, ...partial }
            save(p)
            set({ profile: p, completeness: calcCompleteness(p), score: calcScore(p) })
        },
        addEndorsement: (e) => {
            const curr = get().profile
            const found = curr.endorsements.find(x => x.skill.toLowerCase() === e.skill.toLowerCase())
            if (found) found.count += 1; else curr.endorsements.push({ ...e, count: 1 })
            save(curr)
            set({ profile: { ...curr } })
        },
        setSearching: (flag) => {
            const p = { ...get().profile, searching: !!flag }
            save(p)
            set({ profile: p })
        }
    }
})
