import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const CharList = (props) => {
    
    const [charList, setCharList] = useState([]),
          [newItemLoading, setNewItemLoading] = useState(false),
          [offset, setOffset] = useState(310),
          [charEnded, setCharEnded] = useState(false)

    const {loading, error, getAllCharacters} = useMarvelService();

    useEffect(() => {
        updateList(offset, true);
        // eslint-disable-next-line
    }, [])

    const onListLoaded = (newCharList) => {
        setCharList(charList => [...charList, ...newCharList])
        setNewItemLoading(false)
        setOffset(offset => offset + 9)
        setCharEnded(newCharList.length < 9)
    }

    const updateList = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true)

        getAllCharacters(offset)
            .then(onListLoaded)
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
        const duration = 1500;

        return (
            <TransitionGroup
                className="char__grid"
                component='ul'>
                {arr.map(({name, thumbnail, id}, i) => {
                    if (name.length > 30) name = name.slice(0,30) + '...';

                    let imgStyle = thumbnail.endsWith('image_not_available.jpg') ? {'objectFit' : 'unset'} : {'objectFit' : 'cover'};

                    return (
                        <CSSTransition timeout={duration} key={id} classNames="char__item">
                            <li className="char__item"
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
                        </CSSTransition>
                    )
                })}
            </TransitionGroup>
        )                
    }

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;        
    const items = renderItems(charList)

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {items}
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