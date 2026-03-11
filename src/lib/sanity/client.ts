import { createClient } from '@sanity/client'

export const client = createClient({
    projectId: '6pvf5x4e',
    dataset: 'production',
    useCdn: true, // set to `false` for fresh data
    apiVersion: '2023-05-03',
})
