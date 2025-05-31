import React from 'react';

interface User {
  fullName: string;
  email: string;
}

interface RecentUsersTableProps {
  users: User[];
  className?: string;
}

export const RecentUsersTable: React.FC<RecentUsersTableProps> = ({ users, className = '' }) => (
  <div className={`bg-white rounded w-full min-w-[600px] ${className}`}>
    {users.length === 0 ? (
      <div className="text-gray-500 p-4">No recent users found.</div>
    ) : (
      <table className="w-full text-sm rounded overflow-hidden border-collapse border-spacing-0 bg-white">
        <thead className="sticky top-0 z-10 bg-white">
          <tr className="border-b border-gray-400">
            <th className="py-3 px-3 text-left font-semibold text-xs whitespace-nowrap text-gray-900/70 uppercase">Name</th>
            <th className="py-3 px-3 text-left font-semibold text-xs whitespace-nowrap text-gray-900/70 uppercase">Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <tr key={idx} className="bg-white border-b border-gray-300 last:border-b-0 transition">
              <td className="py-3 px-2 sm:px-4 text-left">{user.fullName}</td>
              <td className="py-3 px-2 sm:px-4 text-left">{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
); 