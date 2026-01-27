import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Pagination } from '../Pagination';


describe('Pagination', () => {
  it('renderiza corretamente e navega entre páginas', () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={onPageChange}
        totalItems={50}
        itemsPerPage={10}
      />
    );

    // O texto "Mostrando 11 a 20 de 50 resultados" está fragmentado em spans, então usamos um matcher customizado
    expect(screen.getByText((content, node) => {
      return node.textContent === 'Mostrando 11 a 20 de 50 resultados';
    })).toBeInTheDocument();

    fireEvent.click(screen.getByTitle('Próxima página'));
    expect(onPageChange).toHaveBeenCalledWith(3);

    fireEvent.click(screen.getByTitle('Página anterior'));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });
});
