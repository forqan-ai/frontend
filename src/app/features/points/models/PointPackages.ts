export interface pointPakcage{
    id : string,
    name: string,
    points: number,
    price: number
}
export interface pointResponse{
    success:boolean,
    data:pointPakcage
}