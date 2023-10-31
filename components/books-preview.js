// @ts-check

import { getHTML } from "../modules/dom-manipulation.js";

const template = document.createElement("template");

template.innerHTML = /* html */ `
	<style>
		* {
		  box-sizing: border-box;
		}


    .preview {
      border-width: 0;
      width: 100%;
      font-family: Roboto, sans-serif;
      padding: 0.5rem 1rem;
      display: flex;
      align-items: center;
      cursor: pointer;
      text-align: left;
      border-radius: 8px;
      min-height: 110px
    }
     
		  border: 1px solid rgba(var(--color-dark), 0.15);
		  background: rgba(var(--color-light), 1);
		}

		@media (min-width: 60rem) {
		  .preview {
			  padding: 1rem;
		  }
		}

		.preview_hidden {
		  display: none;
		}

		.preview:hover {
		  background: rgba(var(--color-blue), 0.05);
		}

		.preview__image {
		  width: 48px;
		  height: 70px;
		  object-fit: cover;
		  background: grey;
		  border-radius: 2px;
		  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
			0px 1px 1px 0px rgba(0, 0, 0, 0.1), 0px 1px 3px 0px rgba(0, 0, 0, 0.1);
		}

		.preview__info {
		  padding: 1rem;
		}

		.preview__title {
		  margin: 0 0 0.5rem;
		  font-weight: bold;
		  display: -webkit-box;
		  -webkit-line-clamp: 2;
		  -webkit-box-orient: vertical;
		  overflow: hidden;
		  color: rgba(var(--color-dark), 0.8)
		}

		.preview__author {
		  color: rgba(var(--color-dark), 0.4);
		}
	</style>

	<button class="preview" data-preview>
		<img class="preview__image" data-preview-image src="" />

		<div class="preview__info">
			<h3 class="preview__title" data-preview-title></h3>
			<div class="preview__author" data-preview-author></div>
		</div>
	</button>
`;

customElements.define(
	"books-preview",

	class extends HTMLElement {
		/** @type {string} */
		#id;

		/** @type {string} */
		#image;

		/** @type {string} */
		#title;

		/** @type {string} */
		#author;

		#elements = {
			/** @type {HTMLElement | undefined} */
			id: undefined,

			/** @type {HTMLElement | undefined} */
			image: undefined,

			/** @type {HTMLElement | undefined} */
			title: undefined,

			/** @type {HTMLElement | undefined} */
			author: undefined,
		};

		/** @type {ShadowRoot} */
		#shadow = this.attachShadow({ mode: "closed" });

		constructor() {
			super();
			const instance = template.content.cloneNode(true);
			this.#shadow.appendChild(instance);
		}

		connectedCallback() {
			this.#id = this.getAttribute("id") || "";
			this.#image = this.getAttribute("image") || "";
			this.#title = this.getAttribute("title") || "";
			this.#author = this.getAttribute("author") || "";

			this.#elements = {
				id: getHTML({ dataAttr: "preview", target: this.#shadow }),
				image: getHTML({ dataAttr: "preview-image", target: this.#shadow }),
				title: getHTML({ dataAttr: "preview-title", target: this.#shadow }),
				author: getHTML({ dataAttr: "preview-author", target: this.#shadow }),
			};

			const { id, image, title, author } = this.#elements;

			if (!(id instanceof HTMLElement)) {
				throw new Error("The instance must be an HTML Element");
			}

			id.setAttribute("data-preview", this.#id);

			if (!(image instanceof HTMLElement)) {
				throw new Error("The instance must be an HTML Element");
			}

			image.setAttribute("src", this.#image);

			if (!(title instanceof HTMLElement)) {
				throw new Error("The instance must be an HTML Element");
			}

			title.textContent = this.#title;

			if (!(author instanceof HTMLElement)) {
				throw new Error("The instance must be an HTML Element");
			}
			author.textContent = this.#author;
		}
	}
);
