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
    error: string | null;
    fetchData: () => Promise<void>;
}

const fetchViewSeconds = async (): Promise<ApiResponse> => {
    const response = await fetch('https://664ac067a300e8795d42d1ff.mockapi.io/api/v1/numbers/1');
    if (!response.ok) {
        throw new Error(`Fetch error status: ${response.status}`);
    }

    const responseJson: ApiResponse = await response.json();
    return responseJson;
};

function useUniqViewSeconds(params?: UseUniqViewSecondsParams): UseUniqViewSecondsResult {
    const { shouldFetchInitially = false } = params || {};
    const [viewSeconds, setViewSeconds] = useState<number[]>([]);
    const [isFetchingViewSeconds, setIsFetchingViewSeconds] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            if (isFetchingViewSeconds) return;
            setIsFetchingViewSeconds(true);
            setError(null);

            const data = await fetchViewSeconds();

            const allSeconds: number[] = data?.numbers?.flat?.() || [];
            const uniqueSeconds = Array.from(new Set(allSeconds)).filter((e) => typeof e === 'number');
            uniqueSeconds.sort((a, b) => a - b);

            setViewSeconds(uniqueSeconds);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsFetchingViewSeconds(false);
        }
    };

    useEffect(() => {
        shouldFetchInitially && fetchData();
    }, []);

    return { viewSeconds, isFetchingViewSeconds, error, fetchData };
}

export default useUniqViewSeconds;
