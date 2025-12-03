import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ApplyForm from '../../pages/student/ApplyForm';
import api from '../../utils/api';

vi.mock('../../utils/api');

describe('ApplyForm', () => {
  beforeEach(() => {
    api.get.mockResolvedValue({
      data: {
        success: true,
        data: [
          { id: '1', name: 'Hostel A', gender: 'MALE' },
          { id: '2', name: 'Hostel B', gender: 'FEMALE' },
        ],
      },
    });
  });

  it('renders application form', async () => {
    render(
      <BrowserRouter>
        <ApplyForm />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Room Application')).toBeInTheDocument();
    });
  });
});

