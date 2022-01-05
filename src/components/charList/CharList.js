import { useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

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

const CharList = (props) => {
    
    const [charList, setCharList] = useState([]),
          [newItemLoading, setNewItemLoading] = useState(false),
          [offset, setOffset] = useState(310),
          [charEnded, setCharEnded] = useState(false)

    const {getAllCharacters, process, setProcess} = useMarvelService();

    useEffect(() => {
        updateList(offset, true);
        // eslint-disable-next-line
    }, [])

    const updateList = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true)

        getAllCharacters(offset)
            .then(onListLoaded)
            .then(() => setProcess('confirmed'))
    }

    const onListLoaded = (newCharList) => {
        setCharList(charList => [...charList, ...newCharList])
        setNewItemLoading(false)
        setOffset(offset => offset + 9)
        setCharEnded(newCharList.length < 9)
    }

    let charRefs = useRef([])

    const changeClass = (num) => {
        charRefs.current.forEach((item, i) => {
            if (num === i) {
                item.classList.add('char__item_selected')
                item.focus()
            } else {
                item.classList.remove('char__item_selected')
            }
        })
    }

    const renderItems = (arr) => {
        console.log('render');
        const items = arr.map(({name, thumbnail, id}, i) => {
            if (name.length > 30) name = name.slice(0,30) + '...';

            let imgStyle = thumbnail.endsWith('image_not_available.jpg') ? {'objectFit' : 'unset'} : {'objectFit' : 'cover'};

            return (
                <li key={id}
                    className="char__item"
                    tabIndex={'0'}
                    ref={elem => charRefs.current[i] = elem}
                    onClick={() => {
                        props.onCharSelected(id);
                        changeClass(i);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            props.onCharSelected(id);
                            changeClass(i);
                        }
                    }}>
                    <img src={thumbnail} alt={name} style={imgStyle}/>
                    <div className="char__name">{name}</div>
                </li>
            )
        })

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )                
    }

    const elements = useMemo(() => {
        return setContent(process, () => renderItems(charList), newItemLoading);
    }, [process])

    return (
        <div className="char__list">
            {elements}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{ 'display': charEnded ? 'none' : 'block' }}
                onClick={() => updateList(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )    
}

CharList.propTypes = { onCharSelected: PropTypes.func.isRequired }

export default CharList;