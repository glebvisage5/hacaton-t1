import React, { useMemo } from 'react';
import './styles/career-path.css';

function readProfile() {
    try { return JSON.parse(localStorage.getItem('hr_profile') || '{}'); }
    catch { return {}; }
}
function uniqLower(a = []) {
    const seen = new Set();
    return a.filter(x => {
        const k = String(x).toLowerCase();
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
    });
}
const TARGET_ROLE = {
    title: 'Team Lead (Frontend)',
    skillsReq: ['Leadership', 'System Design', 'Architecture', 'React', 'People Management']
};

export default function CareerPath() {
    const profile = readProfile();
    const mySkills = Array.isArray(profile.skills) ? profile.skills : [];

    const gaps = useMemo(() => {
        const have = mySkills.map(s => s.toLowerCase());
        return TARGET_ROLE.skillsReq.filter(s => !have.includes(s.toLowerCase()));
    }, [mySkills]);

    const steps = useMemo(() => ([
        { t: 'Курсы (0–3 мес.)', d: gaps.length ? `Фокус: ${gaps.slice(0, 3).join(', ')}` : 'Повторить ключевые темы' },
        { t: 'Опыт (3–9 мес.)', d: 'Вести фичу end-to-end, участвовать в оценках, менторить 1–2 коллег' },
        { t: 'Новые роли (9–18 мес.)', d: 'Технический лидер модуля / Acting TL' },
        { t: 'Переход (18–24 мес.)', d: TARGET_ROLE.title }
    ]), [gaps]);

    const actions = useMemo(() => ([
        `Пройти курс: ${gaps[0] ? gaps[0] : 'Системный дизайн'}`,
        'Добавить проект с лидерской ролью',
        'Участвовать в собеседовании на Acting TL'
    ]), [gaps]);

    const nowWhere = `${profile.role || '—'}, навыков: ${mySkills.length}`;
    const targetWhere = `${TARGET_ROLE.title}, пробелы: ${gaps.length ? gaps.join(', ') : 'минимальны'}`;

    return (
        <div className="PathPage">
            <main className="MainPath">
                <div className="MainPath__Grid">
                    <section className="Card">
                        <div className="Card__head">
                            <h2 className="Card__title">Дорожная карта</h2>
                            <svg className="Ico Ico--emerald" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M11 2h2v20h-2zM7 6h10l2 3-2 3H7l-2-3 2-3z"/>
                            </svg>
                        </div>
                        <ol className="Roadmap">
                            {steps.map((s, i) => (
                                <li key={i} className="Roadmap__item">
                                    <div className={`Dot ${i === 0 ? 'Dot--active' : ''}`} />
                                    <div className="Roadmap__content">
                                        <div className="Roadmap__title">{i + 1}. {s.t}</div>
                                        <div className="Roadmap__desc">{s.d}</div>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </section>

                    <aside className="Aside">
                        <section className="Card">
                            <h3 className="Card__title">Где я vs. Где хочу быть</h3>
                            <div className="Compare">
                                <div className="Compare__row">
                                    <span className="Compare__label">Цель</span>
                                    <span className="Compare__val">{TARGET_ROLE.title}</span>
                                </div>
                                <div className="Compare__row">
                                    <span className="Compare__label">Где я</span>
                                    <span className="Compare__val">{nowWhere}</span>
                                </div>
                                <div className="Compare__row">
                                    <span className="Compare__label">Куда иду</span>
                                    <span className="Compare__val">{targetWhere}</span>
                                </div>
                            </div>
                        </section>

                        <section className="Card">
                            <h3 className="Card__title">Рекомендованные действия</h3>
                            <ul className="Todo">
                                {uniqLower(actions).map((a, i) => <li key={i}>{a}</li>)}
                            </ul>
                        </section>
                    </aside>
                </div>
            </main>

            <footer className="Footer">
                <p>Ⓒpowered by Жёлтые козырьки 2025</p>
            </footer>
        </div>
    );
}
