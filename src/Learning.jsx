import React, { useMemo } from 'react';
import './styles/learning.css';

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

const CATALOG = [
    { id: 'c1', title: 'Системный дизайн для разработчиков', provider: 'Coursera', hours: 18, skillsGain: ['System Design','Scalability','Architecture'] },
    { id: 'c2', title: 'Лидерство для инженеров', provider: 'Skillbox', hours: 12, skillsGain: ['Leadership','Mentoring','People Management'] },
    { id: 'c3', title: 'SQL продвинутый', provider: 'Stepik', hours: 10, skillsGain: ['SQL','Query Tuning','Data Modeling'] },
    { id: 'c4', title: 'Frontend Architecture', provider: 'Udemy', hours: 14, skillsGain: ['Architecture','React Patterns','Testing'] },
    { id: 'c5', title: 'Data Literacy базовый', provider: 'Internal', hours: 6, skillsGain: ['Data Literacy','Analytics','Charts'] },
    { id: 'c6', title: 'Python для анализа данных', provider: 'Coursera', hours: 16, skillsGain: ['Python','Pandas','Visualization'] },
    { id: 'c7', title: 'Коммуникации и переговоры', provider: 'Internal', hours: 8, skillsGain: ['Communication','Negotiation','Soft Skills'] },
    { id: 'c8', title: 'CI/CD практики', provider: 'Udemy', hours: 9, skillsGain: ['CI/CD','Automation','DevOps'] },
    { id: 'c9', title: 'Проектный менеджмент основы', provider: 'Internal', hours: 11, skillsGain: ['Project Management','Planning','Risk'] }
];

function CourseCard({ data, badge }) {
    return (
        <div className="Card CourseCard">
            <div className="Card__head">
                <div className="Card__titleBox">
                    <h4 className="Card__title">{data.title}</h4>
                    <div className="CourseCard__meta">{data.provider} • {data.hours} ч</div>
                </div>
                {badge ? <span className="CourseCard__badge">Рекомендовано</span> : null}
            </div>
            <div className="CourseCard__tags">
                {data.skillsGain.map(s => (
                    <span key={s} className="Tag">{s}</span>
                ))}
            </div>
            <div className="CourseCard__actions">
                <button className="Button gradient-bg">Записаться</button>
            </div>
        </div>
    );
}

export default function Learning() {
    const profile = readProfile();
    const mySkills = Array.isArray(profile.skills) ? profile.skills : [];

    const recommended = useMemo(() => {
        return [...CATALOG]
            .map(c => ({ c, score: Math.round(jaccard(mySkills, c.skillsGain) * 100) }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 6)
            .map(x => x.c);
    }, [mySkills]);

    return (
        <div className="LearningPage">
            <main className="MainLearning">
                <section className="Card">
                    <div className="Card__head">
                        <h2 className="Card__title">Каталог курсов</h2>
                        <svg className="Ico Ico--violet" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M4 4h12a4 4 0 014 4v12H8a4 4 0 00-4-4V4z" />
                        </svg>
                    </div>
                    <div className="Grid">
                        {CATALOG.map(item => (
                            <CourseCard key={item.id} data={item} />
                        ))}
                    </div>
                </section>

                <section className="Card">
                    <div className="Card__head">
                        <h3 className="Card__title">Рекомендовано лично для вас</h3>
                    </div>
                    <div className="Grid">
                        {recommended.map(item => (
                            <CourseCard key={item.id} data={item} badge />
                        ))}
                    </div>
                </section>
            </main>

            <footer className="Footer">
                <p>Ⓒpowered by Жёлтые козырьки 2025</p>
            </footer>
        </div>
    );
}
