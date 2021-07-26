import SearchBar from './Components/SearchBar';
import React, { Component } from 'react';
import ImageGallery from './Components/ImageGallery';
import Modal from './Modal';
import Container from './Components/Container';
import Button from './Components/Button';
import MyLoader from './Components/Loader/Loader';
import Api from './Services/Api';

export default class App extends Component {
  state = {
    hits: [],
    currentPage: 1,
    searchQuery: '',
    isLoading: false,
    showModal: false,
    error: null,
    url: '',
    tag: '',
  };

  toggleModal = () => {
    this.setState(({ showModal }) => ({
      showModal: !showModal,
    }));
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.searchQuery !== this.state.searchQuery) {
      this.fetchhits();
    }
  }

  onChangeQuery = query => {
    this.setState({
      searchQuery: query,
      currentPage: 1,
      hits: [],
      error: null,
    });
  };

  fetchhits = () => {
    const { currentPage, searchQuery } = this.state;

    this.setState({ isLoading: true });

    return Api.findImage(currentPage, searchQuery)
      .then(hits => {
        this.setState(prevState => ({
          hits: [...prevState.hits, ...hits],
          currentPage: prevState.currentPage + 1,
        }));
      })
      .then(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth',
        });
      })
      .catch(error => this.setState({ error }))
      .finally(() => this.setState({ isLoading: false }));
  };

  handleImageClick = ({ target }) => {
    if (target.nodeName !== 'IMG') {
      return;
    }
    const { url } = target.dataset;
    const tag = target.alt;
    this.setState({
      url,
      tag,
      isLoading: false,
    });
    this.toggleModal();
  };

  render() {
    const { hits, showModal, isLoading, url, tag } = this.state;

    return (
      <Container>
        <SearchBar onSubmit={this.onChangeQuery} />
        <ImageGallery hits={hits} onClick={this.handleImageClick} />
        {isLoading && <MyLoader />}
        {hits.length > 0 && !isLoading && <Button onClick={this.fetchhits} />}
        {showModal && (
          <Modal onClose={this.toggleModal} onClick={this.handleImageClick}>
            <img src={url} alt={tag} />
          </Modal>
        )}
      </Container>
    );
  }
}
