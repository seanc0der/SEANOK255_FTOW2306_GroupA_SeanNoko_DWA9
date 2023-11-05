// @ts-check

import "./components/book-preview.js";
import { books } from "./modules/data.js";
import { book } from "./modules/dom-manipulation.js";
import booksPreview from "./modules/books-preview.js";
import BookPreviewDialog from "./components/book-preview-dialog.js";

// toggleDialogHandler

/**
 * Toggles the dialog for either {@link book.search.dialog},
 * {@link book.list.dialog}, or {@link book.settings.dialog} based on the
 * provided {@link feature}. The function automatically opens the dialog modal
 * if it's closed, or closes it if it's open, for the associated `feature`
 * (search, list, or settings dialog) when invoked.
 *
 * @param {"search" | "list" | "settings"} feature - The app features that
 * support the dialog modal.
 */
const handleToggleDialog = (feature) => {
	if (book[feature].dialog.open) {
		book[feature].dialog.close();
	} else {
		book[feature].dialog.showModal();
	}
};

// toggleThemeHandler

/**
 * Event handler function triggered when a user submits the
 * {@link book.settings.form}. This function retrieves the selected
 * {@link book.settings.theme} value, which can be either `night` or `day`. The
 * selected theme is used as a key to fetch the corresponding CSS RGB color
 * styles for the dark and light themes from the {@link css} object literal.
 * These CSS property values are then individually parsed into the
 * `CSSStyleDeclaration.setProperty()` method as new values. Subsequently, the
 * CSS properties (`--color-dark` or `--color-light`) are updated using this
 * method, effectively toggling the app's theme between 'night' and 'day.'
 *
 * @param {Event} event - The event object representing the form submission.
 */
const toggleThemeHandler = (event) => {
	event.preventDefault();

	const css = {
		day: { dark: "10, 10, 20", light: "255, 255, 255" },
		night: { dark: "255, 255, 255", light: "10, 10, 20" },
	};

	if (!(event.target instanceof HTMLFormElement)) {
		throw new Error(
			`${event.target} is not an instance of HTMLFormElement type`
		);
	}

	const formData = new FormData(event.target);
	const { theme } = Object.fromEntries(formData);

	const cssRule = document.styleSheets[0].cssRules[0];

	if (!(cssRule instanceof CSSStyleRule)) {
		throw new Error(`${cssRule} is not a CSSSyleRule`);
	}

	const styleDeclaration = cssRule.style;

	styleDeclaration.setProperty("--color-dark", css[theme].dark);
	styleDeclaration.setProperty("--color-light", css[theme].light);

	handleToggleDialog("settings");
};

// handleBookPreviewDialog

/**
 * Handles the 'BookPreviewClicked' event by extracting essential book details
 * from the custom event's `detail`. The extracted information includes the
 * book's `id`, `title`, `image`, and `author`. The handler then fetches
 * additional metadata such as the book's `description` and date `published`
 * from the {@link books} database. These values are assigned as attributes to
 * the `book-preview-dialog` before displaying the dialog modal to the user.
 * @param {Event} event - The click event with custom detail data.
 */
const handleBookPreviewDialog = (event) => {
	if (!(event instanceof CustomEvent)) {
		throw new Error(`${event} is not an instance of CustomEvent`);
	}
	const { id, title, image, author } = event.detail;

	const bookPreviewDialog = document.createElement("book-preview-dialog");

	bookPreviewDialog.setAttribute("title", title);
	bookPreviewDialog.setAttribute("image", image);
	bookPreviewDialog.setAttribute("blur", image);

	books.forEach((singleBook) => {
		if (singleBook.id === id) {
			const publishedYear = new Date(singleBook.published).getFullYear();
			const subtitle = `${author} (${publishedYear})`;

			bookPreviewDialog.setAttribute("subtitle", subtitle);
			bookPreviewDialog.setAttribute("description", singleBook.description);
		}
	});

	// Insert the custom element to ensure all dialog-related elements are grouped together.
	document.body.insertBefore(bookPreviewDialog, book.search.dialog);

	if (!(bookPreviewDialog instanceof BookPreviewDialog)) {
		throw new Error(
			`The ${bookPreviewDialog} instance is not an instance of BookPreviewDialog class`
		);
	}

	bookPreviewDialog.open = true;
};

// handleBookFilterSearch

/**
 * This event handler takes a user's book search inputs (`title`, `authors`,
 * and/or `genres`) when the {@link book.search.form} is submitted. It iterates
 * over the {@link books} book library and assigns the result of all books that
 * match the supplied search inputs to the {@link current.booksSource} as the
 * new reference book library, but filtered. The {@link current.page} is reset
 * to `1`, the {@link book.list.items} book preview catalog is cleared, and the
 * {@link createBookPreviewsHTML} function is called to create the first
 * filtered book previews fragment, which is then appended to the HTML DOM.
 * Additional filtered book previews fragments will be created and appended to
 * the HTML DOM when the user loads more books by clicking the
 * {@link book.list.button}. If the book search returns fewer than `1` book from
 * the main book library, an error message will be displayed to the user.
 */
const handleBookFilterSearch = (event) => {
	event.preventDefault();

	const formData = new FormData(event.target);
	const filters = Object.fromEntries(formData);
	const result = [];

	// eslint-disable-next-line no-restricted-syntax, no-shadow
	for (const book of books) {
		let genreMatch = filters.genre === "any";

		// eslint-disable-next-line no-restricted-syntax
		for (const singleGenre of book.genres) {
			if (genreMatch) break;
			if (singleGenre === filters.genre) genreMatch = true;
		}

		if (typeof filters.title !== "string") {
			throw new Error(`${filters.title} is not a string`);
		}

		if (
			(filters.title.trim() === "" ||
				book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
			(filters.author === "any" || book.author === filters.author) &&
			genreMatch
		) {
			result.push(book);
		}
	}

	if (result.length < 1) {
		book.list.message.classList.add("list__message_show");
	} else {
		book.list.message.classList.remove("list__message_show");
	}

	booksPreview.currentBooksSource = result;
	booksPreview.loadFirstPage();

	window.scrollTo({ top: 0, behavior: "smooth" });
	handleToggleDialog("search");

	if (!(book.search.form instanceof HTMLFormElement)) {
		throw new Error(`${book.search.form} is not an HTMLFormElement`);
	}
	book.search.form.reset();
};

// Event Handlers

book.search.cancel.addEventListener("click", () => {
	handleToggleDialog("search");
});

book.settings.cancel.addEventListener("click", () => {
	handleToggleDialog("settings");
});

book.header.search.addEventListener("click", () => {
	handleToggleDialog("search");
	book.search.title.focus();
});

book.header.settings.addEventListener("click", () => {
	handleToggleDialog("settings");
});

book.list.button.addEventListener("click", booksPreview.loadNextPage);
book.list.items.addEventListener("bookPreviewClicked", handleBookPreviewDialog);
book.search.form.addEventListener("submit", handleBookFilterSearch);
book.settings.form.addEventListener("submit", toggleThemeHandler);
