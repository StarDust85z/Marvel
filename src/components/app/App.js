import { useState } from "react";

import AppHeader from "../appHeader/AppHeader";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import ComicsList from "../comicsList/ComicsList";
import AppBanner from "../appBanner/AppBanner";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";

import decoration from '../../resources/img/vision.png';

const App = () => {
    const [page, setPage] = useState(1)
    const [char, setChar] = useState(null)

    const onCharSelected = id => setChar(id),
          onPageSelect = num => setPage(num)

    return (
        <div className="app">
            <AppHeader onPageSelect={onPageSelect}/>
            <main>
                {page === 0 ? <>
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
                </> : null}
                
                {page === 1 ? <>
                    <AppBanner/>
                    <ErrorBoundary> 
                        <ComicsList/>
                    </ErrorBoundary>
                </> : null}
            </main>
        </div>
    )
}

export default App;