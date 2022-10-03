import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'

import { useLazyGetCharByIdQuery, selectChar } from '../../features/api/charsSlice';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import './charInfo.scss';

const CharInfo = () => {
    const [trigger, {
        data: char,
        isFetching,
        isError
    }] = useLazyGetCharByIdQuery()
    const selected = useSelector(selectChar)

    useEffect(() => {
        if (selected) trigger(selected)       
    }, [trigger, selected])

    const renderChar = (char) => {
        if (isFetching) return <Spinner />
        if (isError) return <ErrorMessage />
        if (char) return <View char={char} />

        return <Skeleton />
    }

    const content = useMemo(() => {
        return renderChar(char)
        // eslint-disable-next-line
    }, [char, isFetching])

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
        if (i < 5) {
            const keyArray = item.resourceURI.split('/')
            const k = keyArray[keyArray.length-1]

            return (
                <li className="char__comics-item" key={k}>
                    <Link to={`comics/${k}`}>{item.name}</Link>
                </li>
            )
        } else if (i === 5) {
            return <li key={i}>
                more comics on the <Link to={`characters/${id}`}>character's page</Link>..
            </li>
        } else {
            return null
        }
    }) : 'No comics available for that character'
    
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