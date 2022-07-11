import { Helmet } from "react-helmet-async";

import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import CharSearch from "../charSearch/CharSearch";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";
import AnimatedPage from '../pages/AnimatedPage';

import decoration from '../../resources/img/spiderman.png'

const MainPage = () => {
    // console.log('mp render');
    
    return (
        <AnimatedPage>
            <Helmet>
                <meta
                    name="description"
                    content="Marvel information portal main page"
                />
                <title>Marvel Info Portal</title>
            </Helmet>
            <ErrorBoundary>  
                <RandomChar/>
            </ErrorBoundary>  
            <div className="char__content">
                <ErrorBoundary>
                    <CharList/>
                </ErrorBoundary>
                <aside className="char__aside">
                    <ErrorBoundary>
                        <CharInfo/>
                    </ErrorBoundary>     
                    <ErrorBoundary>
                        <CharSearch/>
                    </ErrorBoundary>           
                </aside>  
            </div>
            <img width="400px" className="bg-decoration" src={decoration} alt="SpiderMan"/>
        </AnimatedPage>
    )
}

export default MainPage