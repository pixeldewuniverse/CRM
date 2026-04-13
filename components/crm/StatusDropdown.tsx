'use client';

import { useMemo, useState } from 'react';
import { CUSTOMER_STATUSES } from '@/lib/customers-types';

type StatusDropdownProps = {
  id: string;
  currentStatus: string;
};

const statusStyles: Record<string, string> = {
  new: 'bg-gray-100 text-gray-700',
  contacted: 'bg-blue-100 text-blue-700',
  negotiation: 'bg-yellow-100 text-yellow-700',
  deal: 'bg-green-100 text-green-700',
  lost: 'bg-red-100 text-red-700'
};

export function StatusDropdown({ id, currentStatus }: StatusDropdownProps) {
  const safeInitialStatus = CUSTOMER_STATUSES.includes(currentStatus as (typeof CUSTOMER_STATUSES)[number])
    ? currentStatus
    : 'new';
  const [status, setStatus] = useState(safeInitialStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const selectColorClass = useMemo(() => {
    return statusStyles[status] || statusStyles.new;
  }, [status]);

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
      }
    } catch (error) {
      console.log('Failed to update customer status', error);
      setStatus(previousStatus);
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
        className={`rounded-md border border-slate-200 px-2.5 py-1.5 text-sm capitalize outline-none transition-colors duration-200 hover:brightness-95 focus:ring focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-70 ${selectColorClass}`}
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
