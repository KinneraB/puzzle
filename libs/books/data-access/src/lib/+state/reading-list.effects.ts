import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import {
  catchError,
  concatMap,
  exhaustMap,
  map,
  filter,
  switchMap
} from 'rxjs/operators';
import { ReadingListItem, Book } from '@tmo/shared/models';
import * as ReadingListActions from './reading-list.actions';
import { API_PATH, SNACKBAR_ALERT } from '../constants';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ReadingListEffects implements OnInitEffects {
  loadReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.init),
      exhaustMap(() =>
        this.http.get<ReadingListItem[]>(API_PATH.READING_LIST).pipe(
          map(data =>
            ReadingListActions.loadReadingListSuccess({ list: data })
          ),
          catchError(error =>
            of(ReadingListActions.loadReadingListError({ error }))
          )
        )
      )
    )
  );

  addBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.addToReadingList),
      concatMap(({ book, showSnackbar = true }) =>
        this.http.post(API_PATH.READING_LIST, book).pipe(
          map(() =>
            ReadingListActions.confirmedAddToReadingList({
              data: book, 
              showSnackbar,
              isAdded: true
            })
          ),
          catchError(() =>
            of(ReadingListActions.failedAddToReadingList({ book }))
          )
        )
      )
    )
  );

  removeBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.removeFromReadingList),
      concatMap(({ item, showSnackbar = true }) =>
        this.http.delete(`${API_PATH.READING_LIST}/${item.bookId}`).pipe(
          map(() =>
            ReadingListActions.confirmedRemoveFromReadingList({
              data: item,
              showSnackbar,
              isAdded: false
            })
          ),
          catchError(() =>
            of(ReadingListActions.failedRemoveFromReadingList({ item }))
          )
        )
      )
    )
  );

  showSnackbar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ReadingListActions.confirmedAddToReadingList,
        ReadingListActions.confirmedRemoveFromReadingList
      ),
      filter(({ showSnackbar }) => showSnackbar),
      switchMap(({ data, isAdded }) =>
        this.snackbar
          .open(
            isAdded ? SNACKBAR_ALERT.ADD_BOOK : SNACKBAR_ALERT.REMOVE_BOOK,
            SNACKBAR_ALERT.UNDO_ACTION,
            {
              duration: SNACKBAR_ALERT.TIMEOUT
            }
          )
          .onAction()
          .pipe(
            map(() => {
              if (isAdded) {
                const book = data as Book;
                return ReadingListActions.removeFromReadingList({
                  item: { ...book, bookId: book.id },
                  showSnackbar: false
                });
              } else {
                const item = data as ReadingListItem;
                return ReadingListActions.addToReadingList({
                  book: { ...item, id: item.bookId },
                  showSnackbar: false
                });
              }
            })
          )
      )
    )
  );

  ngrxOnInitEffects() {
    return ReadingListActions.init();
  }

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private readonly snackbar: MatSnackBar
  ) {}
}