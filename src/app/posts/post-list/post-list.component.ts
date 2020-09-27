import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userAuth = false;
  userId: string;
  private postsSub: Subscription;
  private authSub: Subscription;

  constructor(private pService: PostsService, private aService: AuthService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.pService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.aService.getUserId();
    this.postsSub = this.pService
      .getPostListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
      });
    this.userAuth = this.aService.getIsAuth();
    this.authSub = this.aService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userAuth = isAuthenticated;
        this.userId = this.aService.getUserId();
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.pService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(id: string) {
    this.isLoading = true;
    this.pService.deletePost(id).subscribe(
      () => {
        this.pService.getPosts(this.postsPerPage, this.currentPage);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authSub.unsubscribe();
  }
}
