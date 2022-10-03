import { useEffect , useRef } from 'react';
import { Helmet } from "react-helmet-async";

import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import CharSearch from "../charSearch/CharSearch";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";
import AnimatedPage from '../pages/AnimatedPage';

import decoration from '../../resources/img/spiderman.png'
import './MainPage.scss';


const MainPage = () => {
    const asideRef = useRef(null)
    const contentRef = useRef(null)

    const handleScroll = () => {
        if (asideRef.current && contentRef.current) {
            const { scrollY } = window
            const { height: heightList } = contentRef.current.getBoundingClientRect()
            const { height } = asideRef.current.getBoundingClientRect()
            const diff2 = (scrollY - 380 + height) - (heightList)
            if (window.scrollY < 380) {
                asideRef.current.style.top = "0px"
            } else if (diff2 > 0) {
                asideRef.current.style.top = (scrollY - 380 - diff2) + 'px';
            } else {
                asideRef.current.style.top = (scrollY - 380) + 'px';
            }
        }
    };

    useEffect(() => {
        const aside = asideRef.current
        window.addEventListener("scroll", handleScroll);

        const resizeObserver = new ResizeObserver(entries => {
            handleScroll()
        })
        resizeObserver.observe(aside)

        return () => {
            window.removeEventListener("scroll", handleScroll)
            resizeObserver.unobserve(aside)
        };
    }, []);

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
                <div className="test" ref={contentRef}>
                <ErrorBoundary>
                    <CharList/>
                </ErrorBoundary>
                </div>
                <aside className="char__aside" ref={asideRef}>
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