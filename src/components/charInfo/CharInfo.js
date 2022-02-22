import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useLazyGetCharByIdQuery } from '../../features/api/charsSlice';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import './charInfo.scss';

const CharInfo = ({ charId }) => {
    const [comicsCount, setComicsCount] = useState(10)
    
    const [trigger, {
        data: char,
        isFetching,
        isError
    }] = useLazyGetCharByIdQuery()

    useEffect(() => {
        if (charId) trigger(charId)
        setComicsCount(10)        
    }, [trigger, charId])

    const renderChar = (char) => {
        if (isFetching) return <Spinner />
        if (isError) return <ErrorMessage />
        if (char) return <View char={char} comicsCount={comicsCount} setComicsCount={setComicsCount} />

        return <Skeleton />
    }

    const content = renderChar(char)

    return (
        <div className="char__info">
            {content}
        </div>
    )
}

const View = ({char, comicsCount, setComicsCount}) => {
    console.log(char);
    const {name, description, thumbnail, homepage, wiki, comics} = char;

    let imgStyle = thumbnail.endsWith('image_not_available.jpg') ? {'objectFit' : 'contain'} : {'objectFit' : 'cover'};

    const comicsItems = comics.length > 0 ? comics.map((item, i) => {
        if (i < comicsCount) {
            const keyArray = item.resourceURI.split('/')
            const k = keyArray[keyArray.length-1]

            return (
                <li className="char__comics-item" key={k}><Link to={`comics/${k}`}>{item.name}</Link></li>
            )
        } else if (i === comicsCount) {
            return <li 
                        style={{marginTop: 8, color: 'rgba(0,0,0,.3', cursor: 'pointer'}}
                        key={i}
                        onClick={() => {
                            setComicsCount(comicsCount => comicsCount + 10)
                        }}>more...</li>
        } else {
            return ''
        }
    }) : 'No comics avaible for that character'
    
    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
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