import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';

import AppBanner from "../appBanner/AppBanner";
import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';

import './SinglePage.scss';

const SinglePage = () => {
    const { comicId, charId } = useParams()
    const [ comic, setComic ] = useState(null)
    const [ char, setChar ] = useState(null)

    const {clearError, process, setProcess, getComic, getCharacterByName} = useMarvelService()

    useEffect(() => {
        if (comicId) updateComic()
        // eslint-disable-next-line
    }, [comicId])

    useEffect(() => {
        if (charId) updateChar()
        // eslint-disable-next-line
    }, [charId])

    const onComicLoaded = comic => {
        setComic(comic)
    }

    const onCharLoaded = char => {
        setChar(char)
    }

    const updateComic = () => {        
        clearError()
        getComic(comicId)
            .then(onComicLoaded)
            .then(() => setProcess('confirmed'))
    }

    const updateChar = () => {        
        clearError()
        getCharacterByName(charId)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'))
    }

    return (
        <>            
            <AppBanner/>
            {setContent(process, charId ? ViewChar : ViewComic, {comic, char})}
        </>
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
        </div>
    )
}

export default SinglePage;