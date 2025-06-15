import React from 'react';
import { render } from '@testing-library/react';
import Home from '../src/pages/HomePage'; // Adjust the path if necessary
import { BrowserRouter } from 'react-router-dom';

jest.mock('../src/pages/App.module.css', () => ({})); // Adjust the path if necessary

// Mock image imports
jest.mock('../src/assets/testlogo.png', () => 'mock-image-path'); // Adjust the path if necessary

describe('Dashbaord Page', () => {
  test('renders without crashing', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
  });
});

const originalWarn = console.warn;

beforeAll(() => {
  console.warn = jest.fn();
});

afterAll(() => {
  console.warn = originalWarn;
});