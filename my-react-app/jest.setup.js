import '@testing-library/jest-dom';

// Polyfill for TextEncoder/TextDecoder (needed for React Router v7)
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
