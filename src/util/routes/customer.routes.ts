export const ROUTE_CUSTOMER_LIST = () => {
    return 'http://localhost:8080/api/customer';
};

export const ROUTE_CUSTOMER_REGISTER = () => {
    return 'http://localhost:8080/api/customer';
};

export const ROUTE_CUSTOMER_UPDATE = (customerId: number) => {
    return `http://localhost:8080/api/customer/${customerId}`;
}

export const ROUTE_CUSTOMER_DELETE = (customerId: number) => {
    return `http://localhost:8080/api/customer/${customerId}`;
}