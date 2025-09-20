import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from './stories/useAuth';
import './styles/profile.css';

function readProfile() {
    try { return JSON.parse(localStorage.getItem('hr_profile') || '{}'); }
    catch { return {}; }
}
function writeProfile(p) { localStorage.setItem('hr_profile', JSON.stringify(p)); }

function calcCompleteness(p) {
    const keys = ['fullName','role','years','education','location','prefs','skills','projects','soft'];
    const filled = keys.filter(k => {
        const v = p[k];
        if (Array.isArray(v)) return v.length > 0;
        if (typeof v === 'number') return true;
        return String(v || '').trim().length > 0;
    }).length;
    return filled / keys.length;
}
function calcScore(p) {
    const c = calcCompleteness(p);
    const xp = Math.min(1, (p.xp || 0) / 800);
    const skills = Math.min(1, (p.skills?.length || 0) / 12);
    return Math.round((0.45 * c + 0.25 * xp + 0.3 * skills) * 100);
}

export default function Profile() {
    const { isAdmin, role } = useAuth();
    const admin = typeof isAdmin === 'function' ? isAdmin() : (role === 'manager' || role === 'admin');

    const [profile, setProfile] = useState(() => {
        const init = readProfile();
        if (!Array.isArray(init.skills)) init.skills = [];
        if (!init.skillLevels) init.skillLevels = {};
        if (typeof init.searching !== 'boolean') init.searching = true;
        return init;
    });
    const [skillsInput, setSkillsInput] = useState(() => (readProfile().skills || []).join(', '));
    const [endorseSkill, setEndorseSkill] = useState('');
    const [endorseBy, setEndorseBy] = useState('');
    const [saved, setSaved] = useState(false);

    const [files, setFiles] = useState(() => {
        try { return JSON.parse(localStorage.getItem('hr_files') || '[]'); }
        catch { return []; }
    });
    const [isUploadOpen, setUploadOpen] = useState(false);

    const completeness = useMemo(() => calcCompleteness(profile), [profile]);
    const score = useMemo(() => calcScore(profile), [profile]);

    useEffect(() => { writeProfile(profile); }, [profile]);
    useEffect(() => { localStorage.setItem('hr_files', JSON.stringify(files)); }, [files]);

    const updateField = (k, v) => setProfile(p => ({ ...p, [k]: v }));

    const syncSkillsFromInput = () => {
        const arr = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
        setProfile(p => ({ ...p, skills: arr }));
    };
    const saveProfileNow = () => { writeProfile(profile); setSaved(true); setTimeout(() => setSaved(false), 1500); };
    const setSearching = (flag) => updateField('searching', !!flag);

    const addEndorsement = () => {
        if (!endorseSkill.trim() || !endorseBy.trim()) return;
        const list = Array.isArray(profile.endorsements) ? [...profile.endorsements] : [];
        const idx = list.findIndex(x => x.skill.toLowerCase() === endorseSkill.trim().toLowerCase());
        if (idx >= 0) list[idx] = { ...list[idx], count: (list[idx].count || 0) + 1, by: endorseBy.trim() };
        else list.push({ skill: endorseSkill.trim(), by: endorseBy.trim(), count: 1 });
        setProfile(p => ({ ...p, endorsements: list, xp: (p.xp || 0) + 10 }));
        setEndorseSkill('');
        setEndorseBy('');
    };

    const sliderSkills = useMemo(() => {
        const base = profile.skills || [];
        const extra = ['Leadership'];
        const merged = [...base, ...extra].filter((v, i, a) => a.findIndex(x => x.toLowerCase() === v.toLowerCase()) === i);
        return merged.slice(0, 10);
    }, [profile.skills]);

    const setSkillLevel = (name, val) => {
        const lvl = Math.max(0, Math.min(5, Number(val) || 0));
        setProfile(p => ({ ...p, skillLevels: { ...(p.skillLevels || {}), [name]: lvl } }));
    };

    const onFilesSelect = (e) => {
        const list = Array.from(e.target.files || []);
        if (!list.length) return;
        const mapped = list.map(f => ({ id: `${f.name}_${f.size}_${f.lastModified}`, name: f.name, size: f.size }));
        setFiles(prev => {
            const ids = new Set(prev.map(x => x.id));
            const merged = [...prev];
            mapped.forEach(m => { if (!ids.has(m.id)) merged.push(m); });
            return merged;
        });
        e.target.value = '';
    };
    const removeFile = (id) => setFiles(prev => prev.filter(f => f.id !== id));

    return (
        <div className="Page">
            <div className="ProfilePage">
                <main className="MainProfile">
                    <div className="MainProfile__Grid">
                        <aside className="MainProfile__Left">
                            <section className="Card Card--compact">
                                <h2 className="Card__title">Статус и поиск</h2>
                                <div className="Status">
                                    <div className="Status__row">Заполненность: <b>{Math.round(completeness * 100)}%</b></div>
                                    <div className="Status__row">XP: <b>{profile.xp || 0}</b></div>
                                    <div className="Status__row">Рейтинг: <b>{score}/100</b></div>
                                    <div className="Status__actions">
                                        <button className={`Button Button--toggle ${profile.searching ? 'is-active' : ''}`} aria-pressed={profile.searching ? 'true' : 'false'} onClick={() => setSearching(true)}>Ищу вакансию</button>
                                        <button className={`Button Button--toggle ${!profile.searching ? 'is-active' : ''}`} aria-pressed={!profile.searching ? 'true' : 'false'} onClick={() => setSearching(false)}>Не ищу</button>
                                    </div>
                                    <div className="Bar"><div className="Bar__fill" style={{ width: `${Math.round(completeness * 100)}%` }} /></div>
                                </div>
                            </section>

                            <section className="Card Card--compact">
                                <h3 className="Card__title">Социальная валидация</h3>
                                <div className="Muted">{admin ? 'Вы можете подтверждать навыки сотрудников.' : 'Коллеги могут подтверждать ваши навыки.'}</div>

                                <div className="EndorseList">
                                    {(profile.endorsements || []).length === 0 && <div className="Muted">Пока нет подтверждений</div>}
                                    {(profile.endorsements || []).map((e, i) => (
                                        <div key={i} className="Endorse Endorse--pill">
                                            <div className="Endorse__left">
                                                <span className="Endorse__chip">{e.skill}</span>
                                                <span className="Endorse__count">— {e.count} подтвержд.</span>
                                            </div>
                                            <div className="Endorse__right">
                                                <span className="Endorse__rightText">посл.: <b>{e.by}</b></span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {admin && (
                                    <>
                                        <div className="EndorseForm EndorseForm--inline">
                                            <input id="endorseSkill" className="Input" placeholder="Навык" value={endorseSkill} onChange={e => setEndorseSkill(e.target.value)} />
                                            <input id="endorseBy" className="Input" placeholder="Коллега" value={endorseBy} onChange={e => setEndorseBy(e.target.value)} />
                                            <button id="endorseAdd" className="Button gradient-bg" onClick={addEndorsement}>Подтв.</button>
                                        </div>
                                        <div className="Card__action">
                                            <button className="Button gradient-bg" onClick={() => setUploadOpen(true)}>Загрузить файлы</button>
                                        </div>
                                    </>
                                )}
                            </section>
                        </aside>

                        <section className="MainProfile__Right">
                            <section className="Card">
                                <h2 className="Card__title">Основная информация</h2>
                                <div className="FormGrid">
                                    <label className="Field"><span className="Field__label">ФИО</span><input className="Input" value={profile.fullName || ''} onChange={e => updateField('fullName', e.target.value)} /></label>
                                    <label className="Field"><span className="Field__label">Должность</span><input className="Input" value={profile.role || ''} onChange={e => updateField('role', e.target.value)} /></label>
                                    <label className="Field"><span className="Field__label">Опыт (лет)</span><input className="Input" type="number" min="0" value={profile.years || 0} onChange={e => updateField('years', Number(e.target.value) || 0)} /></label>
                                    <label className="Field"><span className="Field__label">Место обучения</span><input className="Input" placeholder="Вуз/курсы" value={profile.education || ''} onChange={e => updateField('education', e.target.value)} /></label>
                                </div>
                                <div className="FormGrid">
                                    <label className="Field"><span className="Field__label">Локация</span><input className="Input" value={profile.location || ''} onChange={e => updateField('location', e.target.value)} /></label>
                                    <label className="Field"><span className="Field__label">Карьерные предпочтения</span><input className="Input" placeholder="Хочу быть менеджером..." value={profile.prefs || ''} onChange={e => updateField('prefs', e.target.value)} /></label>
                                </div>
                            </section>

                            <section className="Card">
                                <h3 className="Card__title">Навыки</h3>
                                <div className="Muted">Введите через запятую. Для уровней используйте слайдеры (0–5). Максимум 10 навыков</div>
                                <input className="Input mt" value={skillsInput} onChange={e => setSkillsInput(e.target.value)} onBlur={syncSkillsFromInput} placeholder="React, TypeScript, System Design" />
                                <div className="Sliders">
                                    {sliderSkills.map(s => {
                                        const v = profile.skillLevels?.[s] ?? 5;
                                        const pct = Math.round((Number(v) / 5) * 100);
                                        return (
                                            <div key={s} className="SliderRow">
                                                <span className="SliderRow__name">{s}</span>
                                                <input
                                                    className="SliderRow__input input-range"
                                                    type="range"
                                                    min="0"
                                                    max="5"
                                                    value={v}
                                                    style={{ '--range-pct': `${pct}%` }}
                                                    onChange={e => {
                                                        const val = e.target.value;
                                                        e.target.style.setProperty('--range-pct', `${Math.round((Number(val) / 5) * 100)}%`);
                                                        setSkillLevel(s, val);
                                                    }}
                                                />
                                                <span className="SliderRow__val">{v}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            <section className="Card">
                                <h3 className="Card__title">Проекты</h3>
                                <textarea className="Textarea" rows={4} placeholder="Опишите 2–3 проекта" value={profile.projects || ''} onChange={e => updateField('projects', e.target.value)} />
                            </section>

                            <section className="Card">
                                <h3 className="Card__title">Софт-скиллы</h3>
                                <input className="Input mt" placeholder="Коммуникации, лидерство..." value={profile.soft || ''} onChange={e => updateField('soft', e.target.value)} />
                            </section>

                            <div className="SaveRow">
                                <button className="Button gradient-bg" onClick={saveProfileNow}>Сохранить профиль</button>
                                <span className={`SaveMsg ${saved ? '' : 'is-hidden'}`}>Сохранено ✓</span>
                            </div>
                        </section>
                    </div>
                </main>

                <footer className="Footer"><p>Ⓒpowered by Жёлтые козырьки 2025</p></footer>
            </div>

            {isUploadOpen && (
                <div className="Modal" role="dialog" aria-modal="true" aria-label="Загрузка файлов">
                    <div className="Modal__backdrop" onClick={() => setUploadOpen(false)} />
                    <div className="Modal__panel">
                        <div className="Modal__header">
                            <h4 className="Modal__title">Загрузка файлов</h4>
                            <button className="Modal__close" onClick={() => setUploadOpen(false)} aria-label="Закрыть">×</button>
                        </div>
                        <div className="Modal__body">
                            <input className="Upload__input" type="file" multiple onChange={onFilesSelect} />
                            <div className="Upload__list">
                                {files.length === 0 && <div className="Muted">Файлы не прикреплены</div>}
                                {files.map(f => (
                                    <div key={f.id} className="Upload__item">
                                        <span className="Upload__name">{f.name}</span>
                                        <button className="Upload__remove" onClick={() => removeFile(f.id)}>Удалить</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="Modal__actions">
                            <button className="Button gradient-bg" onClick={() => setUploadOpen(false)}>Готово</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
