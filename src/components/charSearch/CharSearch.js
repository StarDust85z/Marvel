import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";

import { useLazyGetCharByNameQuery } from '../../features/api/apiSlice';

import './charSearch.scss'

const CharSearch = () => {
    
    const { 
        register, 
        handleSubmit, 
        reset,
        setError,
        setValue,
        getValues,
        formState: { errors, isSubmitSuccessful } 
    } = useForm({
        defaultValues: {
            search: ''
        }
    });

    const [search, setSearch] = useState()

    const [trigger, {
        data: charFound,
        isFetching,
        isError,
        isSuccess
    }] = useLazyGetCharByNameQuery()

    const onSubmit = async ({search}) => {
        setSearch(search)
        try {
            await trigger(search).unwrap()
        } catch(err) {
            setError('search', {
                    type: 'manual',
                    message: 'The character was not found. Check the name and try again'
                })
            setValue(`search`, '')
        }
    }

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset()
        }
    }, [isSubmitSuccessful, reset])

    const renderResult = (search) => {
        if (!search) return <></>
        if (isFetching || isError) return (
            <div className="char__search-error">
                {errors.search?.message}
            </div> 
        )
        if (isSuccess) return (
            <>
                <div className="char__search-result">
                    {`There is! Visit ${charFound.name} page?`}
                </div>
                <Link  to={`characters/${charFound?.name}`} className="button button__secondary">
                    <div className="inner">to page</div>
                </Link>
            </>
        )
    }

    const content = renderResult(search)

    return (
        <div className="char__search">
            <div className="char__search-title">Or find a character by name:</div>
            <form className="char__search-form" onSubmit={handleSubmit(onSubmit)}>
                <input 
                    placeholder="example: Thor" 
                    className="char__search-input"
                    {...register("search", { 
                        required: 'This field is required',
                        minLength:{
                            value: 3,
                            message: 'Minimum 3 letters'
                        }                    
                    })}
                    onInput = {() => reset({...getValues})}
                />                
                <button type="submit" className="button button__main" disabled={isFetching}>
                    <div className="inner">find</div>
                </button>
                {content}
            </form>
        </div>
        
    )
}

export default CharSearch;