import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedTestingModule } from '@tmo/shared/testing';

import { BooksFeatureModule } from '../books-feature.module';
import { BookSearchComponent } from './book-search.component';
import { clearSearch, searchBooks } from '@tmo/books/data-access';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

describe('ProductsListComponent', () => {
  let component: BookSearchComponent;
  let fixture: ComponentFixture<BookSearchComponent>;
  let store: MockStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, NoopAnimationsModule, SharedTestingModule],
      providers: [provideMockStore()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookSearchComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Handle search term change', () => {
    it('should dispatch searchBooks action when search term is changed and is not empty after 500ms debounceTime', fakeAsync(() => {
      component.searchForm.setValue({ term: 'java' });
      tick(300);
      expect(store.dispatch).not.toHaveBeenCalled();

      component.searchForm.setValue({ term: 'javac' });
      tick(500);
      expect(store.dispatch).toHaveBeenCalledWith(searchBooks({ term: 'javac' }));
    }));

    it('should not dispatch searchBooks action when search term is not changed after 500ms debounceTime', fakeAsync(() => {
      component.searchForm.setValue({ term: 'java' });
      tick(500);
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        searchBooks({ term: 'java' })
      );

      component.searchForm.setValue({ term: 'javas' });
      component.searchForm.setValue({ term: 'java' });
      tick(500);
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        searchBooks({ term: 'java' })
      );
    }));

    it('should dispatch clearSearch action when search term is changed and is empty', fakeAsync(() => {
      component.searchForm.setValue({ term: '' });
      tick(500);
      expect(store.dispatch).toHaveBeenCalledWith(clearSearch());
    }));
  });
});