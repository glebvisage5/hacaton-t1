import logo from '../assets/logo.svg'

export default function Header(){
    return (
        <header className="header">
            <div style={{display:'flex',alignItems:'center',gap:12}}>
                <img src={logo} width={120} height={36} alt="HR Консультант"/>
            </div>
            <nav className="nav">
                <a href="#" className="active">Профиль</a>
                <a href="#">Возможности</a>
                <a href="#">Обучение</a>
                <a href="#">Путь</a>
                <a href="#">HR-аналитика</a>
            </nav>
        </header>
    )
}
