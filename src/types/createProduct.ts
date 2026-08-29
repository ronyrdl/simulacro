export interface createProduct{
    name:string
    description?:string
    price:number
    stock:number
    categoryId:string
    images?: string[]
}