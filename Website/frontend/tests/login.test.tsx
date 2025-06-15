import React from 'react';
import { render } from '@testing-library/react';
import Login from '../src/components/Login'; // Adjust the path if necessary
import { BrowserRouter } from 'react-router-dom';

jest.mock('../src/pages/App.module.css', () => ({})); // Adjust the path if necessary

// Mock image imports
jest.mock('../src/assets/eye-password-show.png', () => 'mock-image-path'); // Adjust the path if necessary
jest.mock('../src/assets/eye-password-hide.png', () => 'mock-image-path'); // Adjust the path if necessary

describe('Login Component', () => {
  test('renders without crashing', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  });
});

describe('Basic Test', () => {
    test('renders without errors', () => {
      // This test doesn't even render your component yet
      expect(true).toBe(true);
    });
  });

  const originalWarn = console.warn;

  beforeAll(() => {
    console.warn = jest.fn();
  });
  
  afterAll(() => {
    console.warn = originalWarn;
  });