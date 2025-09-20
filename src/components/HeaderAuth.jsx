import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../stories/useAuth';
import './header.css';

export default function Header(){
    const navigate = useNavigate();
    const { logout, role } = useAuth();

    const onLogout = () => {
        logout();
        navigate('/', { replace: true });
    };

    return (
        <>
            <header className="Header">
                <div className="Logo">
                    <img src="/logo.png" alt="Hr-консультант" />
                    <Link to="/">Hr-консультант</Link>
                </div>
                <nav className="Navigation">
                    <NavLink to="/" className="active">Главная</NavLink>
                    <NavLink to="/profile">Профиль</NavLink>
                    <NavLink to="/opportunities">Возможности</NavLink>
                    <NavLink to="/learning">Обучение</NavLink>
                    <NavLink to="/career-path">Путь</NavLink>
                    {role === 'manager' && <NavLink to="/hr-analytics">HR-аналитика</NavLink>}
                </nav>
                <section className="Buttons">
                    <Link onClick={onLogout}>Выйти из аккаунта</Link>
                </section>
            </header>
        </>
    );
}
