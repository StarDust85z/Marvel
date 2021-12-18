import './appHeader.scss';

const AppHeader = (props) => {
    return (
        <header className="app__header">
            <h1 className="app__title">
                <a href="#">
                    <span>Marvel</span> information portal
                </a>
            </h1>
            <nav className="app__menu">
                <ul>
                    <li><a href="#"
                           onClick={() => props.onPageSelect(0)}>
                               Characters</a></li>
                    /
                    <li><a href="#"
                           onClick={() => props.onPageSelect(1)}>
                               Comics</a></li>
                </ul>
            </nav>
        </header>
    )
}

export default AppHeader;