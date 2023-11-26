# Are there any problems or code smells in the app?
Resolved all 

- `book-search.component.html` => We should replace formatDate function call with native date pipe as formatDate function is called on every angular change detection cycle where date pipe(by default pure) code runs only when input data is modified.
- `book-search.component.ts` => Memory leak: Unsubscribe missing for subscription done on getAllBooks. Using async pipe Instead of subscribe will allow to access to data in the template without creating extra property. 
- `reading-list.reducer.spec.ts` => Test cases are failing
- `books.reducer.ts` => Unused store property: "searchTerm" is updated from the reducer but is not referred anywhere in component/selector.
- `reading-list.reducer.ts` => failedAddToReadingList & failedRemoveFromReadingList actions are not caught in the reducer. We need to handle failure of add/remove book API calls so we can revert the state for added/removed book else it will result in inaccurate data being displayed to the user.
- `book-search.component.html, reading-list.component.html` => Variables name should be more meaningful.
  eg.: `b` variable in SearchForm of book-search component should be more descriptive. Instead of that we can use it as `book` for better understanding.

# Are there other improvements you would make to the app? What are they and why?

- There is no spinner while fetching books, books loading might take some time on slow networks so it would be good to show spinner while user is waiting.
- The pagination is not implemented so only 10 books are fetched currently matching the search criteria, adding pagination would allow user to move through pages of book items and see more than 10 books. As an option to pagination we can also add infinite loading feature where user can scroll as per need to see more books.
- Provide informational message to the user, if books are not found for the specific search term.
- _Resolved_: `books.effects.ts, reading-list.effects.ts` => Constant is not used for API endpoints.
- _Resolved_: `book-search.component.html` => Instead of interpolating coverUrl `<img src="{{ b.coverUrl }}" />`, we can use property binding on src attribute `<img [src]="b.coverUrl" />`.
- `book-search.component.html, reading-list.component.html` => The css class naming is not following standard, for e.g. book--title, book--content etc. If we are following BEM naming convention then ideally book--title should be book__title as title is a div element inside book block.

# Accessibilities issues:

All issues Resolved

## Lighthouse

- `app.component.html`- Buttons do not have an accessible name.
- `app.component.scss, book-search.component.scss`- Adjusted background and foreground colors to achieve sufficient contrast ratio between them. 
- Enhanced the styling of button elements to improve keyboard navigation and usability.

## Issues found in Manual scan

- `book-search.component.html, reading-list.component.html`- Added `alt` attribute to `img` tags as it specifies an alternate text for image in case the image is not loaded.

- `book-search.component.html` - Added `aria-label` attribute with appropriate value in the elements wherever required to make accessible for screen readers.
- `app.component.html` => Close reading list button is only icon button, so we should add aria-label attribute to the button so it will help screenreaders to inform user. Also close button keyboard focus should have better visiblity.

- `book-search.component.html` => Example "JavaScript" link should be a button instead of anchor tag as we are not using href attribute or redirecting to any other page. We are only handling click to action to search books.

# Improvements

- Can make the application responsive for smaller screens.

- For better user experience, a spinner can be added when awaiting API response.

- Appropriate error messages should be displayed to user in case of API failure. 

- To clear search results, clear button can be added in order to improve UX.
