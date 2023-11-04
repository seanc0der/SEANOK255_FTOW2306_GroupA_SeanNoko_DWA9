// @ts-check

import { book } from "./dom-manipulation.js";
import { books, authors } from "./data.js";

/**
 * The max number of books that can be loaded on a single page.
 * @type {number}
 * */
const BOOKS_PER_PAGE = 36;

/**
 * @typedef {object} BookItem - A book object containing specific metadata expressed as object properties.
 * @property {string} id - The book ID.
 * @property {string[]} genres - An array of genre IDs, which can be used to find the genre name from the {@link genres} database.
 * @property {number} popularity - The rank of the book based on popularity. The higher the number, the less popular it is.
 * @property {string} title - The title of the book.
 * @property {string} image - The thumbnail or cover photo of the book.
 * @property {string} description - A synopsis of the book.
 * @property {number} pages - The total number of pages of the book.
 * @property {string} published - The date the book was published, in the ISO Date format.
 * @property {string} author - The author ID, which can be used to find the author's name from the {@link author} database.
 */

/**
 * A class that creates a BooksPreview object to handle book previews and related operations.
 */
class BooksPreview {
	/**
	 * Creates a `book-preview` element with attributes derived from the passed
	 * `singleBook` argument, and returns it.
	 *
	 * @param {BookItem} singleBook - a Book Object containing the necessary metadata of the book.
	 * @returns {HTMLElement} The created `book-preview` custom element.
	 */
	#createBookPreviewElement = (singleBook) => {
		const { id, title, author: authorId, image } = singleBook;
		const author = this.#authorsSource[authorId];

		const bookPreviewElement = document.createElement("book-preview");

		bookPreviewElement.setAttribute("id", id);
		bookPreviewElement.setAttribute("image", image);
		bookPreviewElement.setAttribute("title", title);
		bookPreviewElement.setAttribute("author", author);

		return bookPreviewElement;
	};

	/**
	 * Updates the `showMoreButton` element with the remaining book count and
	 * handles the button's disablement when the remaining book count is `0`.
	 *
	 * @returns {void}
	 */
	#updateRemainingBooks() {
		if (this.#page === null) return;

		const checkBooksInLibrary =
			this.#booksSource.length - this.#page * BOOKS_PER_PAGE;
		const remainingBooks = Math.max(0, checkBooksInLibrary);

		this.#showMoreButton.innerHTML = /* html */ `
		<span>Show more</span>,
		<span class="list__remaining">(${remainingBooks})</span>
	`;

		if (remainingBooks === 0) this.#showMoreButton.disabled = true;
	}

	/**
	 * Represents a range of values with a start and an end index.
	 * @typedef {object} Range
	 * @property {number} start - The start index of the range.
	 * @property {number} end - The end index of the range.
	 */

	/**
	 * A range object to aid in the slicing of the `booksSource` via the `slice`
	 * method.
	 *
	 * @type {Object<string, number>}
	 */
	#range = {
		start: 0,
		end: BOOKS_PER_PAGE,
	};

	/** @type {number | null} */
	#page = null;

	/** @type {BookItem[]} */
	#booksSource;

	/** @type {Object<string, string>} */
	#authorsSource;

	/** @type {HTMLElement} */
	#targetElement;

	/** @type {HTMLButtonElement} */
	#showMoreButton;

	/**
	 * Creates an instance of the BooksPreview class.
	 * @param {Object} props - The properties for the BooksPreview instance.
	 * @param {BookItem[]} props.booksSource - The library/source of books.
	 * @param {Object<string, string>} props.authorsSource - The authors source database.
	 * @param {HTMLElement} props.targetElement - The target HTMLelement to append the generated book previews to.
	 * @param {HTMLElement} props.showMoreButton - The button responsible for loading additional books to the user.
	 * @throws {Error} Throws an error if the showMoreButton is not an HTMLButtonElement.
	 */
	constructor(props) {
		this.#booksSource = props.booksSource;
		this.#authorsSource = props.authorsSource;
		this.#targetElement = props.targetElement;

		if (!(props.showMoreButton instanceof HTMLButtonElement)) {
			throw new Error(
				`The ${props.showMoreButton} HTMLElement is not an HTMLButtonElement Type`
			);
		}

		this.#showMoreButton = props.showMoreButton;
	}

	/**
	 * Clears the inner text content of the passed `targetElement` before adding the
	 * custom `book-preview` elements. The page number and the number of remaining
	 * books are then updated. This results in the modification of the inner text
	 * content of the passed `showMoreButton` element.
	 *
	 * @throws Throws an error if the method is called when the current
	 * `page` is not `null`, indicating that the first page has already been loaded.
	 * The `loadFirstPage` method can only be called once to prepend the first page.
	 * @returns {void}
	 */
	loadFirstPage = () => {
		if (this.#page !== null) {
			throw new Error(
				"The first page has already been loaded using this method. To load additional pages, use the 'loadNextPage' method."
			);
		}
		this.#targetElement.innerHTML = "";

		const extractedBooks = this.#booksSource.slice(
			this.#range.start,
			this.#range.end
		);

		const bookPreviewElements = extractedBooks.map(
			this.#createBookPreviewElement
		);

		bookPreviewElements.forEach((element) =>
			this.#targetElement.appendChild(element)
		);

		this.#page = 1;
		this.#updateRemainingBooks();
	};

	/**
	 * Loads additional books onto the next page,
	 * updates the page number internally, and displays the count of remaining books
	 * that the user can load. If no books are left to load, it disables the `showMoreButton` target.
	 *
	 * @returns {void}
	 *
	 * @throws Throws an error if it called when the current `page` is
	 * `null` as this indicates that the first page has not yet been loaded. It
	 * can only be called after the `loadFirstPage` method has been called to load the fist page.
	 */
	loadNextPage = () => {
		if (this.#page === null) {
			throw new Error(
				"The first page has not been loaded yet. Please use the 'loadFirstPage' method first."
			);
		}

		this.#range.start += BOOKS_PER_PAGE;
		this.#range.end += BOOKS_PER_PAGE;

		const extractedBooks = this.#booksSource.slice(
			this.#range.start,
			this.#range.end
		);

		const bookPreviewElements = extractedBooks.map(
			this.#createBookPreviewElement
		);

		bookPreviewElements.forEach((element) =>
			this.#targetElement.appendChild(element)
		);

		this.#page += 1;
		this.#updateRemainingBooks();
	};

	get currentPage() {
		return this.#page;
	}

	/**
	 * Get the current page state.
	 * @throws Throws an error if an attempt is made to assign a new value to it.
	 */
	// eslint-disable-next-line class-methods-use-this
	set currentPage(newPageNum) {
		throw new Error("Cannot change the page number");
	}

	get currentBooksSource() {
		return this.#booksSource;
	}

	/**
	 * Passing a new books source will reset the page number and clear the
	 * passed `targetElement`'s inner text content. The `loadFirstPage` method
	 * would need to be called to load the first batch of books-previews again.
	 * @param {BookItem[]} newBooksSource
	 */
	set currentBooksSource(newBooksSource) {
		this.#range.start = 0;
		this.#range.end = BOOKS_PER_PAGE;
		this.#page = null;
		this.#booksSource = newBooksSource;
	}

	get currentAuthorsSource() {
		return this.#authorsSource;
	}

	/**
	 * A `newAuthorsSource` database can be passed, with additional data (authors), for example.
	 * @param {Object<string, string>} newAuthorsSource
	 */
	set currentAuthorsSource(newAuthorsSource) {
		this.#authorsSource = newAuthorsSource;
	}
}

/**
 * A books preview object based on the {@link books} as its starting book source argument
 * (default). The default book source can be replaced with a different one by
 * passing it as an argument to the `currentBooksSource` class method.
 * Subsequently, the `loadFirstPage` and `loadNextPage` methods can
 * be invoked to regenerate and append the new book previews to the
 * `targetElement`.
 */
const booksPreview = new BooksPreview({
	booksSource: books,
	authorsSource: authors,
	targetElement: book.list.items,
	showMoreButton: book.list.button,
});

// Upon app loading, the first `book-preview`'s batch is generated and appended
// to the first page of the app, and the passed `showMoreButton` target's inner
// text content is updated with the remaining books count.
booksPreview.loadFirstPage();

export default booksPreview;
