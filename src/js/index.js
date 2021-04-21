import images from '../js/gallery-items.js';

const refs = {
  galleryContainer: document.querySelector('.js-gallery'),
  modalRef: document.querySelector('.js-lightbox'),
  modalImgRef: document.querySelector('.lightbox__image'),
  modalCloseBtn: document.querySelector('.lightbox__button'),
  modalOverlay: document.querySelector('.lightbox__overlay'),
};

const imagesMarkup = createGalleryList(images);

refs.galleryContainer.insertAdjacentHTML('afterbegin', imagesMarkup);

refs.galleryContainer.addEventListener('click', onModalOpen);

refs.modalCloseBtn.addEventListener('click', onModalClose);

refs.modalOverlay.addEventListener('click', onModalClose);

function createGalleryList(images) {
  return images
    .map(({ preview, original, description }) => {
      return `<li class="gallery__item">
  <a
    class="gallery__link"
    href=${original}
  >
    <img
      class="gallery__image"
      src=${preview}
      data-source=${original}
      alt=${description}
    />
  </a>
</li>`;
    })
    .join('');
}

function onModalOpen(e) {
  e.preventDefault();

  if (e.target.nodeName !== 'IMG') {
    return;
  }
  refs.modalRef.classList.add('is-open');

  setModalImageAttributes(e);

  window.addEventListener('keydown', onModalClose);

  window.addEventListener('keydown', toggleImages);
}

function onModalClose(e) {
  if (
    e.target.dataset.action !== 'close-lightbox' &&
    !e.target.classList.contains('lightbox__overlay') &&
    e.code !== 'Escape'
  ) {
    return;
  }

  refs.modalRef.classList.remove('is-open');

  setModalImageAttributes(e);
  window.removeEventListener('keydown', onModalClose);

  window.removeEventListener('keydown', toggleImages);
}

function setModalImageAttributes(e) {
  if (refs.modalRef.classList.contains('is-open')) {
    setImgAttributes(e.target.dataset.source, e.target.alt);
  } else {
    setImgAttributes('', '');
  }
}

function setImgAttributes(src, alt) {
  refs.modalImgRef.src = src;
  refs.modalImgRef.alt = alt;
}

function toggleImages(e) {
  let currentImg = refs.modalImgRef.src;
  let currentIndex = 0;
  const nextImg = e.code === 'ArrowRight';
  const prevImg = e.code === 'ArrowLeft';

  images.forEach((item, index) => {
    const originalImg = item.original;
    if (currentImg === originalImg) {
      currentIndex = index;
    }
  });

  if (nextImg && currentIndex < images.length - 1) {
    currentIndex += 1;
    setImgAttributes(
      images[currentIndex].original,
      images[currentIndex].description,
    );
    return;
  }
  if (nextImg && currentIndex === images.length - 1) {
    currentIndex = 0;
    setImgAttributes(
      images[currentIndex].original,
      images[currentIndex].description,
    );
    return;
  }
  if (prevImg && currentIndex > 0) {
    currentIndex -= 1;
    setImgAttributes(
      images[currentIndex].original,
      images[currentIndex].description,
    );
    return;
  }
  if (prevImg && currentIndex === 0) {
    currentIndex = images.length - 1;
    setImgAttributes(
      images[currentIndex].original,
      images[currentIndex].description,
    );
    return;
  }
}
