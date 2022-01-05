import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";

import useMarvelService from '../../services/MarvelService';

import './charSearch.scss'

const setContent = (process, charFound, errors) => {
    switch(process) {
        case 'waiting':
            return <></>
        case 'loading': 
            return (
                <div className="char__search-error">
                    {errors.search?.message}
                </div> 
            )
        case 'confirmed':
            return (
                <>
                    <div className="char__search-result">
                        {`There is! Visit ${charFound.name} page?`}
                    </div>
                    <Link  to={`characters/${charFound.name}`} className="button button__secondary">
                        <div className="inner">to page</div>
                    </Link>
                </>
            )
        case 'error':
            return (
                <div className="char__search-error">
                    {errors.search?.message}
                </div> 
            )
        default:
            throw new Error('Unexpected process state')
    }
}

const CharSearch = () => {
    
    const { register, 
        handleSubmit, 
        reset,
        setError,
        formState: { errors, isSubmitSuccessful } 
    } = useForm({
        defaultValues: {
            search: ''
        }
    });
    const { process, setProcess, getCharacterByName } = useMarvelService()

    const [charFound, setCharFound] = useState(null)

    const onSubmit = ({search}) => {
        getCharacterByName(search)
            .then(char => {
                if (char) {
                    setCharFound(char)
                    setProcess('confirmed', charFound, errors)
                } else {
                    setError('search', {
                        type: 'manual',
                        message: 'The character was not found. Check the name and try again'
                    })
                    setCharFound(null)
                    setProcess('error', charFound, errors)
                } 
            })
    }

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset()
        }
    }, [isSubmitSuccessful, reset])

    return (
        <div className="char__search">
            <div className="char__search-title">Or find a character by name:</div>
            <form className="char__search-form" onSubmit={handleSubmit(onSubmit)}>
                <input 
                    placeholder="Thor" 
                    className="char__search-input" 
                    {...register("search", { 
                        required: 'This field is required',
                        minLength:{
                            value: 3,
                            message: 'Minimum 3 letters'
                        }
                    })}/>                
                <button type="submit" className="button button__main" disabled={process === 'loading'}>
                    <div className="inner">find</div>
                </button>
                {setContent(process, charFound, errors)}
            </form>
        </div>
        
    )
}

export default CharSearch;