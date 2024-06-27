import { renderHook, waitFor } from '@testing-library/react';
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
                    [4, 5, 6],
                ],
            }),
        });

        const { result } = renderHook(() => useUniqViewSeconds({ shouldFetchInitially: true }));
        expect(result.current.isFetchingViewSeconds).toBeTruthy();

        await waitFor(() => {
            expect(result.current.viewSeconds).toEqual([1, 2, 3, 4, 5, 6]);
        });
    });

    it('should handle errors correctly', async () => {
        mockFetch.mockRejectedValue(new Error('API failure'));

        const { result } = renderHook(() => useUniqViewSeconds({ shouldFetchInitially: true }));

        expect(result.current.isFetchingViewSeconds).toBeTruthy();
        await waitFor(() => {
            expect(result.current.isFetchingViewSeconds).toBeFalsy();
            expect(result.current.fetchViewSecondsError).toBe('API failure');
        });
    });
});
