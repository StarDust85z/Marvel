import { apiSlice } from './apiSlice'

const _apiKey = `apikey=${process.env.REACT_APP_API_KEY}`
const _baseOffset = 310

const _transformCharacter = (char) => {
	return {
		name: char.name,
		description: char.description,
		thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
		homepage: char.urls[0].url,
		wiki: char.urls[1].url,
		id: char.id,
		comics: char.comics.items
	}
}

export const extendedApiSlice = apiSlice.injectEndpoints({
	endpoints: builder => ({
		getChars: builder.query({
            query: ({offset = _baseOffset, limit = 9}) => `characters?limit=${limit}&offset=${offset}&${_apiKey}`,
			transformResponse: res => {
				return res.data.results.map(_transformCharacter)
			},
            providesTags: 'Char',
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
	useGetCharByNameQuery,
	useLazyGetCharByNameQuery,
	useGetCharByIdQuery,
	useLazyGetCharByIdQuery,
} = extendedApiSlice

