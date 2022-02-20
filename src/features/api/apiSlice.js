import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

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

const _transformComic = (comic) => {
	return {
		title: comic.title,
		thumbnail: comic.thumbnail.path + '.' + comic.thumbnail.extension,
		description: comic.description || 'Description not available',
		pageCount: comic.pageCount ? `${comic.pageCount} pages` : 'Number of pages not available',
		language: comic.textObjects.language || "en-us",
		price: comic.prices[0].price ? `${comic.prices[0].price}$` : 'Price not available',
		id: comic.id
	}
}

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://gateway.marvel.com:443/v1/public/' }),
    tagTypes: ['Char'],
    endpoints: builder => ({
        getChars: builder.query({
            query: ({offset = _baseOffset, limit = 9}) => `characters?limit=${limit}&offset=${offset}&${_apiKey}`,
			transformResponse: res => res.data.results.map(_transformCharacter),
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
		}),
		getComics: builder.query({
			query: (offset = 0) => `comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`,
			transformResponse: res => res.data.results.map(_transformComic)
		}),
		getComicById: builder.query({
			query: id => `comics/${id}?${_apiKey}`,
			transformResponse: res => _transformComic(res.data.results[0])
		})
    })
})

export const { 
	useGetCharsQuery,
	useGetCharByNameQuery,
	useLazyGetCharByNameQuery,
	useGetCharByIdQuery,
	useLazyGetCharByIdQuery,
	useGetComicByIdQuery,
	useGetComicsQuery
} = apiSlice
