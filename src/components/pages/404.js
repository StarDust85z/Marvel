import { Helmet } from "react-helmet-async"

import ErrorMessage from "../errorMessage/ErrorMessage"
import { Link } from "react-router-dom"
import AnimatedPage from '../pages/AnimatedPage';

import './404.scss';

const Page404 = () => {
    return (
        <AnimatedPage>
            <Helmet>
                <meta
                    name="description"
                    content="Wrong address on Marvel information portal"
                />
                <title>Page not found</title>
            </Helmet>
            <div className='page404'>
                <ErrorMessage />
                <p className='page404__text'>404. Hydra has attacked that page..</p>
                <Link className='page404__link' to="/">Back to the main page</Link>
            </div>
        </AnimatedPage>        
    )
}

export default Page404