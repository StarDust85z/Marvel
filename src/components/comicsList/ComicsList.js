import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';

const setContent = (process, Component, newItemLoading) => {
    switch(process) {
        case 'waiting':
            return <Spinner/>
        case 'loading': 
            return newItemLoading ? <Component/> : <Spinner/>
        case 'confirmed':
            return <Component/>
        case 'error':
            return <ErrorMessage/>
        default:
            throw new Error('Unexpected process state')
    }
}

const ComicsList = () => {
    const [comicsList, setComicsList] = useState([]),
          [newItemLoading, setNewItemLoading] = useState(false),
          [offset, setOffset] = useState(0),
          [comicsEnded, setComicsEnded] = useState(false)

    const { getAllComics, process, setProcess } = useMarvelService()

    useEffect(() => {
        updateList(offset, true);
         // eslint-disable-next-line
    }, [])

    const onListLoaded = (newComicsList) => {
        setComicsList(comicsList => [...comicsList, ...newComicsList])
        setNewItemLoading(false)
        setOffset(offset => offset + 8)
        if (newComicsList.length < 8) setComicsEnded(true)
    }

    const updateList = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true)

        getAllComics(offset)
            .then(onListLoaded)
            .then(() => setProcess('confirmed'))
    }

    const renderItems = (arr) => {
        const listItems = arr.map(({title, thumbnail, id, price}, i) => {
            if (title.length > 36) title = title.slice(0,36) + '...';
            let imgStyle = thumbnail.endsWith('image_not_available.jpg') ? {'objectFit' : 'unset'} : {'objectFit' : 'cover'};

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

    return (
        <div className="comics__list">            
            {setContent(process, () => renderItems(comicsList), newItemLoading)}
            <button className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{ 'display': comicsEnded ? 'none' : 'block' }}
                    onClick={() => updateList(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;