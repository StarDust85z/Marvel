import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";

import { useLazyGetCharByNameQuery, changeSearch } from '../../features/api/charsSlice';

import './charSearch.scss'

const CharSearch = () => {
    const dispatch = useDispatch()
    
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
        dispatch(changeSearch(search))
        // setSearch(search)
        // try {
        //     await trigger(search).unwrap()
        // } catch(err) {
        //     setError('search', {
        //             type: 'manual',
        //             message: 'The character was not found. Check the name and try again'
        //         })
        //     setValue(`search`, '')
        // }
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

    const renderLetters = () => {
        console.log('render search')
        let arr = ['_']
        for (let i = 0; i < 26; i++) {
            arr.push(String.fromCharCode(97 + i))
        }
        return arr.map(item => (
            <li 
                key={item}
                onClick={() => dispatch(changeSearch(item))}
                onKeyPress={(e) => {
                    if (e.key === "Enter") {
                        dispatch(changeSearch(item))
                    }
                }} 
                className='char__search-letter'
                tabIndex={0}
            >
                {item}
            </li>
        ))
    }

    const content = renderResult(search)

    const letters = renderLetters()

    return (
        <div className="char__search">
            <div className="char__search-title">Pick a character's starting letter:</div>
            <ul className="char__search-letters">
                {letters}
            </ul>
            <div className="char__search-title">Or type in the beginning of his name:</div>
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
                    onInput = {() => reset({...getValues})}     // optimize?
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