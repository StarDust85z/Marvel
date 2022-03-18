import { useState, useRef, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

import { useLazyGetCharsBySearchQuery, selectSearch } from '../../features/api/charsSlice';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const effects = {
    duration: 3,
    type: "spring",
    ease: "easeInOut"
}

const cardAnimation = {
    hidden: {
        y: 150,
        opacity: 0,
        scale: 0.01
    },
    visible: {
        y: 0,
        opacity: 1,
        scale: 1
    }
}

const CharList = (props) => {
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
        setCharList([])
        setCharEnded(false)
        setOffset(0)
        updateList(0)
    }, [search])

    const onListLoaded = (newCharList) => {
        setCharList(charList => [...charList, ...newCharList])
        setOffset(offset => offset + 9)
        if (newCharList.length < 9) setCharEnded(true)
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
                    box-shadow: 0 5px 20px #9F0013;
                    transform: translateY(-8px);
                `
                item.focus()
            } else {
                item.style.cssText = `transition: 0.3s transform;`
            }
        })
    }

    const renderItems = (arr) => {
        console.log('list render');

        if (isFetching && !offset) return <Spinner />
        if (isError) return <ErrorMessage />

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
                        props.onCharSelected(id);
                        changeClass(i);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            props.onCharSelected(id);
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

    const elements = useMemo(() => renderItems(charList), [charList, isLoading])    // Optimize more?

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

CharList.propTypes = { onCharSelected: PropTypes.func.isRequired }

export default CharList;