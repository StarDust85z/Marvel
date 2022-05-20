import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";

import { useLazyGetCharByNameQuery, changeSearch } from '../../features/api/charsSlice';

import './charSearch.scss'

const CharSearch = ({setMainSearch}) => {
    const dispatch = useDispatch()
    
    const { 
        register, 
        handleSubmit, 
        reset,
        setError,
        setValue,
        getValues,
        clearErrors,
        formState: { errors, isSubmitSuccessful } 
    } = useForm({
        defaultValues: {
            search: ''
        },
        reValidateMode: 'onSubmit'
    });

    // const [search, setSearch] = useState()

    const [trigger, {
        data: charFound,
        isFetching,
        isError,
        isSuccess
    }] = useLazyGetCharByNameQuery()

    const onSubmit = async ({search}) => {
        dispatch(changeSearch(search))
        // setMainSearch(search)
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
        let arr = []
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

    // const content = renderResult(search)

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
                    placeholder="example: Spider-Man" 
                    className="char__search-input"
                    {...register("search", { 
                        required: 'This field is required',
                        minLength:{
                            value: 3,
                            message: 'Minimum 3 letters'
                        }                    
                    })}
                    // onInput = {() => reset({...getValues})}     // optimize?
                    onInput = {() => clearErrors()}
                />                
                <button type="submit" className="button button__main" disabled={isFetching}>
                    <div className="inner">find</div>
                </button>
                <div className="char__search-error">
                    {errors.search?.message}
                </div> 
                {/* {content} */}

            </form>
            <div className="char__search-title">Reset search:</div>
            <button
                className="button button__secondary"
                onClick={() => dispatch(changeSearch('_'))}
            >
                <div className="inner">reset</div>
            </button>
        </div>
        
    )
}

export default CharSearch;