import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';

import './charInfo.scss';

const CharInfo = (props) => {
    const [char, setChar] = useState(null)
    const [comicsCount, setComicsCount] = useState(10)

    const {clearError, getCharacter, process, setProcess} = useMarvelService()

    useEffect(() => {
        updateChar()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        setComicsCount(10)
        updateChar()
        // eslint-disable-next-line
    }, [props.charId])

    const onCharLoaded = char => {
        setChar(char)
    }

    const updateChar = () => {        
        const {charId} = props;
        if (!charId) return;

        clearError()
        getCharacter(charId)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'))
    }

    return (
        <div className="char__info">
            {setContent(process, View, {char, comicsCount, setComicsCount})}               
        </div>
    )
}

const View = ({char, comicsCount, setComicsCount}) => {
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