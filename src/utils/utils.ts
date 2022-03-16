export const fileTypes: {[key:string]: {pattern?: RegExp, type: string}} = {
    'css': {
      type: 'css',
    },
    'scss': {
      type: 'css',
    },
    'sass': {
      type: 'css',
    },
    'less': {
      type: 'css',
    },
    'postcss': {
      type: 'css',
    },
    'javascript': {
      type: 'js',
    },
    'javascriptreact': {
      type: 'js',
    },
    'typescriptreact': {
      type: 'js',
    },
    'html': {
      type: 'html',
    },
    'php': {
      type: 'html',
    },
    'vue': {
      type: 'html',
      pattern: /(\s+(v-bind)?:class\s*=\s*["][{[][^"]*$)|(\s+(v-bind)?:class\s*=\s*['][{[][^']*$)/,
    },
    'svelte': {
      type: 'html',
      pattern: /(\s+class:\S*$)|((\s+class\s*=\s*["]\s*{?\s*)[^"]*$)|((\s+class\s*=\s*[']\s*{?\s*)[^']*$)|((\s+class\s*=\s*[`]\s*{?\s*)[^`]*$)/,
    },
  };
