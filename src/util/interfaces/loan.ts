export interface LoanForm {
    id: number;
    data_emprestimo: string;
    data_vencimento: string;
    moeda: string;
    valor_obtido: string;
    valor_final: string;
    customer_id: number
};

export interface LoanResponse {
    id: number;
    data_emprestimo: string;
    moeda: string;
    valor_obtido: number;
    data_vencimento: string;
    valor_final: number;
    customer: {
        id: number;
        cpf: string;
        name: string
    }
};