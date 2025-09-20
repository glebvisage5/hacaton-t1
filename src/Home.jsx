import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocalProfile } from './hooks/useLocalProfile';
import { useAuth } from './stories/useAuth';
import './styles/home.css';

function RingProgress({ percent = 0 }) {
    const p = Math.max(0, Math.min(100, Math.round(percent)));
    const r = 46;
    const c = 2 * Math.PI * r;
    const off = c * (1 - p / 100);
    return (
        <svg className="Ring" viewBox="0 0 100 100" aria-label={`Заполнено ${p}%`}>
            <circle cx="50" cy="50" r="46" stroke="#e5e7eb" strokeWidth="8" fill="none" />
            <circle
                cx="50"
                cy="50"
                r="46"
                stroke="#10b981"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={c}
                strokeDashoffset={off}
                transform="rotate(-90 50 50)"
            />
            <text x="50" y="55" textAnchor="middle" fontSize="18" fill="#0f172a">{p}%</text>
        </svg>
    );
}

function MiniBadges({ profile }) {
    const list = useMemo(() => {
        const arr = [];
        const skills = profile.skills?.length || 0;
        const xp = profile.xp || 0;
        if (skills >= 10) arr.push({ name: 'Эксперт 10+', cls: 'Badge Badge--indigo' });
        if (xp >= 400) arr.push({ name: 'Амбициозный профи', cls: 'Badge Badge--sky' });
        if (xp >= 700) arr.push({ name: 'Будущий лидер', cls: 'Badge Badge--purple' });
        const keys = ['fullName', 'role', 'years', 'education', 'location', 'prefs', 'skills', 'projects', 'soft'];
        const filled = keys.filter(k => {
            const v = profile[k];
            return Array.isArray(v) ? v.length : (typeof v === 'number' || String(v || '').trim());
        }).length;
        const compl = filled / keys.length;
        if (compl >= 0.5) arr.push({ name: 'Профиль 50%', cls: 'Badge Badge--emerald' });
        return arr.slice(0, 3);
    }, [profile]);

    return (
        <div className="Badges">
            {list.length
                ? list.map(b => <span key={b.name} className={b.cls}>{b.name}</span>)
                : <span className="Badges__empty">Пока без достижений</span>}
        </div>
    );
}

function ChatMock({ profile }) {
    const [msgs, setMsgs] = useState([
        { role: 'assistant', html: `Привет! У вас навыки: ${(profile.skills || []).join(', ')}. Спросите про пробелы, трек, вакансии или курсы.` }
    ]);
    const [q, setQ] = useState('');
    const post = (role, html) => setMsgs(m => [...m, { role, html }]);
    const handle = (text) => {
        const t = text.toLowerCase();
        if (t.includes('пробел') || t.includes('недоста')) {
            post('assistant', 'Недостающие для Team Lead: системный дизайн, people mgmt, управленческие практики. Рекомендую курс «Лидерство для инженеров».');
        } else if (t.includes('трек') || t.includes('2 года')) {
            post('assistant', 'Трек: 0–3 мес — закрыть пробелы; 3–9 — лидерские задачи; 9–18 — ведение проекта; 18–24 — переход в Team Lead.');
        } else if (t.includes('ваканс')) {
            post('assistant', 'Роли: Senior Frontend (86%), Tech Lead (74%), PM ассистент (61%).');
        } else if (t.includes('курс')) {
            post('assistant', 'Курсы: Системный дизайн, Лидерство, Архитектура фронтенда.');
        } else {
            post('assistant', 'Принято. Сопоставляю профиль с целями и формирую план.');
        }
    };
    return (
        <div className="Chat">
            <div className="Chat__window">
                {msgs.map((m, i) => (
                    <div key={i} className={`Chat__msg ${m.role === 'user' ? 'Chat__msg--user' : ''}`} dangerouslySetInnerHTML={{ __html: m.html }} />
                ))}
            </div>
            <div className="Chat__controls">
                <input
                    className="Input Input--chat"
                    placeholder="Спросите: какие у меня пробелы под тимлида?"
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter' && q.trim()) {
                            post('user', q);
                            setQ('');
                            setTimeout(() => handle(q), 200);
                        }
                    }}
                />
                <button
                    className="Button gradient-bg"
                    onClick={() => {
                        if (!q.trim()) return;
                        post('user', q);
                        setQ('');
                        setTimeout(() => handle(q), 200);
                    }}
                >
                    Отправить
                </button>
            </div>
            <div className="Chat__suggests">
                {['Карьерный трек на 2 года', 'Недостающие навыки', 'Рекомендованные вакансии'].map(s => (
                    <button key={s} className="Suggest" onClick={() => { post('user', s); setTimeout(() => handle(s), 150); }}>{s}</button>
                ))}
            </div>
        </div>
    );
}

export default function Home() {
    const { profile } = useLocalProfile();
    const { role } = useAuth();
    const completeness = useMemo(() => {
        const keys = ['fullName', 'years', 'education', 'location', 'prefs', 'skills', 'projects', 'soft'];
        const filled = keys.filter(k => {
            const v = profile[k];
            return Array.isArray(v) ? v.length > 0 : (typeof v === 'number' || String(v || '').trim().length > 0);
        }).length;
        return filled / keys.length;
    }, [profile]);
    const score = useMemo(() => {
        const c = completeness;
        const xp = Math.min(1, (profile.xp || 0) / 800);
        const skills = Math.min(1, (profile.skills?.length || 0) / 12);
        return Math.round((0.45 * c + 0.25 * xp + 0.3 * skills) * 100);
    }, [completeness, profile]);
    const [goals, setGoals] = useState({ short: '', long: '', steps: '' });
    useEffect(() => {
        try {
            const g = JSON.parse(localStorage.getItem('hr_goals') || 'null');
            if (g) setGoals(g);
        } catch {}
    }, []);
    const saveGoals = () => {
        localStorage.setItem('hr_goals', JSON.stringify(goals));
    };
    return (
        <div className="HomePage">
            <main className="MainHome">
                <section className="MainHome__Grid">
                    <aside className="MainHome__Left">
                        <section className="Card">
                            <div className="Card__head">
                                <h2 className="Card__title">Заполнение профиля</h2>
                                <svg className="Ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="9" />
                                    <path d="M12 3a9 9 0 0 1 0 18" />
                                </svg>
                            </div>
                            <div className="Progress">
                                <RingProgress percent={completeness * 100} />
                                <div className="Progress__stat">
                                    <div className="Progress__label">Заполнено</div>
                                    <div className="Progress__value">{Math.round(completeness * 100)}%</div>
                                    <div className="Progress__hint">Рейтинг: <b>{score}/100</b></div>
                                </div>
                            </div>
                        </section>
                        <section className="Card">
                            <div className="Card__head">
                                <h3 className="Card__title">Личные цели</h3>
                                <svg className="Ico Ico--indigo" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 3a7 7 0 110 14 7 7 0 010-14zm0 2a5 5 0 100 10 5 5 0 000-10zm1 4h3v2h-5V7h2v4z" />
                                </svg>
                            </div>
                            <div className="Goals">
                                <input
                                    className="Input"
                                    placeholder="Ближайшая цель (3–6 мес.)"
                                    value={goals.short}
                                    onChange={e => setGoals(g => ({ ...g, short: e.target.value }))}
                                />
                                <input
                                    className="Input"
                                    placeholder="Долгосрочная цель (1–2 года)"
                                    value={goals.long}
                                    onChange={e => setGoals(g => ({ ...g, long: e.target.value }))}
                                />
                                <textarea
                                    className="Textarea"
                                    rows={3}
                                    placeholder="Шаги: пройти курс..., взять проект..."
                                    value={goals.steps}
                                    onChange={e => setGoals(g => ({ ...g, steps: e.target.value }))}
                                />
                                <button className="Button Button--green" onClick={saveGoals}>Сохранить</button>
                            </div>
                        </section>
                        <section className="Card">
                            <h3 className="Card__title">Достижения</h3>
                            <MiniBadges profile={profile} />
                        </section>
                    </aside>
                    <section className="MainHome__Right">
                        <section className="Card">
                            <div className="Card__head">
                                <h2 className="Card__title">Персональный ИИ-консультант</h2>
                                <svg className="Ico Ico--blue" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M4 4h16v9H7l-3 3V4z" />
                                    <path d="M9 13h11v7l-3-3H9z" />
                                </svg>
                            </div>
                            <ChatMock profile={profile} />
                        </section>
                        <section className="Card">
                            <div className="Card__head">
                                <h3 className="Card__title">Лента рекомендаций</h3>
                                <svg className="Ico Ico--amber" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
                                </svg>
                            </div>
                            <div className="Reco">
                                <Link to="/learning" className="Pill gradient-bg">Курсы →</Link>
                                <Link to="/opportunities" className="Pill gradient-bg">Вакансии →</Link>
                                <Link to="/opportunities#projects" className="Pill gradient-bg">Проекты →</Link>
                            </div>
                        </section>
                        {role === 'manager' && (
                            <section className="Card">
                                <div className="Card__head">
                                    <h3 className="Card__title">Панель руководителя (сводка)</h3>
                                    <svg className="Ico Ico--emerald" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M3 3h2v18H3zM7 13h2v8H7zM11 9h2v12h-2zM15 5h2v16h-2zM19 2h2v19h-2z" />
                                    </svg>
                                </div>
                                <ul className="List">
                                    <li>3 кандидата с match ≥ 80% под вашу открытую вакансию</li>
                                    <li>Навык месяца: <b>Data Literacy</b></li>
                                    <li>Новые челленджи подразделения активированы</li>
                                </ul>
                                <div className="Card__action">
                                    <Link to="/hr-analytics" className="Link">Перейти в HR-аналитику →</Link>
                                </div>
                            </section>
                        )}
                    </section>
                </section>
            </main>
            <footer className="Footer">
                <p>Ⓒpowered by Жёлтые козырьки 2025</p>
            </footer>
        </div>
    );
}
