import { 
    createSelector,
    createSlice,
} from '@reduxjs/toolkit'

import { apiSlice } from './apiSlice'

const _apiKey = `apikey=${process.env.REACT_APP_API_KEY}`
const limit = 10

const _transformCharacter = (char) => {
	// console.log(char);
	return {
		name: char.name,
		description: char.description,
		thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
		homepage: char.urls.filter(url => url.type === 'detail').length ? 
			char.urls.filter(url => url.type === 'detail')[0].url :
			char.urls.filter(url => url.type === 'wiki')[0].url,
		wiki: char.urls[1].url,
		id: char.id,
		comics: char.comics.items
	}
}

export const extendedApiSlice = apiSlice.injectEndpoints({
	endpoints: builder => ({
		getChars: builder.query({
      query: (offset) => `characters?limit=${limit}&offset=${offset}&${_apiKey}`,
			transformResponse: res => res.data.results.map(_transformCharacter)
        }),
		getCharsBySearch: builder.query({
			query: ({offset, search}) => `characters?nameStartsWith=${search}&limit=${limit}&offset=${offset}&${_apiKey}`,
			transformResponse: res => res.data.results.map(_transformCharacter)
		}),
		getCharById: builder.query({
			query: id => `characters/${id}?${_apiKey}`,
			transformResponse: res =>  _transformCharacter(res.data.results[0])
 		}),
		getCharByName: builder.query({
			query: name => `characters?name=${name}&${_apiKey}`,
			transformResponse: res => {
				if (!res.data.results.length) throw new Error('Character not found')
				return _transformCharacter(res.data.results[0])
			}
		})
	})
})

export const {
	useGetCharsQuery,
	useLazyGetCharsQuery,
	useGetCharsBySearchQuery,
	useLazyGetCharsBySearchQuery,
	useGetCharByNameQuery,
	useLazyGetCharByNameQuery,
	useGetCharByIdQuery,
	useLazyGetCharByIdQuery,
} = extendedApiSlice

const initialState = {
	search: '_',
	selected: null
}

const charsSlice = createSlice({
    name: 'chars',
    initialState,
    reducers: {
        changeSearch(state, action) {
						return state = { ...state, search: action.payload }
        },
				changeSelected(state, action) {
						return state = { ...state, selected: action.payload }
        }
    }
})

export const { changeSearch, changeSelected } = charsSlice.actions

export default charsSlice.reducer

export const selectSearch = state => state.chars.search
export const selectChar = state => state.chars.selected

