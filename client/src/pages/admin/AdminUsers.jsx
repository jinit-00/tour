import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { getAdminUsers, updateAdminUserRole, updateAdminUserVerify } from '../../services/api';
import { Shield, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAdminUsers();
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = async (id, currentRole) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    if (!window.confirm(`Change role to ${newRole}?`)) return;
    try {
      await updateAdminUserRole(id, newRole);
      fetchUsers();
    } catch (err) {
      alert('Failed to update user role.');
    }
  };

  const handleVerifyToggle = async (id, currentVerify) => {
    try {
      await updateAdminUserVerify(id, !currentVerify);
      fetchUsers();
    } catch (err) {
      alert('Failed to update verification status.');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">User Account Management</h2>
          <p className="text-xs text-slate-500">Manage registered client accounts, roles, and verification overrides</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Verified</th>
                <th className="p-4">Bookings Count</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr><td colSpan="7" className="p-8 text-center text-slate-400 font-mono">Loading user directory...</td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{u.name}</td>
                    <td className="p-4 font-mono text-xs text-slate-600">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                        u.role === 'ADMIN' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleVerifyToggle(u.id, u.isVerified)}
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded ${
                          u.isVerified ? 'text-emerald-700 bg-emerald-50' : 'text-slate-400 bg-slate-50'
                        }`}
                      >
                        {u.isVerified ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <XCircle className="w-3.5 h-3.5" />}
                        <span>{u.isVerified ? 'Verified' : 'Unverified'}</span>
                      </button>
                    </td>
                    <td className="p-4 font-mono text-xs font-bold text-slate-800">{u._count?.bookings || 0}</td>
                    <td className="p-4 text-xs font-mono text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleRoleToggle(u.id, u.role)}
                        className="text-xs font-semibold text-slate-600 hover:text-emerald-600 underline"
                      >
                        Toggle Role
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
