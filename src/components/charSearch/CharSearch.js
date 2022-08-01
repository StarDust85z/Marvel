import { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { useForm } from "react-hook-form";
import cn from 'classnames'

import { changeSearch } from '../../features/api/charsSlice';

import './charSearch.scss'
import { ReactComponent as Chevron } from '../../resources/icons/chevron.svg'

const lettersArr = []
for (let i = 0; i < 26; i++) {
    lettersArr.push(String.fromCharCode(97 + i))
}

const CharSearch = () => {
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false)
    
    const { 
        register, 
        handleSubmit, 
        reset,
        clearErrors,
        formState: { errors, isSubmitSuccessful } 
    } = useForm({
        defaultValues: {
            search: ''
        },
        reValidateMode: 'onSubmit'
    })

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset()
        }
        // eslint-disable-next-line
    }, [isSubmitSuccessful])

    const letters = useMemo(() => {
        return lettersArr.map(item => (
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
        // eslint-disable-next-line
    }, [lettersArr])

    const searchStyle = {
        height: open ? errors.search?.message ? '408px' : '370px' : '74px'
    }

    return (
        <div className={cn("char__search")} style={searchStyle}>
            <div className={cn('char__search-title', 'expand', {
                open
            })} onClick={() => setOpen(open => !open)}>
                <span>Search character</span>
                <Chevron width={16} height={16} />
            </div>
            {open && (
            <>
                <div className="char__search-title">Pick a character's starting letter:</div>
                <ul className="char__search-letters">
                    {letters}
                </ul>
                <div className="char__search-title">Or type in the beginning of his name:</div>
                <form 
                    className="char__search-form"
                    onSubmit={handleSubmit(({search}) => dispatch(changeSearch(search)))}
                >
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
                        onInput = {() => {
                            if (errors.search?.message) clearErrors()  
                        }}
                    />                
                    <button type="submit" className="button button__main">
                        <div className="inner">find</div>
                    </button>
                    <div className="char__search-error">
                        {errors.search?.message}
                    </div>

                </form>
                <div className="char__search-title">Reset search:</div>
                <button
                    className="button button__secondary"
                    onClick={() => dispatch(changeSearch('_'))}
                >
                    <div className="inner">reset</div>
                </button>
            </>
            )}
        </div>
    )
}

export default CharSearch;