import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './stories/useAuth';
import './styles/authentification.css';

export default function Authentification() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [values, setValues] = useState({ login: '', password: '' });
    const [touched, setTouched] = useState({ login: false, password: false });

    const errors = useMemo(() => {
        const e = {};
        if (!values.login.trim()) e.login = 'Поле обязательно для заполнения';
        else if (values.login.trim().length < 3) e.login = 'Введите корректный логин (мин. 3 символа)';
        if (!values.password) e.password = 'Поле обязательно для заполнения';
        else if (values.password.length < 8) e.password = 'Пароль должен быть не короче 8 символов';
        return e;
    }, [values]);

    const isValid = Object.keys(errors).length === 0;
    const setField = (name, val) => setValues(v => ({ ...v, [name]: val }));

    const onSubmit = async (e) => {
        e.preventDefault();
        setTouched({ login: true, password: true });
        if (!isValid) return;
        const res = await login({ login: values.login, password: values.password });
        if (res?.ok) navigate('/', { replace: true });
    };

    return (
        <div className="AuthPage">
            <main className="MainAuthentification">
                <section className="MainAuthentification__Header">
                    <p className="Header__title">Авторизация учётной записи</p>
                </section>
                <section className="MainAuthentification__Form">
                    <div className="MainAuthentification__Form__Container">
                        <form id="authForm" className="Container" onSubmit={onSubmit}>
                            <div className="Field">
                                <input id="login" name="login" type="text" placeholder=" "
                                    className={`Input ${values.login ? 'Input--filled' : ''} ${touched.login && errors.login ? 'Input--error' : ''}`}
                                    value={values.login} onChange={(e) => setField('login', e.target.value)} onBlur={() => setTouched(t => ({ ...t, login: true }))}/>
                                <label htmlFor="login" className="Label">Логин <span className="Label__req">*</span></label>
                                {touched.login && errors.login && <p className="Error">{errors.login}</p>}
                            </div>
                            <div className="Field">
                                <input id="password" name="password" type="password" placeholder=" "
                                    className={`Input ${values.password ? 'Input--filled' : ''} ${touched.password && errors.password ? 'Input--error' : ''}`}
                                    value={values.password} onChange={(e) => setField('password', e.target.value)} onBlur={() => setTouched(t => ({ ...t, password: true }))}/>
                                <label htmlFor="password" className="Label">Пароль <span className="Label__req">*</span></label>
                                {touched.password && errors.password && <p className="Error">{errors.password}</p>}
                            </div>
                            <div className="Main__Navigation">
                                <Link to="/registration" className="Nav__link">Нет аккаунта?</Link>
                                <Link to="/recovery" className="Nav__link">Забыли пароль?</Link>
                            </div>
                            <button id="loginBtn" type="submit" disabled={!isValid} className={`MainAuthentification__Form__Button ${isValid ? 'is-enabled' : ''}`}>
                                Войти
                            </button>
                            <Link to="/" className="Nav__link">На главную</Link>
                        </form>
                    </div>
                </section>
            </main>
            <footer className="Footer">
                <p>Ⓒpowered by Жёлтые козырьки 2025</p>
            </footer>
        </div>
    );
}
