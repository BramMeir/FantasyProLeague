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
): Promise<T[]> {
    try {
        const response = await apiClient.get(endpoint);

        if (response.data && response.data.length > 0) {
            ref.value = response.data.map(fromJson);
        } else if (! response.data){
            ref.value = [fromJson(response.data)];
        }
    } catch (error: any) {
        console.error(error); // Log the error for debugging
    } finally {
        return ref.value;
    }
}


/**
 * Post data to an endpoint and get a list of items back.
 *
 * @param endpoint The API endpoint to post to.
 * @param payload The data to send in the request body.
 * @param ref The Vue ref to store the resulting list.
 * @param fromJson The function to convert raw JSON objects to typed instances.
 */
export async function postList<T>(
    endpoint: string,
    payload: any,
    ref: Ref<T[] | null>,
    fromJson: (data: any) => T,
): Promise<T[]> {
    try {
        const response = await apiClient.post(endpoint, payload);

        if (response.data && response.data.length > 0) {
            ref.value = response.data.map(fromJson);
        } else if (response.data) {
            ref.value = [fromJson(response.data)];
        } else {
            ref.value = [];
        }
    } catch (error: any) {
        console.error(error); // Log the error for debugging
        ref.value = [];
    } finally {
        return ref.value || [];
    }
}
