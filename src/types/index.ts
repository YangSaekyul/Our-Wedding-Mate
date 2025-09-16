// 사용자 관련 타입
export interface User {
    id: string
    email: string
    name: string
    coupleId?: string
    createdAt: Date
}

export interface CreateUserData {
    email: string
    name: string
    password: string
}

export interface LoginData {
    email: string
    password: string
}

// 커플 관련 타입
export interface Couple {
    id: string
    weddingDate?: Date
    createdAt: Date
}

// 할 일 관련 타입
export interface Todo {
    id: string
    content: string
    dueDate?: Date
    isCompleted: boolean
    coupleId: string
    createdAt: Date
}

export interface CreateTodoData {
    content: string
    dueDate?: Date
}

export interface UpdateTodoData {
    content?: string
    dueDate?: Date
    isCompleted?: boolean
}

// 업체 관련 타입
export enum VendorCategory {
    WEDDING_HALL = 'WEDDING_HALL',
    STUDIO = 'STUDIO', 
    DRESS = 'DRESS',
    MAKEUP = 'MAKEUP',
    BOUQUET = 'BOUQUET',
    INVITATION = 'INVITATION',
    HONEYMOON = 'HONEYMOON',
    OTHER = 'OTHER'
}

export interface Vendor {
    id: string
    name: string
    category: VendorCategory
    contact?: string
    cost?: number
    pros?: string
    cons?: string
    status: string
    coupleId: string
    createdAt: Date
}

export interface CreateVendorData {
    name: string
    category: VendorCategory | string
    contact?: string
    cost?: number
    pros?: string
    cons?: string
    status?: string
}

export interface UpdateVendorData {
    name?: string
    category?: VendorCategory | string
    contact?: string
    cost?: number
    pros?: string
    cons?: string
    status?: string
}

// 예산 관련 타입
export interface BudgetItem {
    id: string
    category: string
    item: string
    amount: number
    paidBy: string
    coupleId: string
    createdAt: Date
}

export interface CreateBudgetItemData {
    category: string
    item: string
    amount: number
    paidBy: string
}

export interface UpdateBudgetItemData {
    category?: string
    item?: string
    amount?: number
    paidBy?: string
}

// 위시리스트 관련 타입
export interface WishlistItem {
    id: string
    itemName: string
    itemUrl?: string
    price?: number
    isPurchased: boolean
    coupleId: string
    createdAt: Date
}

export interface CreateWishlistItemData {
    itemName: string
    itemUrl?: string
    price?: number
}

export interface UpdateWishlistItemData {
    itemName?: string
    itemUrl?: string
    price?: number
    isPurchased?: boolean
}

// API 응답 타입
export interface ApiResponse<T = any> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

// 대시보드 데이터 타입
export interface DashboardData {
    weddingDate?: Date
    totalBudget: number
    spentAmount: number
    remainingBudget: number
    recentTodos: Todo[]
    recentVendors: Vendor[]
    recentBudgetItems: BudgetItem[]
}
