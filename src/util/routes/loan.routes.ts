export const ROUTE_LOAN_LIST = () => {
    return 'http://localhost:8080/api/loan';
};

export const ROUTE_LOAN_REGISTER = () => {
    return 'http://localhost:8080/api/loan';
};

export const ROUTE_LOAN_UPDATE = (loanId: number) => {
    return `http://localhost:8080/api/loan/${loanId}`;
}

export const ROUTE_LOAN_DELETE = (loanId: number) => {
    return `http://localhost:8080/api/loan/${loanId}`;
}
