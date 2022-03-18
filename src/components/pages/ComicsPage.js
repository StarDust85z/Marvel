import {Helmet} from "react-helmet-async";
import ComicsList from "../comicsList/ComicsList";
import AppBanner from "../appBanner/AppBanner";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";
import AnimatedPage from '../pages/AnimatedPage';

const ComicsPage = () => {
    return (
        <AnimatedPage>
            <Helmet>
                <meta
                    name="description"
                    content="Page with our comics"
                />
                <title>Marvel comics page</title>
            </Helmet>
            <AppBanner/>
            <ErrorBoundary> 
                <ComicsList/>
            </ErrorBoundary>
        </AnimatedPage>
    )
}

export default ComicsPage