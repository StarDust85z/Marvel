import { useState, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

import { useGetCharsQuery } from '../../features/api/charsSlice';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const cardAnimation = {
    hidden: {
        y: 300,
        opacity: 0,
        scale: 0.01,
        // rotate: -360
    },
    visible: {
        y: 0,
        opacity: 1,
        scale: 1,
        // rotate: 0
    }
}

const CharList = (props) => {
    
    // const [charList, setCharList] = useState([]),
    const [newItemLoading, setNewItemLoading] = useState(false),
          [offset, setOffset] = useState(310),
          [limit, setLimit] = useState(9),
          [charEnded, setCharEnded] = useState(false)

    const {
        data: chars = [],
        isLoading,
        isFetching,
        isError
    } = useGetCharsQuery({offset, limit})

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

        if (isLoading) return <Spinner />
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
                    transition={{
                        duration: 1,
                        type: "spring",
                        ease: "easeInOut"
                    }}                 
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

    const elements = useMemo(() => renderItems(chars), [chars, offset])

    return (
        <div className="char__list">
            {elements}
            <button 
                className="button button__main button__long"
                disabled={isFetching}
                // style={{ 'display': charEnded ? 'none' : 'block' }}
                onClick={() => setLimit(limit => limit + 9)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )    
}

CharList.propTypes = { onCharSelected: PropTypes.func.isRequired }

export default CharList;