/**
 * DO NOT USE import someModule from '...';
 * Chrome extensions don't support modules in content scripts.
 */
import('./ui');
import('./injected');

console.log('content loaded');
