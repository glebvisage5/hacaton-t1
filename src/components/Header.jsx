import React from 'react';
import { Link, NavLink } from 'react-router-dom'
import './header.css';

export default function Header(){

    return (
        <>
            <header className='Header'>
                <div className='Logo'>
                    <img src="/logo.png" alt="Hr-консультант" />
                    <Link to="/">Hr-консультант</Link>
                </div>
                <nav className='Navigation'>
                    <NavLink to="/" end>Главная страница</NavLink>
                    <NavLink to="/how-it-works">Как это работает?</NavLink>
                    <NavLink to="/contacts">Контакты</NavLink>
                </nav>
                <section className='Buttons'>
                    <Link to="/auth">Войти</Link>
                    <Link to="/registration">Зарегистрироваться</Link>
                </section>
            </header>
        </>
    );
}
