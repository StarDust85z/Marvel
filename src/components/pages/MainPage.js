import { useState } from "react"
import { Helmet } from "react-helmet-async";

import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import CharSearch from "../charSearch/CharSearch";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";
import AnimatedPage from '../pages/AnimatedPage';

import decoration from '../../resources/img/vision.png';

const MainPage = () => {
    const [char, setChar] = useState(null)
    // const [search, setSearch] = useState('null')

    const onCharSelected = id => setChar(id)

    console.log('mp render');
    
    return (
        <AnimatedPage>
            <Helmet>
                <meta
                    name="description"
                    content="Marvel information portal main page"
                />
                <title>Marvel Information Portal</title>
            </Helmet>
            <ErrorBoundary>  
                <RandomChar/>
            </ErrorBoundary>  
            <div className="char__content">
                <ErrorBoundary>
                    <CharList onCharSelected={onCharSelected}/>
                </ErrorBoundary>
                <aside className="char__aside">
                    <ErrorBoundary>
                        <CharInfo charId={char}/>
                    </ErrorBoundary>     
                    <ErrorBoundary>
                        <CharSearch/>
                    </ErrorBoundary>           
                </aside>  
            </div>
            <img className="bg-decoration" src={decoration} alt="vision"/>
        </AnimatedPage>
    )
}

export default MainPage