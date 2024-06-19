import { useState, useEffect } from 'react';

interface ApiResponse {
    id: string;
    numbers: number[][];
}

interface UseUniqViewSecondsParams {
    shouldFetchInitially?: boolean;
}

interface UseUniqViewSecondsResult {
    viewSeconds: number[];
    isFetchingViewSeconds: boolean;
    fetchViewSecondsError: string | null;
    fetchData: () => Promise<void>;
}

const fetchViewSeconds = async (): Promise<ApiResponse> => {
    const response = await fetch('https://664ac067a300e8795d42d1ff.mockapi.io/api/v1/numbers/1');
    if (!response.ok) {
        throw new Error(`Fetch error status: ${response.status}`);
    }

    return await response.json();
};

const getUniqueViewSecondsFromResponse = (responseNumbers: number[][]) => {
    if (!responseNumbers || !responseNumbers.length) return [];
    const seconds = responseNumbers.flat().filter((n) => typeof n === 'number');
    const uniqueSeconds = Array.from(new Set(seconds));
    uniqueSeconds.sort((a, b) => a - b);

    return uniqueSeconds;
};

function useUniqViewSeconds(params?: UseUniqViewSecondsParams): UseUniqViewSecondsResult {
    const { shouldFetchInitially = false } = params || {};
    const [viewSeconds, setViewSeconds] = useState<number[]>([]);
    const [isFetchingViewSeconds, setIsFetchingViewSeconds] = useState(false);
    const [fetchViewSecondsError, setFetchViewSecondsError] = useState<string | null>(null);

    const fetchData = async () => {
        if (isFetchingViewSeconds) return;
        try {
            setIsFetchingViewSeconds(true);
            setFetchViewSecondsError(null);

            const response = await fetchViewSeconds();
            const { numbers = [] } = response || {};
            const uniqueSeconds = getUniqueViewSecondsFromResponse(numbers);
            setViewSeconds(uniqueSeconds);
        } catch (error: unknown) {
            setFetchViewSecondsError(error instanceof Error ? error.message : 'An unknown error occurred');
        } finally {
            setIsFetchingViewSeconds(false);
        }
    };

    useEffect(() => {
        shouldFetchInitially && fetchData();
    }, []);

    return { viewSeconds, isFetchingViewSeconds, fetchViewSecondsError, fetchData };
}

export default useUniqViewSeconds;
