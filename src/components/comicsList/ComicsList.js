import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useLazyGetComicsQuery } from '../../features/api/apiSlice'
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';

const ComicsList = () => {
    const [comicsList, setComicsList] = useState([]),
          [offset, setOffset] = useState(0),
          [comicsEnded, setComicsEnded] = useState(false)

    const [trigger, {
        isLoading,
        isFetching,
        isError
    }] = useLazyGetComicsQuery()

    useEffect(() => {
        updateList()
         // eslint-disable-next-line
    }, [])

    const onListLoaded = (newComicsList) => {
        setComicsList(comicsList => [...comicsList, ...newComicsList])
        setOffset(offset => offset + 8)
        if (newComicsList.length < 8) setComicsEnded(true)
    }

    const updateList = () => {
        trigger(offset)
            .unwrap()
            .then(onListLoaded)
    }

    const renderItems = (arr) => {
        console.log('Comics render!');

        if (isLoading) return <Spinner />
        if (isError) return <ErrorMessage />

        const listItems = arr.map(({title, thumbnail, id, price}, i) => {
            if (title.length > 36) title = title.slice(0,36) + '...';
            let imgStyle = thumbnail.endsWith('image_not_available.jpg') ? 
                {'objectFit' : 'unset'} : {'objectFit' : 'cover'};

            return (
                <li className="comics__item"
                    tabIndex={'0'}
                    key={i}>
                    <Link to={`/comics/${id}`}>
                        <img src={thumbnail} alt={title} style={imgStyle} className="comics__item-img"/>
                        <div className="comics__item-name">{title}</div>
                        <div className="comics__item-price">{`${price}`}</div>
                    </Link>
                </li>
            )
        })

        return (
            <ul className="comics__grid">
                {listItems}
            </ul>
        )                
    }

    const elements = renderItems(comicsList)

    return (
        <div className="comics__list">            
            {elements}
            <button 
                className="button button__main button__long"
                disabled={isFetching}
                style={{ 'display': comicsEnded || isLoading ? 'none' : 'block' }}
                onClick={() => updateList(offset)}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;