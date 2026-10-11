export function assignmentOptions(state, projectId) {
  const roleNames = { pm: 'Project manager', purchase: 'Purchase manager', staff: 'Internal staff', vendor: 'Vendor', service: 'Service provider' };
  return state.members.filter(m => m.project === projectId && roleNames[m.role]).map(m => {
    const u = state.users.find(u => u.id === m.user);
    if (!u) return null;
    const detail = m.role === 'vendor' ? m.itemName : (m.departments || []).join(', ');
    return { id: u.id, name: [u.name, roleNames[m.role], detail, u.email].filter(Boolean).join(' — ') };
  }).filter(Boolean);
}
