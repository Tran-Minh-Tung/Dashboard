
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum HistoryAction {
    LOCK = "LOCK",
    UNLOCK = "UNLOCK",
    APPROVE = "APPROVE"
}

export enum HistoryType {
    POST = "POST",
    USER = "USER"
}

export enum Status {
    WAIT_APPROVE = "WAIT_APPROVE",
    PUBLISHED = "PUBLISHED",
    LOCKED = "LOCKED"
}

export class CommentInput {
    idPost: string;
    content: string;
}

export class CreatePlaceInput {
    name: string;
    description?: string;
    startAt?: number;
    endAt?: number;
}

export class CreateUserInput {
    FBID?: string;
    name?: string;
    gender?: string;
    birthday?: number;
    address?: string;
    email?: string;
    imageUrl?: string;
    username?: string;
    password?: string;
    permissions?: string[];
}

export class LoginUserInput {
    FBID?: string;
    username?: string;
    password?: string;
}

export class PostInput {
    title: string;
    summary?: string;
    content: string;
    imageUrlPost: string;
    tags: string[];
    status?: Status;
}

export class ReportInput {
    content?: string;
    type?: string;
    idTarget?: string;
}

export class UpdatePlaceInput {
    description?: string;
    startAt?: number;
    endAt?: number;
}

export class UpdateUserInput {
    name?: string;
    gender?: string;
    birthday?: number;
    address?: string;
    email?: string;
    description?: string;
}

export class Account {
    _id: string;
    username?: string;
    password?: string;
    permissions: string[];
    isLocked?: boolean;
    reason?: string;
    createdAt?: number;
    updatedAt?: number;
}

export class Album {
    _id: string;
    name?: string;
    images?: Image[];
    createdAt?: number;
    updatedAt?: number;
}

export class Comment {
    _id: string;
    commentBy?: UserResponse;
    idPost?: string;
    content?: string;
    createdAt?: number;
    updatedAt?: number;
}

export class History {
    _id: string;
    type?: HistoryType;
    action?: HistoryAction;
    actionBy?: UserResponse;
    content?: HistoryContent;
    createdAt?: number;
    updatedAt?: number;
}

export class HistoryContent {
    _id?: string;
    name?: string;
}

export class Image {
    _id: string;
    url: string;
    createdAt?: number;
    updatedAt?: number;
}

export class LoginResponse {
    accessToken?: string;
}

export abstract class IMutation {
    abstract lockAndUnlockAccount(_id: string, reason: string): boolean | Promise<boolean>;

    abstract changePassword(oldPassword: string, newPassword: string): boolean | Promise<boolean>;

    abstract changePermissions(_id: string, permissions?: string[]): boolean | Promise<boolean>;

    abstract createAlbum(name: string): Album | Promise<Album>;

    abstract deleteAlbum(_id: string): boolean | Promise<boolean>;

    abstract addImage(_id: string, imageUrl?: string): Album | Promise<Album>;

    abstract addMultiImage(_id: string, imageUrls?: string[]): Album | Promise<Album>;

    abstract removeImage(_id: string, idImage?: string): boolean | Promise<boolean>;

    abstract createComment(input: CommentInput): Comment | Promise<Comment>;

    abstract updateComment(_id: string, input: CommentInput): Comment | Promise<Comment>;

    abstract deleteComment(_id: string): boolean | Promise<boolean>;

    abstract createImage(url: string): boolean | Promise<boolean>;

    abstract createPlace(input: CreatePlaceInput): boolean | Promise<boolean>;

    abstract updatePlace(_id: string, input: UpdatePlaceInput): boolean | Promise<boolean>;

    abstract deletePlace(_id: string): boolean | Promise<boolean>;

    abstract addAlbum(_id: string, albumName: string): Place | Promise<Place>;

    abstract removeAlbum(_id: string, idAlbum: string): boolean | Promise<boolean>;

    abstract createPost(input: PostInput): boolean | Promise<boolean>;

    abstract updatePost(_id: string, input: PostInput): boolean | Promise<boolean>;

    abstract approvePost(_id: string): boolean | Promise<boolean>;

    abstract lockAndUnlockPost(_id: string, reason: string): boolean | Promise<boolean>;

    abstract likeAndUnlikePost(_id: string): boolean | Promise<boolean>;

    abstract createReport(input: ReportInput): boolean | Promise<boolean>;

    abstract register(input: CreateUserInput): boolean | Promise<boolean>;

    abstract login(input: LoginUserInput): LoginResponse | Promise<LoginResponse>;

    abstract followAndUnfollow(_id: string): boolean | Promise<boolean>;

    abstract createUser(input: CreateUserInput): UserResponse | Promise<UserResponse>;

    abstract updateUser(input: UpdateUserInput, _id?: string): UserResponse | Promise<UserResponse>;

    abstract updateAvatar(url: string): boolean | Promise<boolean>;
}

export class Permission {
    code: string;
    name: string;
}

export class Place {
    _id: string;
    name?: string;
    createdBy?: UserResponse;
    albums?: Album[];
    description?: string;
    startAt?: number;
    endAt?: number;
    createdAt?: number;
    updatedAt?: number;
}

export class Post {
    _id: string;
    title: string;
    summary?: string;
    content: string;
    imageUrlPost: string;
    tags: string[];
    status: Status;
    reason: string;
    createdBy: string;
    likedBy: string[];
    publishedAt: number;
    createdAt?: number;
    updatedAt?: number;
}

export class PostResponse {
    _id: string;
    title: string;
    summary?: string;
    content: string;
    imageUrlPost: string;
    tags: string[];
    status: Status;
    reason: string;
    createdBy: UserResponse;
    likedBy: UserResponse[];
    publishedAt?: number;
    numberOfReport?: number;
    createdAt?: number;
    updatedAt?: number;
}

export abstract class IQuery {
    abstract accounts(): Account[] | Promise<Account[]>;

    abstract album(_id: string): Album | Promise<Album>;

    abstract albumsByUser(_id: string): Album[] | Promise<Album[]>;

    abstract comments(idPost: string, limit: number, offset: number): Comment[] | Promise<Comment[]>;

    abstract history(): History[] | Promise<History[]>;

    abstract images(): Image[] | Promise<Image[]>;

    abstract permissions(): Permission[] | Promise<Permission[]>;

    abstract placesByUser(_id: string): Place[] | Promise<Place[]>;

    abstract numberOfPlace(_id: string): number | Promise<number>;

    abstract posts(status?: string, tags?: string, limit?: number, offset?: number, keyword?: string): PostResponse[] | Promise<PostResponse[]>;

    abstract postsByUser(_id: string, status?: string, tags?: string, limit?: number, offset?: number, keyword?: string): PostResponse[] | Promise<PostResponse[]>;

    abstract post(_id: string): PostResponse | Promise<PostResponse>;

    abstract numberOfPosts(status?: string, tags?: string, keyword?: string): number | Promise<number>;

    abstract numberOfPostByUser(_id: string): number | Promise<number>;

    abstract statisticalPost(_id?: string): Statistical[] | Promise<Statistical[]>;

    abstract statisticalStatusPost(): Statistical[] | Promise<Statistical[]>;

    abstract report(idTarget?: string): Report[] | Promise<Report[]>;

    abstract reportByType(type: string): Report[] | Promise<Report[]>;

    abstract me(): UserResponse | Promise<UserResponse>;

    abstract users(limit?: number, offset?: number, keyword?: string): UserResponse[] | Promise<UserResponse[]>;

    abstract user(_id: string): UserResponse | Promise<UserResponse>;

    abstract numberOfUsers(keyword?: string): number | Promise<number>;

    abstract userHighestPost(): UserResponse[] | Promise<UserResponse[]>;
}

export class Report {
    _id: string;
    reportedBy?: UserResponse;
    content?: string;
    type?: string;
    idTarget?: string;
    createdAt?: number;
    updatedAt?: number;
}

export class Statistical {
    _id?: string;
    count?: number;
}

export class User {
    _id: string;
    idAccount: string;
    name: string;
    gender?: string;
    followingBy?: string[];
    birthday?: number;
    address?: string;
    email?: string;
    imageUrl?: string;
    description?: string;
    createdAt: number;
    updatedAt: number;
}

export class UserResponse {
    _id?: string;
    account?: Account;
    name?: string;
    gender?: string;
    followers?: UserResponse[];
    birthday?: number;
    address?: string;
    email?: string;
    imageUrl?: string;
    description?: string;
    numberOfReport?: number;
    createdAt?: number;
    updatedAt?: number;
}

export type JSON = any;
export type JSONObject = any;
export type Upload = any;
