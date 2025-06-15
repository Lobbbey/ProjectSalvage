import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Signup from '../src/components/Signup'; // Adjust the path to your Signup component
import '@testing-library/jest-dom';

// Mock CSS Module import
jest.mock('../src/pages/App.module.css', () => ({}));

// Mock image imports
jest.mock('../src/assets/eye-password-show.png', () => 'mock-show-icon');
jest.mock('../src/assets/eye-password-hide.png', () => 'mock-hide-icon');

// Mock useNavigate (still needed as the component uses it)
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock emailjs (still needed as the component uses it)
jest.mock('emailjs-com', () => ({
  send: jest.fn().mockResolvedValue({ text: 'Email sent' }),
}));

// Mock the global verifyEmail function (still needed as the component uses it)
global.verifyEmail = jest.fn().mockResolvedValue(0);

describe('Signup Component (Super Simple Tests - No Fetch Mock)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.verifyEmail.mockClear();
    mockNavigate.mockClear();
  });

  test('renders the "SIGN UP" text', () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    expect(screen.getByText('SIGN UP')).toBeInTheDocument();
  });

  test('renders the "Password" input field initially as type "password"', () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    const passwordInput = screen.getByPlaceholderText('Password');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  

  test('renders the "Confirm Password" input field initially as type "password"', () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
  });
});

const originalWarn = console.warn;

beforeAll(() => {
  console.warn = jest.fn();
});

afterAll(() => {
  console.warn = originalWarn;
});