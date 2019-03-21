/* global window */

import isSet from '@snipsonian/core/src/is/isSet';
import isNumber from '@snipsonian/core/src/is/isNumber';
import createFetchRequest, { RequestMethod } from './createFetchRequest';
import rejectPromiseOnHttpErrorStatus from './rejectPromiseOnHttpErrorStatus';

export interface IFetchRequestError extends TypeError {
    response: Response;
}

export interface IFetchRequestTimeOutRejectProps {
    status: number;
    errorCode: string;
}

let fetchFn = window.fetch;

export const DEFAULT_TIMEOUT_IN_MILLIS = 3000;
export const ERROR_CODE_TIMEOUT = 'TIMEOUT';

const fetcher = {
    fetch: ({
        url,
        method = RequestMethod.Get,
        body,
        nameValueHeaderPairs,
        timeoutInMillis = DEFAULT_TIMEOUT_IN_MILLIS,
    }: {
        url: string,
        method: RequestMethod,
        body?: object | string,
        nameValueHeaderPairs?: object,
        timeoutInMillis?: number,
    }) => {
        const fetchRequest = createFetchRequest({
            url,
            method,
            body,
            nameValueHeaderPairs,
        });

        return new Promise((resolve, reject) => {
            let timer: number;

            if (isValidTimeoutInMillis(timeoutInMillis)) {
                timer = window.setTimeout(
                    onTimeout,
                    timeoutInMillis,
                );
            }

            fetchFn.call(window, fetchRequest)
                .then((response: Response) => {
                    if (isSet(timer)) {
                        window.clearTimeout(timer);
                    }
                    resolve(rejectPromiseOnHttpErrorStatus(response));
                })
                .catch((error: TypeError | IFetchRequestError) => {
                    reject(error);
                });

            function onTimeout() {
                const rejectProps: IFetchRequestTimeOutRejectProps = {
                    status: 0,
                    errorCode: ERROR_CODE_TIMEOUT,
                };
                reject(rejectProps);
            }
        });
    },

    /**
     * You can override the actual fetch function e.g. with a dummy when running unit tests
     */
    setFetch: (fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>) => {
        fetchFn = fetch;
    },
};

export default fetcher;

function isValidTimeoutInMillis(timeoutInMillis: number) {
    return isSet(timeoutInMillis) && isNumber(timeoutInMillis) && (timeoutInMillis > 0);
}