import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import AppHeader from "../appHeader/AppHeader";
import Spinner from '../spinner/Spinner';

const Page404 = lazy(() => import('../pages/404'));
const MainPage = lazy(() => import('../pages/MainPage'));
const ComicsPage = lazy(() => import('../pages/ComicsPage'));
const SinglePage = lazy(() => import('../pages/SinglePage'));

const App = () => {
    const location = useLocation();

    return (
        <div className="app">
            <AppHeader/>
            <main>
                <Suspense fallback={<Spinner />}>
                    <AnimatePresence exitBeforeEnter>
                        <Routes key={location.pathname} location={location}>
                            <Route path="/" element={<MainPage/>}/>
                            <Route path="characters/:charId" element={<SinglePage/>}/>                         
                            <Route path="comics" element={<ComicsPage/>}/>
                            <Route path="comics/:comicId" element={<SinglePage/>}/>
                            <Route path="*" element={<Page404/>}/>
                        </Routes>   
                    </AnimatePresence>
                </Suspense>
            </main>
        </div>
    )
}

export default App;