import { useState, useRef, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';

import { useLazyGetCharsBySearchQuery, changeSearch, changeSelected, selectSearch } from '../../features/api/charsSlice';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';
import { effects, cardAnimation } from '../../features/animations'

const CharList = (props) => {
    const dispatch = useDispatch()
    const search = useSelector(selectSearch)
    
    const [charList, setCharList] = useState([]),
          [offset, setOffset] = useState(),
          [charEnded, setCharEnded] = useState(false)

    const [trigger, {
        isLoading,
        isFetching,
        isError
    }] = useLazyGetCharsBySearchQuery()

    useEffect(() => {
        dispatch(changeSearch('_'))

        return () => dispatch(changeSearch('_'))
    }, [])

    useEffect(() => {
        setCharList([])
        setCharEnded(false)
        setOffset(0)
        updateList(0)
    }, [search])

    const onCharSelect = (id) => {
        dispatch(changeSelected(id))
    }

    const onListLoaded = (newCharList) => {
        if (newCharList.length < 10) {
            setCharEnded(true)
            setCharList(charList => [...charList, ...newCharList])
        } else {
            setCharList(charList => [...charList, ...newCharList.slice(0, -1)])
        }
        setOffset(offset => offset + 9)        
    }

    const updateList = (o = offset) => {        
        trigger({ offset: o, search })
            .unwrap()
            .then(onListLoaded)
    }

    let charRefs = useRef([])

    const changeClass = (num) => {
        charRefs.current.forEach((item, i) => {
            if (num === i) {
                item.style.cssText = `
                    transition: 0.3s transform;
                    transform: translateY(-8px);
                ` 
                item.classList.add('active')
                item.focus()
            } else if (item) {
                item.style.cssText = 'transition: 0.3s transform;'
                item.classList.remove('active')
            }
        })
    }

    const renderItems = (arr) => {
        console.log('list render');

        if (isFetching && !offset) return <Spinner />
        if (isError) return <ErrorMessage />
        if (!arr.length) return <h2 style={{textAlign: 'center'}}>No matching characters...</h2>

        const items = arr.map(({name, thumbnail, id}, i) => {
            if (name.length > 30) name = name.slice(0,30) + '...';

            let imgStyle = thumbnail.endsWith('image_not_available.jpg') ? {'objectFit' : 'unset'} : {'objectFit' : 'cover'};

            return (
                <motion.li 
                    key={id}
                    className="char__item"
                    tabIndex={'0'}
                    ref={elem => charRefs.current[i] = elem}
                    onClick={() => {
                        onCharSelect(id);
                        changeClass(i);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            onCharSelect(id);
                            changeClass(i);
                        }
                    }}   
                    initial="hidden"
                    whileInView="visible"
                    variants={cardAnimation}
                    viewport={{ once: true }}
                    transition={effects}          
                >
                    <img src={thumbnail} alt={name} style={imgStyle}/>
                    <div className="char__name">{name}</div>
                </motion.li>
            )
        })

        return (
            <ul 
                className="char__grid"
            >
                {items}
            </ul>
        )                
    }

    const elements = useMemo(() => renderItems(charList), [charList, isLoading])

    return (
        <div className="char__list">
            {elements}
            <button 
                className="button button__main button__long"
                disabled={isFetching}
                style={{ 'display': charEnded || (isFetching && !offset) ? 'none' : 'block' }}
                onClick={() => updateList(offset)}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    )    
}

// CharList.propTypes = { onCharSelected: PropTypes.func.isRequired }

export default CharList;