// # Tag Includes Helper
// Usage: '{{#tag_includes startsWith="example"}}
//
// Check if a posts tags start with a certain string

const logging = require('@tryghost/logging');
const tpl = require('@tryghost/tpl');

const messages = {
    substringNeeded: 'Need to pass a startsWith value to {{#tag_includes}}'
};

module.exports = function tagIncludes(options) {
    options = options || {};
    options.hash = options.hash || {};

    const startsWith = options.hash.startsWith;

    if (!startsWith) {
        logging.warn(tpl(messages.substringNeeded));
    }

    if (this.tags.find(tag => tag.name.startsWith(startsWith))) {
        return options.fn(this);
    }

    return options.inverse();
};