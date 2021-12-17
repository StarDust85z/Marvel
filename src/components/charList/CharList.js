import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const CharList = (props) => {
    
    const [charList, setCharList] = useState([]),
          [loading, setLoading] = useState(true),
          [error, setError] = useState(false),
          [newItemLoading, setNewItemLoading] = useState(false),
          [offset, setOffset] = useState(310),
          [charEnded, setCharEnded] = useState(false)

    const marvelService = new MarvelService();

    useEffect(() => {
        updateList();
        // eslint-disable-next-line
    }, [])

    const onListLoaded = (newCharList) => {
        setCharList(charList => [...charList, ...newCharList])
        setLoading(false)
        setError(false)
        setNewItemLoading(false)
        setOffset(offset => offset + 9)
        setCharEnded(newCharList.length < 9)
    }

    const onError = () => {
        setError(true)
        setLoading(false)
    }

    const updateList = (offset) => {
        setNewItemLoading(true)

        marvelService
            .getAllCharacters(offset)
            .then(onListLoaded)
            .catch(onError)
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
        const listItems = arr.map(({name, thumbnail, id}, i) => {
            if (name.length > 36) name = name.slice(0,36) + '...';

            let imgStyle = thumbnail.endsWith('image_not_available.jpg') ? {'objectFit' : 'unset'} : {'objectFit' : 'cover'};

            return (
                <li className="char__item"
                    tabIndex={'0'}
                    key={id}
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
                {listItems}
            </ul>
        )                
    }

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;        

    const content = !(loading || error) ? renderItems(charList) : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {content}                
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