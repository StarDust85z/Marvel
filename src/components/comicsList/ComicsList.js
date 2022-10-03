import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { useLazyGetComicsQuery } from '../../features/api/apiSlice'
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';
import { effects, cardAnimation } from '../../features/animations'

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
        if (newComicsList.length < 9) {
            setComicsEnded(true)
            setComicsList(comicsList => [...comicsList, ...newComicsList])
        } else {
            setComicsList(comicsList => [...comicsList, ...newComicsList.slice(0, -1)])
        }
        setOffset(offset => offset + 8)
    }

    const updateList = () => {
        trigger(offset)
            .unwrap()
            .then(onListLoaded)
    }

    const renderItems = (arr) => {
        if (isFetching && !comicsList.length) return <Spinner />
        if (isError) return <ErrorMessage />

        const listItems = arr.map(({title, thumbnail, id, price}, i) => {
            if (title.length > 36) title = title.slice(0,36) + '...';
            let imgStyle = thumbnail.endsWith('image_not_available.jpg') ? 
                {'objectFit' : 'unset'} : {'objectFit' : 'cover'};

            return (
                <motion.li className="comics__item"
                    // tabIndex={'0'}
                    key={i}
                    initial="hidden"
                    whileInView="visible"
                    variants={cardAnimation}
                    viewport={{ once: true }}
                    transition={effects}   
                >
                    <Link to={`/comics/${id}`}>
                        <img src={thumbnail} alt={title} style={imgStyle} className="comics__item-img"/>
                        <div className="comics__item-name">{title}</div>
                        <div className="comics__item-price">{`${price}`}</div>
                    </Link>
                </motion.li>
            )
        })

        return (
            <ul className="comics__grid">
                {listItems}
            </ul>
        )                
    }

    const elements = useMemo(() => {
        return renderItems(comicsList)
        // eslint-disable-next-line
    }, [comicsList, isLoading])

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