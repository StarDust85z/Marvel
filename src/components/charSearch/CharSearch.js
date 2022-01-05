import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";

import useMarvelService from '../../services/MarvelService';

import './charSearch.scss'

const CharSearch = () => {
    
    const { register, 
        handleSubmit, 
        reset,
        setError,
        clearErrors,
        formState: { errors, isSubmitSuccessful } 
    } = useForm({
        defaultValues: {
            search: ''
        }
    });
    const { getCharacterByName } = useMarvelService()

    const [charFound, setCharFound] = useState(null),
          [searching, setSearching] = useState(false)

    const onSubmit = ({search}) => {
        setSearching(true)
        getCharacterByName(search)
            .then(char => {
                if (char) {
                    setCharFound(char)
                } else {
                    setError('search', {
                        type: 'manual',
                        message: 'The character was not found. Check the name and try again'
                    })
                    setCharFound(null)
                } 
            }).then(() => setSearching(false))
    }

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset()
        }
    }, [isSubmitSuccessful, reset])

    const clearError = () => {
        if (errors.search) {
            clearErrors();
        }
    }

    return (
        <div className="char__search">
            <div className="char__search-title">Or find a character by name:</div>
            <form className="char__search-form" onSubmit={handleSubmit(onSubmit)}>
                <input 
                    onInput={clearError}
                    placeholder="Thor" 
                    className="char__search-input" 
                    {...register("search", { 
                        required: 'This field is required',
                        minLength:{
                            value: 3,
                            message: 'Minimum 3 letters'
                        }
                    })}/>                
                <button type="submit" className="button button__main" disabled={searching}>
                    <div className="inner">find</div>
                </button>
                {charFound ? 
                    <>
                        <div className="char__search-result">
                            {`There is! Visit ${charFound.name} page?`}
                        </div>
                        <Link  to={`characters/${charFound.name}`} className="button button__secondary">
                            <div className="inner">to page</div>
                        </Link>
                    </> :
                    <div className="char__search-error">
                        {errors.search?.message}
                    </div> 
                }
            </form>
        </div>
        
    )
}

export default CharSearch;