import { Helmet } from "react-helmet"

import ErrorMessage from "../errorMessage/ErrorMessage"
import { Link } from "react-router-dom"
import AnimatedPage from '../pages/AnimatedPage';

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
            <div>
                <ErrorMessage/>
                <p style={{'textAlign': 'center', 'fontWeight': 'bold', 'fontSize': '24px'}}>Page doesn't exist</p>
                <Link style={{'display': 'block', 'textAlign': 'center', 'fontWeight': 'bold', 'fontSize': '24px', 'marginTop': '30px', 'cursor': 'pointer'}} to="/">Back to main page</Link>            
            </div>
        </AnimatedPage>        
    )
}

export default Page404