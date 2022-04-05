import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { useLazyGetCharByIdQuery } from '../../features/api/charsSlice';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import './charInfo.scss';

const CharInfo = ({ charId }) => {
    const [trigger, {
        data: char,
        isFetching,
        isError
    }] = useLazyGetCharByIdQuery()

    useEffect(() => {
        if (charId) trigger(charId)       
    }, [trigger, charId])

    const renderChar = (char) => {
        if (isFetching) return <Spinner />
        if (isError) return <ErrorMessage />
        if (char) return <View 
            char={char}
        />

        return <Skeleton />
    }

    const content = useMemo(() => renderChar(char), [char, isFetching])

    return (
        <div className="char__info">
            {content}
        </div>
    )
}

const View = ({ char }) => {
    const {name, description, thumbnail, homepage, id, comics} = char;

    let imgStyle = thumbnail.endsWith('image_not_available.jpg') ? 
        {'objectFit' : 'contain'} : {'objectFit' : 'cover'};

    const comicsItems = comics.length > 0 ? comics.map((item, i) => {
        if (i < 10) {
            const keyArray = item.resourceURI.split('/')
            const k = keyArray[keyArray.length-1]

            return (
                <li className="char__comics-item" key={k}>
                    <Link to={`comics/${k}`}>{item.name}</Link>
                </li>
            )
        } else if (i === 10) {
            return <li 
                style={{marginTop: 10, color: 'rgba(0,0,0,.5', fontSize:14}}
                key={i}
            >
                more comics on the character's page..
            </li>
        } else {
            return null
        }
    }) : 'No comics avaible for that character'
    
    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <Link 
                            to={`characters/${id}`}
                            className="button button__main"
                        >
                            <div className="inner">To page</div>
                        </Link>
                        <a href={homepage} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comicsItems}
            </ul>
        </>
    )
}

export default CharInfo;