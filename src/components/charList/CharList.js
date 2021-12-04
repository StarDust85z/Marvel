import { Component } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

class CharList extends Component {
    
    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 310,
        charEnded: false
    }

    marvelService = new MarvelService();

    componentDidMount() {        
        this.updateList();
    }

    onListLoading = () => {
        this.setState({newItemLoading: true})        
    }

    onListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        this.setState(({charList, offset}) => ({
            charList: [...charList, ...newCharList], 
            loading: false, 
            error: false, 
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    onError = () => {
        this.setState({error: true, loading: false})
    }

    updateList = (offset) => {
        this.setState({newItemLoading: true})

        this.marvelService
            .getAllCharacters(offset)
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
        const {charList, loading, error, offset, newItemLoading, charEnded} = this.state;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;        

        const content = !(loading || error) ? this.renderItems(charList) : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}                
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{ 'display': charEnded ? 'none' : 'block' }}
                    onClick={() => this.updateList(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = { onCharSelected: PropTypes.func.isRequired }

export default CharList;