import axios from 'axios'

function errorsOrDefault(error, defaultErrorMessage = 'Request failed for an unknown reason') {
    return (error?.response?.data?.messages || error?.response?.data?.error)
        ? { message: error.response.data.error, code: error.response.data.code }
            ? { message: error.response.data.error, code: error.response.data.code }
            : { message: error.response.data.error, code: error.response.data.code }
        : [defaultErrorMessage];
}

const request = async function (req, defaultMsg) {
    try {
        const response = await axios(req);
        return response;
    } catch (e) {
        return {
            error: errorsOrDefault(e, defaultMsg),
            status: e?.response?.status
        };
    }
};

class Request {
    static get({ params = {}, url, headers = {}, responseType, defaultMsg } = {}) {
        return request(
            {
                method: 'GET',
                url,
                params,
                headers,
                responseType
            },
            defaultMsg
        );
    }

    static post({ data = {}, params = {}, url, headers = {}, responseType, defaultMsg } = {}) {
        return request(
            {
                method: 'POST',
                url,
                data,
                params,
                headers,
                responseType
            },
            defaultMsg
        );
    }

    static put({ data = {}, params = {}, url, headers = {}, responseType, defaultMsg } = {}) {
        return request(
            {
                method: 'PUT',
                url,
                data,
                params,
                headers,
                responseType
            },
            defaultMsg
        );
    }

    static patch({ data = {}, params = {}, url, headers = {}, responseType, defaultMsg } = {}) {
        return request(
            {
                method: 'PATCH',
                url,
                data,
                params,
                headers,
                responseType
            },
            defaultMsg
        );
    }

    static delete({ params = {}, url, headers = {}, responseType, defaultMsg } = {}) {
        return request(
            {
                method: 'DELETE',
                url,
                params,
                headers,
                responseType
            },
            defaultMsg
        );
    }
}

export default Request;
