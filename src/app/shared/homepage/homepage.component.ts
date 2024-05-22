import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CategoryListComponent } from "../../features/pages/admin/category/category-list/category-list.component";
import { BookListComponent } from '../../features/pages/admin/book/book-list/book-list.component';
import { LayoutComponent } from "../layout/layout.component";
import { BookListForMembersComponent } from "../../features/pages/book/book-list-for-members/book-list-for-members.component";

import { ResponseModel } from '../../features/models/responseModel';
import { Announcement } from '../../features/models/Announcement';
import { FooterComponent } from '../layout/footer/footer.component';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/Auth.service';
import { Member } from '../../features/models/member';
import { TokenService } from '../../core/services/token.service';
import { AnnouncementService } from '../../features/services/Announcement.service';



@Component({
    selector: 'myhomepage',
    standalone: true,
    templateUrl: './homepage.component.html',
    styleUrl: './homepage.component.scss',
    imports: [CommonModule, FormsModule, CategoryListComponent, BookListComponent, BookListForMembersComponent, FooterComponent,RouterModule]
})
export class HomepageComponent {

announcementList: Announcement[]=[];
loggedInMember: Member | null=null;

constructor(private announcementService: AnnouncementService, public authService: AuthService, private tokenService: TokenService){}
ngOnInit():void{

}



    isLoggedIn():boolean{
      this.loggedInMember=this.authService.loggedInMember;
      return this.tokenService.hasToken();
    }
}