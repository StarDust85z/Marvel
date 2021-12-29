import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';

const CharInfo = (props) => {
    const [char, setChar] = useState(null)
    const [comicsCount, setComicsCount] = useState(10)

    const {loading, error, clearError, getCharacter} = useMarvelService()

    useEffect(() => {
        updateChar()
    }, [])

    useEffect(() => {
        setComicsCount(10)
        updateChar()
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
    }

    const skeleton = char || loading || error ? null : <Skeleton/>;
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error|| !char) ? <View char={char} comicsCount={comicsCount} setComicsCount={setComicsCount}/> : null;

    return (
        <aside className='char__aside'>
            <div className="char__info">
                {skeleton}
                {errorMessage}
                {spinner}
                {content}                
            </div>
            <Search />     
        </aside>
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

const Search = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const { getCharacterByName } = useMarvelService()

    const onSubmit = ({search}) => {
        getCharacterByName(search)
            .then(console.log)
    }

    return (
        <div className="char__search">
            <div className="char__search-title">Or find a character by name:</div>
            <form className="char__search-form" onSubmit={handleSubmit(onSubmit)}>
                <input 
                    placeholder="Enter name" 
                    className="char__search-input" 
                    {...register("search", { required: true })} />                
                <button type="submit" className="button button__main">
                    <div className="inner">find</div>
                </button>
                {errors.search && <div className="char__search-error">This field is required</div>}
            </form>     
            {/*                 <a href="#" className="button button__secondary">
                        <div className="inner">to page</div>
            </a> */}
        </div>
        
    )
}

export default CharInfo;