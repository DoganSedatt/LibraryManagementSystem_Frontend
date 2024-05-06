import { Component } from '@angular/core';
import { FilterBookListForCategoryPipe } from '../../../../core/pipes/FilterBookListForCategory.pipe';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FilterlistPipe } from '../../../../core/pipes/filterlist.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { GetAllBook } from '../../../models/getAllBook';
import { Publisher } from '../../../models/publisher';
import { Category } from '../../../models/Category';
import { Author } from '../../../models/Author';
import { BookService } from '../../../services/book.service';
import { CategoryService } from '../../../services/category.service';
import { PublisherService } from '../../../services/publisher.service';
import { AuthorService } from '../../../services/author.service';
import { ResponseModel } from '../../../models/responseModel';

@Component({
  selector: 'app-book-list-for-members',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterModule, NgxPaginationModule, FilterlistPipe, FilterBookListForCategoryPipe],
  templateUrl: './book-list-for-members.component.html',
  styleUrl: './book-list-for-members.component.scss'
})
export class BookListForMembersComponent {
  title = 'pagination';
  POSTS: any;
  page: number = 1;
  count: number = 0;
  tableSize: number = 3;
  tableSizes: any = [5, 10, 15, 20];


  bookList: GetAllBook[] = [];
  categoryList: Category[] = [];
  publisherList: Publisher[] = [];
  authorList: Author[] = [];
  today: Date = new Date();
  searchKey: string = '';

  constructor(private bookService: BookService, private router: Router, private categoryService: CategoryService,
    private publisherService: PublisherService, private authorService: AuthorService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params["categoryId"]) {
        this.getBooksByCategoryId(params['categoryId']);
      }
      else if (params["authorId"]) {
        this.getBooksByAuthorId(params['authorId']);
      }
      else {
        this.getCategories();
        this.getPublishers();
        this.getAuthors();
        this.postList();
        this.getBooks();
      }
    })
  }

  onSelectBook(book: GetAllBook) {
    this.bookService.selectedBook = book; // Seçilen kitabı sakla
    this.router.navigate(['/loanTransaction']); // loan.html sayfasına yönlendir
  }
  getBooks() {
    this.bookService.getAll().subscribe({
      next: (response: ResponseModel<GetAllBook>) => {
        console.log('backendden cevap geldi:', response);
        this.bookList = response.items;
        console.log("BookList:", this.bookList)
        this.bookList.forEach(book => {
          console.log(book.name);
          let categoryId = book.categoryId
          let publisherId = book.publisherId;
          let authorId = book.authorId;
          const category = this.categoryList.find(category => category.id === categoryId);
          const publisher = this.publisherList.find(publisher => publisher.id === publisherId);
          const author = this.authorList.find(author => author.id === authorId);
          if (category && publisher && author) {

            book.categoryName = category.categoryName;
            book.publisherName = publisher.name;
            book.authorName = author.name;
          }
        })
      },
      error: (error) => {
        console.log('backendden hatalı cevap geldi.', error);
      },
      complete: () => {
        console.log('backend isteği sonlandı.');
      }
    });
  }

  getCategories() {
    this.categoryService.getAll().subscribe({
      next: (response: ResponseModel<Category>) => {
        console.log('backendden cevap geldi:', response);
        this.categoryList = response.items;
      },
      error: (error) => {
        console.log('backendden hatalı cevap geldi.', error);
      },
      complete: () => {
        console.log('backend isteği sonlandı.');
      }
    });
  }
  getPublishers() {
    this.publisherService.getAllPublisher().subscribe({
      next: (response: ResponseModel<Publisher>) => {
        console.log('backendden cevap geldi:', response);
        this.publisherList = response.items;
      },
      error: (error) => {
        console.log('backendden hatalı cevap geldi.', error);
      },
      complete: () => {
        console.log('backend isteği sonlandı.');
      }
    });
  }
  getAuthors() {
    this.authorService.getAllAuthors().subscribe({
      next: (response: ResponseModel<Author>) => {
        console.log('backendden cevap geldi:', response);
        this.authorList = response.items;
      },
      error: (error) => {
        console.log('backendden hatalı cevap geldi.', error);
      },
      complete: () => {
        console.log('backend isteği sonlandı.');
      }
    });
  }

  deleteBook(event: any, bookId: number) {
    if (confirm('Bu kitabı silmek istiyor musunuz ?')) {
      event.target.innerText = "Siliniyor...";
      this.bookService.deleteBook(bookId).subscribe((res: any) => {
        this.getBooks();
        console.log(res + " silinidi");
      });
    }
  }

  getBooksByCategoryId(categoryId: number) {
    this.bookService.getBooksByCategoryId(categoryId).subscribe((response) => {
      this.bookList = response.items;
    },
      error => {
        console.log(error)
      }
    )
  }
  getBooksByAuthorId(authorId: number) {
    this.bookService.getBooksByAuthorId(authorId).subscribe((response) => {
      this.bookList = response.items;
    },
      error => {
        console.log(error)
      }
    )
  }

  postList(): void {
    this.bookService.getAll().subscribe(response => {
      if (response && response.items) {
        this.POSTS = response.items;
        console.log(this.POSTS);
      }
    })
  }
  onTableDataChange(event: number): void {
    this.page = event;
    this.postList();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.postList();
  }

}
