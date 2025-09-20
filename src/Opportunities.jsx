import React, { useMemo, useState } from 'react';
import './styles/opportunities.css';

function readProfile() {
    try { return JSON.parse(localStorage.getItem('hr_profile') || '{}'); }
    catch { return {}; }
}
function jaccard(a = [], b = []) {
    const A = new Set(a.map(x => String(x).toLowerCase()));
    const B = new Set(b.map(x => String(x).toLowerCase()));
    const inter = [...A].filter(x => B.has(x)).length;
    const uni = new Set([...A, ...B]).size || 1;
    return inter / uni;
}

const VACANCIES = [
    { id: 'v1', title: 'Senior Frontend Engineer', type: 'vacancy', skills: ['React','TypeScript','System Design','Testing'] },
    { id: 'v2', title: 'Data Analyst', type: 'vacancy', skills: ['SQL','Python','Data Viz'] },
    { id: 'v3', title: 'QA Automation', type: 'vacancy', skills: ['Automation','CI/CD','API Testing'] },
    { id: 'v4', title: 'Team Lead (Frontend)', type: 'vacancy', skills: ['Leadership','React','Architecture'] }
];
const PROJECTS = [
    { id: 'p1', title: 'UI Kit 2.0 (Design System)', type: 'project', skills: ['React','Architecture','Docs'] },
    { id: 'p2', title: 'Data Literacy Month', type: 'project', skills: ['Data Literacy','Analytics'] },
    { id: 'p3', title: 'Observability rollout', type: 'project', skills: ['CI/CD','DevOps'] },
    { id: 'p4', title: 'A/B Platform', type: 'project', skills: ['Python','SQL','Experimentation'] }
];

export default function Opportunities() {
    const profile = readProfile();
    const mySkills = Array.isArray(profile.skills) ? profile.skills : [];

    const [fltSkill, setFltSkill] = useState('');
    const [fltScore, setFltScore] = useState(60);
    const [fltType, setFltType] = useState('');

    const all = useMemo(() => {
        const rows = [...VACANCIES, ...PROJECTS].map(o => ({
            ...o,
            match: Math.round(jaccard(mySkills, o.skills) * 100)
        }));
        return rows.sort((a, b) => b.match - a.match);
    }, [mySkills]);

    const filtered = useMemo(() => {
        const s = fltSkill.trim().toLowerCase();
        return all.filter(x => {
            const byType = fltType ? x.type === fltType : true;
            const byScore = x.match >= fltScore;
            const bySkill = s ? x.skills.map(k => k.toLowerCase()).some(k => k.includes(s)) : true;
            return byType && byScore && bySkill;
        });
    }, [all, fltSkill, fltScore, fltType]);

    const onlyProjects = useMemo(() => PROJECTS
        .map(p => ({ ...p, match: Math.round(jaccard(mySkills, p.skills) * 100) }))
        .sort((a, b) => b.match - a.match), [mySkills]);

    return (
        <div className="OppPage">
            <main className="MainOpp">
                <aside className="Filters Card">
                    <h2 className="Card__title">Фильтры</h2>

                    <label className="Field">
                        <span className="Field__label">Навык</span>
                        <input
                            className="Input"
                            value={fltSkill}
                            onChange={e => setFltSkill(e.target.value)}
                            placeholder="react / sql / python"
                        />
                    </label>

                    <label className="Field">
                        <span className="Field__label">Минимальный match%</span>
                        <input
                            className="Range"
                            type="range"
                            min="0"
                            max="100"
                            value={fltScore}
                            onChange={e => setFltScore(Number(e.target.value))}
                            style={{ '--range-pct': `${fltScore}%` }}
                        />
                        <span className="Range__val">{fltScore}%</span>
                    </label>

                    <label className="Field">
                        <span className="Field__label">Тип</span>
                        <select className="Input" value={fltType} onChange={e => setFltType(e.target.value)}>
                            <option value="">Любой</option>
                            <option value="vacancy">Вакансии</option>
                            <option value="project">Проекты</option>
                        </select>
                    </label>
                </aside>

                <section className="Content">
                    <section className="Card">
                        <div className="Card__head">
                            <h3 className="Card__title">Подобранные возможности</h3>
                            <svg className="Ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm3.5 7.5l-2 5-5 2 2-5 5-2z"/>
                            </svg>
                        </div>
                        <div className="Grid">
                            {filtered.map(o => (
                                <div key={o.id} className="Card Card--thin">
                                    <div className="RowHead">
                                        <div>
                                            <div className="RowTitle">{o.title}</div>
                                            <div className="RowType">{o.type === 'vacancy' ? 'Вакансия' : 'Проект'}</div>
                                        </div>
                                        <div className="RowMatch">Match: <b>{o.match}%</b></div>
                                    </div>
                                    <div className="Tags">
                                        {o.skills.map(s => <span key={s} className="Tag">{s}</span>)}
                                    </div>
                                    <div className="RowActions">
                                        {o.type === 'vacancy' ? (
                                            <button className="Button gradient-bg">Отклик в 1 клик</button>
                                        ) : (
                                            <button className="Button gradient-bg">Присоединиться</button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {!filtered.length && (
                                <div className="Muted">Ничего не найдено по текущим фильтрам</div>
                            )}
                        </div>
                    </section>

                    <section id="projects" className="Card">
                        <h3 className="Card__title">Рекомендованные проекты</h3>
                        <div className="Grid">
                            {onlyProjects.map(p => (
                                <div key={p.id} className="Card Card--thin">
                                    <div className="RowHead">
                                        <div className="RowTitle">{p.title}</div>
                                        <div className="RowMatch">Match: <b>{p.match}%</b></div>
                                    </div>
                                    <div className="Tags">
                                        {p.skills.map(s => <span key={s} className="Tag">{s}</span>)}
                                    </div>
                                    <div className="RowActions">
                                        <button className="Button gradient-bg">Присоединиться</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </section>
            </main>

            <footer className="Footer">
                <p>Ⓒpowered by Жёлтые козырьки 2025</p>
            </footer>
        </div>
    );
}
