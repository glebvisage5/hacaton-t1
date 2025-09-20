import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/authentification.css';

export default function Registration() {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        login: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [touched, setTouched] = useState({
        login: false,
        email: false,
        password: false,
        confirmPassword: false,
    });
    const [submittedOk, setSubmittedOk] = useState(false);

    const errors = useMemo(() => {
        const e = {};
        if (!values.login.trim()) e.login = 'Поле обязательно для заполнения';
        else if (values.login.trim().length < 3) e.login = 'Введите корректный логин (мин. 3 символа)';
        if (!values.email.trim()) e.email = 'Поле обязательно для заполнения';
        else if (!/^\S+@\S+\.\S+$/.test(values.email)) e.email = 'Введите корректный e-mail';
        if (!values.password) e.password = 'Поле обязательно для заполнения';
        else if (values.password.length < 8) e.password = 'Пароль должен быть не короче 8 символов';
        if (!values.confirmPassword) e.confirmPassword = 'Поле обязательно для заполнения';
        else if (values.confirmPassword !== values.password) e.confirmPassword = 'Пароли не совпадают';
        return e;
    }, [values]);

    const isValid = Object.keys(errors).length === 0;

    const setField = (name, val) => setValues(v => ({ ...v, [name]: val }));
    const touch = (name) => setTouched(t => ({ ...t, [name]: true }));

    const onSubmit = (e) => {
        e.preventDefault();
        setTouched({ login: true, email: true, password: true, confirmPassword: true });
        if (!isValid) return;
        console.log('REGISTRATION ->', values);
        setSubmittedOk(true);
        setTimeout(() => navigate('/auth'), 900);
    };

    return (
        <div className="AuthPage">
            <main className="MainAuthentification">
                <section className="MainAuthentification__Header">
                    <p className="Header__title">Регистрация учётной записи</p>
                </section>

                <section className="MainAuthentification__Form">
                <div className="MainAuthentification__Form__Container">
                    <form id="registrationForm" className="Container" onSubmit={onSubmit}>
                        <div className="Field">
                            <input id="login" name="login" type="text" placeholder=" "
                                className={`Input ${values.login ? 'Input--filled' : ''} ${touched.login && errors.login ? 'Input--error' : ''}`}
                                value={values.login} onChange={(e) => setField('login', e.target.value)} onBlur={() => touch('login')}/>
                            <label htmlFor="login" className="Label">Логин <span className="Label__req">*</span></label>
                            {touched.login && errors.login && <p className="Error">{errors.login}</p>}
                        </div>

                        <div className="Field">
                            <input id="email" name="email" type="email" placeholder=" "
                                className={`Input ${values.email ? 'Input--filled' : ''} ${touched.email && errors.email ? 'Input--error' : ''}`}
                                value={values.email} onChange={(e) => setField('email', e.target.value)} onBlur={() => touch('email')}/>
                            <label htmlFor="email" className="Label">E-mail <span className="Label__req">*</span></label>
                            {touched.email && errors.email && <p className="Error">{errors.email}</p>}
                        </div>

                        <div className="Field">
                            <input id="password" name="password" type="password" placeholder=" "
                                className={`Input ${values.password ? 'Input--filled' : ''} ${touched.password && errors.password ? 'Input--error' : ''}`}
                                value={values.password} onChange={(e) => setField('password', e.target.value)} onBlur={() => touch('password')}/>
                            <label htmlFor="password" className="Label">Введите пароль <span className="Label__req">*</span></label>
                            {touched.password && errors.password && <p className="Error">{errors.password}</p>}
                        </div>

                        <div className="Field">
                            <input id="confirmPassword" name="confirmPassword" type="password" placeholder=" "
                                className={`Input ${values.confirmPassword ? 'Input--filled' : ''} ${touched.confirmPassword && errors.confirmPassword ? 'Input--error' : ''}`}
                                value={values.confirmPassword} onChange={(e) => setField('confirmPassword', e.target.value)} onBlur={() => touch('confirmPassword')}/>
                            <label htmlFor="confirmPassword" className="Label">Повторите пароль <span className="Label__req">*</span></label>
                            {touched.confirmPassword && errors.confirmPassword && <p className="Error">{errors.confirmPassword}</p>}
                        </div>

                        {submittedOk && isValid && (
                            <p style={{ color: 'var(--main-color)', fontWeight: 600 }}>Аккаунт создан! Перенаправление на авторизацию…</p>
                        )}

                        <div className="Main__Navigation">
                            <Link to="/auth" className="Nav__link">Есть аккаунт?</Link>
                            <Link to="/" className="Nav__link" style={{ marginTop: '.6rem' }}>На главную</Link>
                        </div>

                        <button id="submitBtn" type="submit" disabled={!isValid} className={`MainAuthentification__Form__Button ${isValid ? 'is-enabled' : ''}`}>
                            Зарегистрироваться
                        </button>

                        
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
