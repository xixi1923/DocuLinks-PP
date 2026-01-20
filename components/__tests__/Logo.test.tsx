import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Logo from '../Logo';

test('renders Logo component', () => {
    render(<Logo />);
    const logoElement = screen.getByText('DocuLink');
    expect(logoElement).toBeInTheDocument();
});