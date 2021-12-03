import { Component } from 'react';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

class CharList extends Component {
    
    state = {
        list: [],
        loading: true,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() {        
        this.updateList();
    }

    onListLoaded = (list => {
        this.setState({list, loading: false, error: false})
        
    })

    onError = () => {
        this.setState({error: true, loading: false})
    }

    updateList = () => {
        this.setState({error: false, loading: true})

        this.marvelService
            .getAllCharacters()
            .then(this.onListLoaded)
            .catch(this.onError)
    }   

    renderItems(arr) {
        const listItems = arr.map(({name, thumbnail, id}) => {
            if (name.length > 36) name = name.slice(0,36) + '...';

            let imgStyle = thumbnail.endsWith('image_not_available.jpg') ? {'objectFit' : 'unset'} : {'objectFit' : 'cover'};

            return (
                <li className="char__item"
                    key={id}
                    onClick={() => this.props.onCharSelected(id)}>
                    <img src={thumbnail} alt={name} style={imgStyle}/>
                    <div className="char__name">{name}</div>
                </li>
            )
        })

        return (
            <ul className="char__grid">
                {listItems}
            </ul>
        )                
    }

    render () {
        const {list, loading, error} = this.state;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;        

        const content = !(loading || error) ? this.renderItems(list) : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

const ListItem = ({name, thumbnail, id}) => {
    if (name.length > 36) name = name.slice(0,36) + '...';

    let imgStyle = thumbnail.endsWith('image_not_available.jpg') ? {'objectFit' : 'unset'} : {'objectFit' : 'cover'};

    return (
        <li className="char__item"
            key={id}
            onClick={() => this.props.onCharSelected(id)}>
            <img src={thumbnail} alt={name} style={imgStyle}/>
            <div className="char__name">{name}</div>
        </li>
    )
}

export default CharList;