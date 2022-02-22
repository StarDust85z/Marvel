import { useEffect } from 'react';

import { useLazyGetCharByIdQuery } from '../../features/api/charsSlice';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

const RandomChar = () => {
    const [ trigger, {
        data: char,
        isFetching,
        isError
    }] = useLazyGetCharByIdQuery()
    // const [ charId, setCharId ] = useState(1011400)

    const setRandomChar = () => {
        console.log('hi');
        trigger(Math.floor(Math.random() * (1011400 - 1011000) + 1011000))
    }

    useEffect(() => {
        setRandomChar()
        const timerId = setInterval(setRandomChar, 60000)

        return () => {
            clearInterval(timerId)
        }
        // eslint-disable-next-line
    }, [])
 
    const renderBlock = () => {
        if (isFetching) return <Spinner />
        if (isError) return <ErrorMessage />
        if (char) return <View char={char} />
    }

    const content = renderBlock()

    return (
        <div className="randomchar">
            {content} 
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br/>
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button className="button button__main" onClick={setRandomChar}>
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>                
        </div>
    )
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki} = char

    const descr = !description ? 'Description not avaible yet, check homepage to find out more' : 
    description.length > 200 ?  description.slice(0, 200) + '...' : description;

    const imgStyle = thumbnail?.indexOf('image_not_available.jpg') !== -1 ? {'objectFit': 'contain'} : {'objectFit': 'unset'};

    return (
        <div className="randomchar__block">
            <img src={thumbnail}
                alt="Random character"
                className="randomchar__img"
                style={imgStyle}/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">{descr}</p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;