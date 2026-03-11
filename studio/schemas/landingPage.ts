import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'landingPage',
    title: 'Landing Page',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            description: 'The main hero title (e.g., Sell Your Jacksonville House Fast)',
        }),
        defineField({
            name: 'heroDescription',
            title: 'Hero Description',
            type: 'text',
        }),
        defineField({
            name: 'heroCheckpoints',
            title: 'Hero Checkpoints',
            type: 'array',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'howItWorks',
            title: 'How It Works',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'title', type: 'string' },
                        { name: 'description', type: 'text' },
                        { name: 'icon', type: 'string', description: 'Lucide icon name (e.g. CircleHelp)' },
                    ],
                },
            ],
        }),
        defineField({
            name: 'faqs',
            title: 'FAQs',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'question', type: 'string' },
                        { name: 'answer', type: 'text' },
                    ],
                },
            ],
        }),
        defineField({
            name: 'contactInfo',
            title: 'Contact Info',
            type: 'object',
            fields: [
                { name: 'phone', type: 'string' },
                { name: 'email', type: 'string' },
                { name: 'address', type: 'text' },
            ],
        }),
    ],
})
