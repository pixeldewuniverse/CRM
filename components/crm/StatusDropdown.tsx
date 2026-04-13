'use client';

import { useState } from 'react';
import { CUSTOMER_STATUSES } from '@/lib/customers-types';

type StatusDropdownProps = {
  id: string;
  currentStatus: string;
};

export function StatusDropdown({ id, currentStatus }: StatusDropdownProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleStatusChange(nextStatus: string) {
    const previousStatus = status;
    setStatus(nextStatus);
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: nextStatus })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Failed to update customer status', errorData);
        setStatus(previousStatus);
        alert('Could not update customer status. Please try again.');
      }
    } catch (error) {
      console.log('Failed to update customer status', error);
      setStatus(previousStatus);
      alert('Could not update customer status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={(event) => handleStatusChange(event.target.value)}
        disabled={isUpdating}
        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm capitalize text-slate-700 outline-none ring-slate-300 focus:ring disabled:cursor-not-allowed disabled:opacity-60"
      >
        {CUSTOMER_STATUSES.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {isUpdating ? <span className="text-xs text-slate-500">Updating...</span> : null}
    </div>
  );
}
