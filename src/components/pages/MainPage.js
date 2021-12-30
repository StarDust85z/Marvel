import { useState } from "react"
import { Helmet } from "react-helmet";

import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";

import decoration from '../../resources/img/vision.png';

const MainPage = () => {
    const [char, setChar] = useState(null)

    const onCharSelected = id => setChar(id)

    return (
        <>
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
                <ErrorBoundary>
                    <CharInfo charId={char}/>
                </ErrorBoundary>              
            </div>
            <img className="bg-decoration" src={decoration} alt="vision"/>
        </>
    )
}

export default MainPage