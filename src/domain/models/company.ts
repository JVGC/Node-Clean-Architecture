export interface Company{
    id: string;
    name: string;
    code: string // DECISION: Isso poderia ser CNPJ apenas, porém caso a company seja de outro país, seria bom generalizar isso.
}