interface ResultResponse {
    status: 'success' | 'error';
    message: String;
    data: {} | [];
}

export {ResultResponse}