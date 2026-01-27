import { render, screen } from '@testing-library/react';
import App from '../App';
import { describe, it, expect } from 'vitest';
import { AuthProvider } from '../contexts/AuthContext';

// Teste básico para garantir que o App renderiza sem crashar

describe('App', () => {
  it('renderiza sem erros', () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );
    // Garante que o botão de login está presente (tela de login)
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });
});
