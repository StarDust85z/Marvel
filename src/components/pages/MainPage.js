import { useState } from "react"

import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import CharSearch from "../charSearch/CharSearch";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";

import decoration from '../../resources/img/vision.png';

const MainPage = () => {
    const [char, setChar] = useState(null)

    const onCharSelected = id => setChar(id)

    return (
        <>
            <ErrorBoundary>  
                <RandomChar/>
            </ErrorBoundary>  
            <div className="char__content">
                <ErrorBoundary>
                    <CharList onCharSelected={onCharSelected}/>
                </ErrorBoundary>
                <aside>
                    <ErrorBoundary>
                        <CharInfo charId={char}/>
                    </ErrorBoundary>     
                    <ErrorBoundary>
                        <CharSearch/>
                    </ErrorBoundary>           
                </aside>  
            </div>
            <img className="bg-decoration" src={decoration} alt="vision"/>
        </>
    )
}

export default MainPage