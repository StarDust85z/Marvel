import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import cn from 'classnames';

import { useLazyGetCharByIdQuery } from '../../features/api/charsSlice';
import { useLazyGetComicByIdQuery, useLazyGetComicsByCharIdQuery } from '../../features/api/apiSlice';

import AppBanner from "../appBanner/AppBanner";
import AnimatedPage from './AnimatedPage';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Page404 from '../pages/404'

import './SinglePage.scss';

const SinglePage = () => {
    const { comicId, charId } = useParams()
    
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
        if (isCharFetching || isComicFetching) return <Spinner />
        if (isCharError || isComicError) return <Page404 />
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
    const {name, description, thumbnail, id, homepage} = char

    const [comicsList, setComicsList] = useState([]),
          [offset, setOffset] = useState(0),
          [comicsEnded, setComicsEnded] = useState(false)

    const [trigger, {
        isFetching,
        isError
    }] = useLazyGetComicsByCharIdQuery()

    useEffect(() => {
        updateList()
         // eslint-disable-next-line
    }, [])

    const onListLoaded = (newComicsList) => {
        if (newComicsList.length < 21) {
            setComicsEnded(true)
            setComicsList(comicsList => [...comicsList, ...newComicsList])
        } else {
            setComicsList(comicsList => [...comicsList, ...newComicsList.slice(0, -1)])
        }
        
        setOffset(offset => offset + 20)        
    }

    const updateList = () => {
        trigger({id, offset})
            .unwrap()
            .then(onListLoaded)
    }

    const renderComics = () => {
        if (isError) return <ErrorMessage />

        const comicsMore = ( 
            <li 
                key={'more'}
                className={cn('single-page__comics-more', 'btn', { 'loading' : isFetching })}
                style={{ 'display': comicsEnded ? 'none' : 'block' }}
                onClick={() => updateList()}
            >
                {isFetching ? 'loading...' : 'load more comics'}
            </li>
        )

        const comicsItems = [...comicsList.map(item => {
            return (
                <li className="single-page__comics-item" key={item.id}>
                    <Link to={`../comics/${item.id}`}>{item.title}</Link>
                </li>
            )
        }), comicsMore]

        const comicsStyle = {
            height: comicsList.length * 36,
            transition: comicsList.length > 14 ? 
                `height ${ 0.25 * comicsList.length }s`
            : `height 3.5s`,
        }

        return (
            <>  
                { !comicsList.length && !isFetching &&
                    <p className='single-page__comics-more'>No comics available for that character</p> } 
                { isFetching && !comicsList.length &&
                    <p style={{marginTop: 30}} className='single-page__comics-more loading'>loading comics list..</p> }  
                { !!comicsList.length &&
                    <p className="single-page__comics-descr">Comics available:</p> }
                <ul 
                    style={comicsStyle}
                    className={cn(
                        `single-page__comics-list`, {'single-page__comics-scroll': comicsList.length > 14 }
                    )}
                >
                    {comicsItems}
                </ul>
            </>
        )
    }

    return (
        <div className="single-page">
            <Helmet>
                <meta
                    name="description"
                    content={`Page about ${name} character`}
                />
                <title>{`${name}`}</title>
            </Helmet>            
            <div className="single-page__img-block">
                <img src={thumbnail} alt={name} className="single-page__img"/>
                <div className="single-page__name">{name}</div>
            </div>   
            
            <div className="single-page__info">
                {
                    description ? <>
                        <p className="single-page__title">{`About ${name}:`}</p>
                        <p className="single-page__descr">
                            {description}
                        </p>
                    </> : <p className="single-page__descr">No description available yet</p>                
                }

                <div className="single-page__comics">
                    {renderComics()}
                </div>             
                <p className="single-page__descr">
                    More info about character on the <a href={homepage}>official character wiki</a>
                </p>
            </div>
            <Link to=".." className="single-page__back">Back to all</Link>
        </div>
    )
}

export default SinglePage;