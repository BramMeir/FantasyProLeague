import { type Ref } from 'vue';
import { apiClient } from '@/config/axios';

/**
 * Get an item.
 *
 * @param endpoint
 * @param ref
 * @param fromJson
 */
export async function get<T>(
    endpoint: string,
    ref: Ref<T | null>,
    fromJson: (data: any) => T,
): Promise<void> {
    try {
        const response = await apiClient.get(endpoint);

        if (response.data.results && response.data.results.length > 0) {
            ref.value = fromJson(response.data.results[0]);
        } else if (! response.data.results){
            ref.value = fromJson(response.data);
        }
    } catch (error: any) {
        console.error(error); // Log the error for debugging
    }
}

/**
 * Get a list of items.
 *
 * @param endpoint
 * @param ref
 * @param fromJson
 */
export async function getList<T>(
    endpoint: string,
    ref: Ref<T[] | null>,
    fromJson: (data: any) => T,
): Promise<void> {
    try {
        const response = await apiClient.get(endpoint);

        console.log(response);

        if (response.data && response.data.length > 0) {
            ref.value = response.data.map(fromJson);
        } else if (! response.data){
            ref.value = [fromJson(response.data)];
        }
    } catch (error: any) {
        console.error(error); // Log the error for debugging
    }
}
