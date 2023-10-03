class App {
  constructor(options) {
    this.options = {
      navigation: true,
      ...options,
    };
    this.tagsCollection = [];

    document.querySelectorAll('.gallery').forEach((gallery) => {
      this.createRowWrapper(gallery);
      if (this.options.lightBox) {
        this.createLightBox(
          gallery,
          this.options.lightboxId,
          this.options.navigation
        );
      }
      this.listeners();

      gallery.querySelectorAll('.gallery-item').forEach((item) => {
        this.responsiveImageItem(item);
        this.moveItemInRowWrapper(item);
        this.wrapItemInColumn(item, this.options.columns);
        const theTag = item.getAttribute('data-gallery-tag');
        if (
          this.options.showTags &&
          theTag !== undefined &&
          this.tagsCollection.indexOf(theTag) === -1
        ) {
          this.tagsCollection.push(theTag);
        }
      });

      if (this.options.showTags) {
        this.showItemTags(
          gallery,
          this.options.tagsPosition,
          this.tagsCollection
        );
      }

      gallery.style.display = 'block';
    });
  }

  createRowWrapper(element) {
    if (!element.children[0].classList.contains('row')) {
      const rowWrapper = document.createElement('div');
      rowWrapper.classList.add('gallery-items-row', 'row');
      element.appendChild(rowWrapper);
    }
  }

  wrapItemInColumn(element, columns) {
    if (columns.constructor === Number) {
      const columnWrapper = document.createElement('div');
      columnWrapper.classList.add(
        'item-column',
        'mb-4',
        `col-${Math.ceil(12 / columns)}`
      );
      element.parentNode.insertBefore(columnWrapper, element);
      columnWrapper.appendChild(element);
    } else if (columns.constructor === Object) {
      const columnWrapper = document.createElement('div');
      columnWrapper.classList.add('item-column', 'mb-4');
      if (columns.xs) {
        columnWrapper.classList.add(`col-${Math.ceil(12 / columns.xs)}`);
      }
      if (columns.sm) {
        columnWrapper.classList.add(`col-sm-${Math.ceil(12 / columns.sm)}`);
      }
      if (columns.md) {
        columnWrapper.classList.add(`col-md-${Math.ceil(12 / columns.md)}`);
      }
      if (columns.lg) {
        columnWrapper.classList.add(`col-lg-${Math.ceil(12 / columns.lg)}`);
      }
      if (columns.xl) {
        columnWrapper.classList.add(`col-xl-${Math.ceil(12 / columns.xl)}`);
      }
      element.parentNode.insertBefore(columnWrapper, element);
      columnWrapper.appendChild(element);
    } else {
      console.error(
        `Columns should be defined as numbers or objects. ${typeof columns} is not supported.`
      );
    }
  }

  moveItemInRowWrapper(element) {
    element.parentNode.querySelector('.gallery-items-row').appendChild(element);
  }

  responsiveImageItem(element) {
    if (element.tagName === 'IMG') {
      element.classList.add('img-fluid');
    }
  }

  openLightBox(element, lightboxId) {
    document
      .querySelector(`#${lightboxId}`)
      .querySelector('.lightboxImage').src = element.src;
    const modal = new bootstrap.Modal(document.querySelector(`#${lightboxId}`));
    modal.toggle();
  }

  prevImage(lightboxId) {
    const activeImageSrc = document.querySelector(
      `#${lightboxId} .lightboxImage`
    ).src;
    const activeImage = Array.from(
      document.querySelectorAll('.gallery-item img')
    ).find(function (img) {
      return img.src === activeImageSrc;
    });
    const activeTag = document
      .querySelector('.tags-bar span.active-tag')
      .getAttribute('data-images-toggle');
    let imagesCollection = [];
    if (activeTag === 'all') {
      imagesCollection = Array.from(
        document.querySelectorAll('.gallery-item img')
      );
    } else {
      imagesCollection = Array.from(
        document.querySelectorAll('.gallery-item img')
      ).filter(function (img) {
        return img.parentNode.getAttribute('data-gallery-tag') === activeTag;
      });
    }
    let index = imagesCollection.indexOf(activeImage);
    index = (index - 1 + imagesCollection.length) % imagesCollection.length;
    const next = imagesCollection[index];
    document.querySelector('.lightboxImage').src = next.src;
  }

  nextImage(lightboxId) {
    const activeImageSrc = document.querySelector(
      `#${lightboxId} .lightboxImage`
    ).src;
    const activeImage = Array.from(
      document.querySelectorAll('.gallery-item img')
    ).find(function (img) {
      return img.src === activeImageSrc;
    });
    const activeTag = document
      .querySelector('.tags-bar span.active-tag')
      .getAttribute('data-images-toggle');
    let imagesCollection = [];
    if (activeTag === 'all') {
      imagesCollection = Array.from(
        document.querySelectorAll('.gallery-item img')
      );
    } else {
      imagesCollection = Array.from(
        document.querySelectorAll('.gallery-item img')
      ).filter(function (img) {
        return img.parentNode.getAttribute('data-gallery-tag') === activeTag;
      });
    }
    let index = imagesCollection.indexOf(activeImage);
    index = (index + 1) % imagesCollection.length;
    const next = imagesCollection[index];
    document.querySelector('.lightboxImage').src = next.src;
  }

  createLightBox(gallery, lightboxId, navigation) {
    gallery.insertAdjacentHTML(
      'beforeend',
      `<div class="modal fade" id="${
        lightboxId ? lightboxId : 'galleryLightbox'
      }" tabindex="-1" role="dialog" aria-hidden="true">
              <div class="modal-dialog" role="document">
                  <div class="modal-content">
                      <div class="modal-body">
                          ${
                            navigation
                              ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>'
                              : '<span style="display:none;" />'
                          }
                          <img class="lightboxImage img-fluid" alt="Contenu de l'image affichée dans la modale au clique"/>
                          ${
                            navigation
                              ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;}">></div>'
                              : '<span style="display:none;" />'
                          }
                      </div>
                  </div>
              </div>
          </div>`
    );
  }

  showItemTags(gallery, position, tags) {
    let tagItems =
      '<li class="nav-item"><span class="nav-link active active-tag"  data-images-toggle="all">Tous</span></li>';
    tags.forEach(function (value) {
      tagItems += `<li class="nav-item active">
              <span class="nav-link"  data-images-toggle="${value}">${value}</span></li>`;
    });
    const tagsRow = `<ul class="my-4 tags-bar nav nav-pills">${tagItems}</ul>`;

    if (position === 'bottom') {
      gallery.insertAdjacentHTML('beforeend', tagsRow);
    } else if (position === 'top') {
      gallery.insertAdjacentHTML('afterbegin', tagsRow);
    } else {
      console.error(`Unknown tags position: ${position}`);
    }
  }

  filterByTag() {
    if (this.classList.contains('active-tag')) {
      return;
    }
    document
      .querySelector('.active-tag')
      .classList.remove('active-tag', 'active');
    this.classList.add('active-tag', 'active');

    const tag = this.getAttribute('data-images-toggle');

    document.querySelectorAll('.gallery-item').forEach((item) => {
      item.closest('.item-column').style.display = 'none';
      if (tag === 'all') {
        item.closest('.item-column').style.display = 'block';
      } else if (item.getAttribute('data-gallery-tag') === tag) {
        item.closest('.item-column').style.display = 'block';
      }
    });
  }

  listeners() {
    document.querySelectorAll('.gallery-item').forEach((item) => {
      item.addEventListener('click', () => {
        if (
          this.options.lightBox &&
          (item.tagName === 'PICTURE' ||
            item.querySelectorAll('img').length > 0)
        ) {
          this.openLightBox(
            item.querySelector('img'),
            this.options.lightboxId
          );
        } else {
          return;
        }
      });
    });

    document.querySelector('.gallery').addEventListener('click', (event) => {
      if (event.target.classList.contains('nav-link')) {
        this.filterByTag.call(event.target);
      }
      if (event.target.classList.contains('mg-prev')) {
        this.prevImage(this.options.lightboxId);
      }
      if (event.target.classList.contains('mg-next')) {
        this.nextImage(this.options.lightboxId);
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const galleryOptions = {
    columns: {
      xs: 1,
      sm: 2,
      md: 3,
      lg: 3,
      xl: 3,
    },
    lightBox: true,
    lightboxId: 'myAwesomeLightbox',
    showTags: true,
    tagsPosition: 'top',
  };
  new App(galleryOptions);
});
