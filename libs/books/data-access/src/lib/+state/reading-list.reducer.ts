import { Action, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import * as ReadingListActions from './reading-list.actions';
import { ReadingListItem } from '@tmo/shared/models';

export const READING_LIST_FEATURE_KEY = 'readingList';

export interface State extends EntityState<ReadingListItem> {
  loaded: boolean;
  error: null | string;
}

export interface ReadingListPartialState {
  readonly [READING_LIST_FEATURE_KEY]: State;
}

export const readingListAdapter: EntityAdapter<ReadingListItem> = createEntityAdapter<
  ReadingListItem
>({
  selectId: item => item.bookId
});

export const initialState: State = readingListAdapter.getInitialState({
  loaded: false,
  error: null
});

const readingListReducer = createReducer(
  initialState,
  on(ReadingListActions.init, state => {
    return {
      ...state,
      loaded: false,
      error: null
    };
  }),
  on(ReadingListActions.loadReadingListSuccess, (state, { list }) => {
    return readingListAdapter.setAll(list, {
      ...state,
      loaded: true
    });
  }),
  on(ReadingListActions.loadReadingListError, (state, { error }) => {
    return {
      ...state,
      error
    };
  }),
  on(ReadingListActions.addToReadingList, (state, { book }) =>
    readingListAdapter.addOne({ bookId: book.id, ...book }, state)
  ),
  on(ReadingListActions.removeFromReadingList, (state, { item }) =>
  readingListAdapter.removeOne(item.bookId, state)
  ),
  on(ReadingListActions.failedAddToReadingList, (state, { book }) =>
    readingListAdapter.removeOne(book.id, state)
  ),
  on(ReadingListActions.failedRemoveFromReadingList, (state, { item }) =>
    readingListAdapter.addOne(item, state)
    ),  
  on(ReadingListActions.markBookAsFinished, (state, { item }) =>
    readingListAdapter.updateOne(
      {
        id: item.bookId,
        changes: item
      },
      state
    )
  ),
  on(ReadingListActions.failedMarkBookAsFinished, (state, { item }) =>
    readingListAdapter.updateOne(
      {
        id: item.bookId,
        changes: {
          finished: false,
          finishedDate: undefined
        }
      },
      state
    )
  )
);

export function reducer(state: State | undefined, action: Action) {
  return readingListReducer(state, action);
}
