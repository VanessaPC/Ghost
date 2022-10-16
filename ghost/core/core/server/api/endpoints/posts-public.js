const models = require('../../models');
const tpl = require('@tryghost/tpl');
const errors = require('@tryghost/errors');
const allowedIncludes = ['tags', 'authors', 'tiers'];

const messages = {
    postNotFound: 'Post not found.'
};
// This should be cleaned up to a utils file.
const readingTimeHelper = (frame) => {
    if (frame.options.columns.includes('reading_time') && !frame.options.columns.includes('html')) {
        frame.options.columns.push('html');
        frame.options.htmlFetchedForReadingTime = true;
    }
};

module.exports = {
    docName: 'posts',

    browse: {
        options: [
            'include',
            'filter',
            'fields',
            'formats',
            'limit',
            'order',
            'page',
            'debug',
            'absolute_urls'
        ],
        validation: {
            options: {
                include: {
                    values: allowedIncludes
                },
                formats: {
                    values: models.Post.allowedFormats
                }
            }
        },
        permissions: true,
        query(frame) {
            if (frame.options.columns) { 
                readingTimeHelper(frame);
            }

            return models.Post.findPage(frame.options);
        }
    },

    read: {
        options: [
            'include',
            'fields',
            'formats',
            'debug',
            'absolute_urls'
        ],
        data: [
            'id',
            'slug',
            'uuid'
        ],
        validation: {
            options: {
                include: {
                    values: allowedIncludes
                },
                formats: {
                    values: models.Post.allowedFormats
                }
            }
        },
        permissions: true,
        query(frame) {
            return models.Post.findOne(frame.data, frame.options)
                .then((model) => {
                    if (!model) {
                        throw new errors.NotFoundError({
                            message: tpl(messages.postNotFound)
                        });
                    }

                    return model;
                });
        }
    }
};
