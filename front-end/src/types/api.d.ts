export interface UserListResponse {
    data: User[];
    page: number;
    per_page: number;
    total_pages: number;
    support: {
        url: string;
        text: string;
    }
}