import { useState, useEffect } from 'react';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';

const CharInfo = (props) => {
    const [char, setChar] = useState(null),
          [loading, setLoading] = useState(false),
          [error, setError] = useState(false)

    const marvelService = new MarvelService()

    useEffect(() => {
        updateChar()
    }, [])

    useEffect(() => {
        updateChar()
    }, [props.charId])

    const onCharLoaded = char => {
        setChar(char)
        setLoading(false)
        setError(false)
    }

    const onError = () => {
        setLoading(false)
        setError(true)
    }

    const updateChar = () => {        
        const {charId} = props;
        if (!charId) return;

        setLoading(true)
        setError(false)

        marvelService
            .getCharacter(charId)
            .then(onCharLoaded)
            .catch(onError);
    }


    const skeleton = char || loading || error ? null : <Skeleton/>;
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error|| !char) ? <View char={char}/> : null;

    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    )
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char;

    let imgStyle = thumbnail.endsWith('image_not_available.jpg') ? {'objectFit' : 'contain'} : {'objectFit' : 'cover'};

    const comicsItems = comics.length > 0 ? comics.map((item, i) => {
        if (i < 10) {
            return (
                <li className="char__comics-item" key={i}>{item.name}</li>
            )
        } else if (i === 10) {
            return <li style={{marginTop: 8, color: 'rgba(0,0,0,.3'}} key={i}>and more...</li>
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