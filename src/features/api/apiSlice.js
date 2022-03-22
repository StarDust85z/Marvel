import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const _apiKey = `apikey=${process.env.REACT_APP_API_KEY}`

const _transformComic = (comic) => {
	return {
		title: comic.title,
		thumbnail: comic.thumbnail.path + '.' + comic.thumbnail.extension,
		description: comic.description || 'Description not available',
		pageCount: comic.pageCount ? `${comic.pageCount} pages` : 'Number of pages: not available',
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
		getComics: builder.query({
			query: (offset = 0) => `comics?orderBy=issueNumber&limit=9&offset=${offset}&${_apiKey}`,
			transformResponse: res => res.data.results.map(_transformComic)
		}),
		getComicById: builder.query({
			query: id => `comics/${id}?${_apiKey}`,
			transformResponse: res => _transformComic(res.data.results[0])
		}),
		getComicsByCharId: builder.query({
			query: ({id, offset = 0}) => `characters/${id}/comics?limit=21&offset=${offset}&${_apiKey}`,
			transformResponse: res => res.data.results.map(_transformComic)
		})
	})
})

export const { 
	useGetComicByIdQuery,
	useLazyGetComicByIdQuery,
	useLazyGetComicsQuery,
	useGetComicsByCharIdQuery,
	useLazyGetComicsByCharIdQuery
} = apiSlice
