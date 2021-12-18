import { useHttp } from '../hooks/http.hook'

const useMarvelService = () => {
    const { loading, request, error, clearError } = useHttp();
    
    const _apiBase = 'https://gateway.marvel.com:443/v1/public/',
          _apiKey = 'apikey=42332471b4e98cd637b3e677323fc340',
          _baseOffset = 310

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}/characters?limit=9&offset=${offset}&${_apiKey}`);

        return res.data.results.map(_transformCharacter)
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}/characters/${id}?${_apiKey}`);

        return _transformCharacter(res.data.results[0]);
    }

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

    return  { loading, error, clearError, getAllCharacters, getCharacter }
}

export default useMarvelService; 