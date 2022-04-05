import { Helmet } from "react-helmet-async"

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
                <p style={{'height': 100}} />
                <ErrorMessage  style={{'marginTop': 80}} />
                <p style={{'textAlign': 'center', 'fontWeight': 'bold', 'fontSize': '24px', 'marginTop': 30}}>404. Hydra has attacked that page..</p>
                <Link style={{'display': 'block', 'textAlign': 'center', 'fontWeight': 'bold', 'fontSize': '24px', 'marginTop': '30px', 'cursor': 'pointer'}} to="/">Back to the main page</Link>            
            </div>
        </AnimatedPage>        
    )
}

export default Page404