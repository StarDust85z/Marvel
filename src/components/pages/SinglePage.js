import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';

import { useLazyGetCharByIdQuery } from '../../features/api/charsSlice';
import { useLazyGetComicByIdQuery } from '../../features/api/apiSlice';

import AppBanner from "../appBanner/AppBanner";
import AnimatedPage from './AnimatedPage';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './SinglePage.scss';

const SinglePage = () => {
    const { comicId, charId } = useParams()
    // const [ comic, setComic ] = useState(null)
    // const [ char, setChar ] = useState(null)

    // const {clearError, process, setProcess, getComic, getCharacterByName} = useMarvelService()
    
    const [ triggerChar, {
        data: char,
        isFetching: isCharFetching,
        isError: isCharError
    }] = useLazyGetCharByIdQuery()

    const [ triggerComic, {
        data: comic,
        isFetching: isComicFetching,
        isError: isComicError
    }] = useLazyGetComicByIdQuery()

    useEffect(() => {
        if (charId) triggerChar(charId)
        if (comicId) triggerComic(comicId)
        // eslint-disable-next-line
    }, [charId, comicId])

    const renderPage = () => {
        console.log(char, comic);
        if (isCharFetching || isComicFetching) return <Spinner />
        if (isCharError || isComicError) return <ErrorMessage />
        if (char) return <ViewChar char={char} />
        if (comic) return <ViewComic comic={comic} />
    }

    const content = renderPage()

    return (
        <AnimatedPage>            
            <AppBanner/>
            {content}
        </AnimatedPage>
    )
}

const ViewComic = ({comic}) => {
    const {title, description, pageCount, thumbnail, language, price} = comic

    return (
        <div className="single-page">
            <Helmet>
                <meta
                    name="description"
                    content={`${title} comic book page`}
                />
                <title>{`${title}`}</title>
            </Helmet>                
            <img src={thumbnail} alt={title} className="single-page__img"/>
            <div className="single-page__info">
                <h2 className="single-page__name">{title}</h2>
                <p className="single-page__descr">{description}</p>
                <p className="single-page__descr">{pageCount}</p>
                <p className="single-page__descr">Language: {language}</p>
                <div className="single-page__price">{price}</div>
            </div>
            <Link to="../comics" className="single-page__back">Back to all</Link>
        </div>
    )
}

const ViewChar = ({char}) => {
    const {name, description, thumbnail} = char

    return (
        <div className="single-page">
            <Helmet>
                <meta
                    name="description"
                    content={`Page about ${name} character`}
                />
                <title>{`${name}`}</title>
            </Helmet>                
            <img src={thumbnail} alt={name} className="single-page__img"/>
            <div className="single-page__info">
                <h2 className="single-page__name">{name}</h2>
                <p className="single-page__descr">
                    {description ? description : 'No description available yet'}
                </p>
            </div>
            <Link to=".." className="single-page__back">Back to all</Link>
        </div>
    )
}

export default SinglePage;