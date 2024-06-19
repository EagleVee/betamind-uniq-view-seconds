import { renderHook } from '@testing-library/react-hooks';
import useUniqViewSeconds from '../useUniqViewSeconds'; // Adjust the path as necessary

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('useUniqViewSeconds', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should not fetch data if shouldFetchInitially is false', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            status: 200,
            json: JSON.stringify({
                id: '1',
                numbers: [
                    [1, 2, 3],
                    [3, 4, 5],
                ],
            }),
        });

        const { result } = renderHook(() => useUniqViewSeconds({ shouldFetchInitially: false }));

        expect(result.current.isFetchingViewSeconds).toBeFalsy();
    });

    it('should fetch and process data correctly', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            status: 200,
            json: jest.fn().mockResolvedValue({
                id: '1',
                numbers: [
                    [1, 2, 3],
                    [3, 4, 5],
                ],
            }),
        });

        const { result, waitForNextUpdate } = renderHook(() => useUniqViewSeconds({ shouldFetchInitially: true }));
        expect(result.current.isFetchingViewSeconds).toBeTruthy();

        await waitForNextUpdate();

        expect(result.current.viewSeconds).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle errors correctly', async () => {
        mockFetch.mockRejectedValue(new Error('API failure'));

        const { result, waitForNextUpdate } = renderHook(() => useUniqViewSeconds({ shouldFetchInitially: true }));

        expect(result.current.isFetchingViewSeconds).toBeTruthy();
        await waitForNextUpdate();

        expect(result.current.isFetchingViewSeconds).toBeFalsy();
        expect(result.current.error).toBe('API failure');
    });
});
