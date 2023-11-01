// @ts-check

import { authors, genres } from "./data.js";

/**
 * Finds and returns the HTML element with the specified data attribute. Throws an error if the element
 * with the specified data attribute is not of type 'HTMLElement'.
 *
 * @param {Object} props - The properties object containing parameters for the search.
 * @param {string} props.dataAttr - The data attribute to search for, excluding the `data-` prefix.
 * @param {string} [props.value] - Optional value assigned to the data attribute, if any.
 * @param {HTMLElement | ShadowRoot} [props.target] - Optional element (`HTMLElement` |`ShadowRoot`) to traverse for precise search.
 * @returns {HTMLElement} The HTML element with the specified data attribute.
 */
const getHTML = (props) => {
	const { dataAttr, value, target } = props;

	const selector = value
		? `[data-${dataAttr}="${value}"]`
		: `[data-${dataAttr}]`;
	const scope = target || document;
	const element = scope.querySelector(selector);
	const isHTMLElement = element instanceof HTMLElement;

	if (!isHTMLElement) {
		throw new Error(
			`The element with the data attribute ${selector} is not an HTMLElement`
		);
	}
	return element;
};

// HTML DOM Elements

/**
 * An Object literal which includes all the HTML elements that are referenced in
 * the Javascript script and modules codebase. The elements are structured
 * within sub-Object literals in order to create separation based on the type of
 * function/ purpose they serve in the app. *
 */
const book = {
	header: {
		search: getHTML({ dataAttr: "header-search" }),
		settings: getHTML({ dataAttr: "header-settings" }),
	},
	list: {
		dialog: getHTML({ dataAttr: "list-active" }),
		items: getHTML({ dataAttr: "list-items" }),
		message: getHTML({ dataAttr: "list-message" }),
		title: getHTML({ dataAttr: "list-title" }),
		blur: getHTML({ dataAttr: "list-blur" }),
		image: getHTML({ dataAttr: "list-image" }),
		subtitle: getHTML({ dataAttr: "list-subtitle" }),
		description: getHTML({ dataAttr: "list-description" }),
		button: getHTML({ dataAttr: "list-button" }),
		close: getHTML({ dataAttr: "list-close" }),
	},
	search: {
		dialog: getHTML({ dataAttr: "search-overlay" }),
		form: getHTML({ dataAttr: "search-form" }),
		title: getHTML({ dataAttr: "search-title" }),
		genres: getHTML({ dataAttr: "search-genres" }),
		authors: getHTML({ dataAttr: "search-authors" }),
		cancel: getHTML({ dataAttr: "search-cancel" }),
	},
	settings: {
		dialog: getHTML({ dataAttr: "settings-overlay" }),
		form: getHTML({ dataAttr: "settings-form" }),
		theme: getHTML({ dataAttr: "settings-theme" }),
		cancel: getHTML({ dataAttr: "settings-cancel" }),
	},
};

// createBookAttributeHTML

/**
 * Generates a document fragment containing option elements for a collection of
 * genres or authors.
 *
 * @param {Object<string, string>} bookAttributeSource - An object with a
 * collection of either genres or authors.
 * @param {"Genres" | "Authors"} attributeType - The type of book attribute
 * source (`"Genres"` or `"Authors"`).
 * @returns {DocumentFragment} A document fragment containing option elements to
 * be added to the HTML DOM and displayed to the user.
 */
const createBookAttributeHTML = (bookAttributeSource, attributeType) => {
	const bookAttributeFragment = document.createDocumentFragment();
	const firstOptionElement = document.createElement("option");

	firstOptionElement.value = "any";
	firstOptionElement.innerText = `All ${attributeType}`;

	bookAttributeFragment.appendChild(firstOptionElement);

	// eslint-disable-next-line no-restricted-syntax
	for (const [id, name] of Object.entries(bookAttributeSource)) {
		const optionElement = document.createElement("option");

		optionElement.value = id;
		optionElement.innerText = name;
		bookAttributeFragment.appendChild(optionElement);
	}
	return bookAttributeFragment;
};

/* The below lines of code create genres and authors fragments which are then
appended to the HTML DOM when the app loads. 
*/
book.search.genres.appendChild(createBookAttributeHTML(genres, "Genres"));
book.search.authors.appendChild(createBookAttributeHTML(authors, "Authors"));

export { book, getHTML };
