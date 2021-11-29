class MarvelService {
     getResource =  async (url) => {
        let res = await fetch(url);
    
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
    
        return await res.json();
    };

    getAllCharacters = () => {
        return this.getResource('https://gateway.marvel.com:443/v1/public/characters?apikey=42332471b4e98cd637b3e677323fc340');
    }
}

export default MarvelService;

// const postData = async (url, data) => {
//     let res = await fetch(url, {
//         method: 'POST',
//         body: data            
//     });

//     return await res.text();
// };

// const getResource = async (url, data) => {
//     let res = await fetch(url);

//     if (!res.ok) {
//         throw new Error(`Could not fetch ${url}, status: ${res.status}`);
//     }

//     return await res.json();
// };

// export {postData, getResource};