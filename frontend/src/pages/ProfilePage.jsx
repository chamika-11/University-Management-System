import React, { useState } from 'react';
import { useMyProfile, useUpdateProfile, useAddresses, useAddAddress, useEmergencyContacts, useAddEmergencyContact } from '@/features/profile/useProfile';
import { FormField, Input, Textarea } from '@/components/forms/FormField';
import { Button } from '@/components/ui/Button';
import { SkeletonText } from '@/components/ui/Skeleton';
import { useToast } from '@/hooks/useToast';
import { parseError } from '@/utils/errorParser';
import { User, MapPin, Phone, Plus, Save } from 'lucide-react';

const Section = ({ title, icon: Icon, children }) => (
  <div className="card mb-4">
    <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-200 mb-5 pb-3 border-b border-white/5">
      <Icon size={16} className="text-indigo-400" /> {title}
    </h2>
    {children}
  </div>
);

const ProfilePage = () => {
  const { data: profile, isLoading } = useMyProfile();
  const { data: addresses } = useAddresses();
  const { data: contacts } = useEmergencyContacts();
  const updateProfile = useUpdateProfile();
  const addAddress = useAddAddress();
  const addContact = useAddEmergencyContact();
  const { showToast } = useToast();

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ street: '', city: '', country: '' });
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', relationship: '', phone: '' });

  const handleEditStart = () => {
    setForm({
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      phone: profile?.phone || '',
      bio: profile?.bio || '',
    });
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync(form);
      setEditMode(false);
      showToast({ message: 'Profile updated!', type: 'success' });
    } catch (err) {
      showToast({ message: parseError(err), type: 'error' });
    }
  };

  const handleAddAddress = async () => {
    try {
      await addAddress.mutateAsync(newAddress);
      setShowAddAddress(false);
      setNewAddress({ street: '', city: '', country: '' });
      showToast({ message: 'Address added!', type: 'success' });
    } catch (err) {
      showToast({ message: parseError(err), type: 'error' });
    }
  };

  const handleAddContact = async () => {
    try {
      await addContact.mutateAsync(newContact);
      setShowAddContact(false);
      setNewContact({ name: '', relationship: '', phone: '' });
      showToast({ message: 'Emergency contact added!', type: 'success' });
    } catch (err) {
      showToast({ message: parseError(err), type: 'error' });
    }
  };

  if (isLoading) return <div className="card"><SkeletonText lines={6} /></div>;

  return (
    <div className="animate-fade-in max-w-2xl">
      {/* Profile Info */}
      <Section title="Personal Information" icon={User}>
        {editMode ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="First Name" id="firstName">
                <Input id="firstName" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
              </FormField>
              <FormField label="Last Name" id="lastName">
                <Input id="lastName" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
              </FormField>
            </div>
            <FormField label="Phone" id="phone">
              <Input id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </FormField>
            <FormField label="Bio" id="bio">
              <Textarea id="bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} />
            </FormField>
            <div className="flex gap-3">
              <Button size="sm" loading={updateProfile.isPending} onClick={handleSave}><Save size={14} /> Save</Button>
              <Button size="sm" variant="secondary" onClick={() => setEditMode(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-2xl font-bold text-indigo-400">
                {profile?.firstName?.[0] || profile?.email?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-100">
                  {profile?.firstName} {profile?.lastName}
                </p>
                <p className="text-sm text-slate-500">{profile?.email}</p>
                {profile?.studentId && <p className="text-xs text-slate-600 mt-0.5">ID: {profile.studentId}</p>}
              </div>
            </div>
            {profile?.phone && <p className="text-sm text-slate-400"><span className="text-slate-600">Phone:</span> {profile.phone}</p>}
            {profile?.bio && <p className="text-sm text-slate-400">{profile.bio}</p>}
            <Button size="sm" variant="secondary" onClick={handleEditStart}>Edit Profile</Button>
          </div>
        )}
      </Section>

      {/* Addresses */}
      <Section title="Addresses" icon={MapPin}>
        {addresses?.length > 0 ? (
          <ul className="space-y-2 mb-4">
            {addresses.map((a, i) => (
              <li key={i} className="text-sm text-slate-400 bg-slate-800/40 rounded-lg px-3 py-2">
                {a.street}, {a.city}, {a.country}
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-slate-500 mb-4">No addresses on file.</p>}
        {showAddAddress ? (
          <div className="space-y-3 border border-white/10 rounded-xl p-4">
            <FormField label="Street" id="addr-street"><Input id="addr-street" value={newAddress.street} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} /></FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="City" id="addr-city"><Input id="addr-city" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} /></FormField>
              <FormField label="Country" id="addr-country"><Input id="addr-country" value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} /></FormField>
            </div>
            <div className="flex gap-2">
              <Button size="sm" loading={addAddress.isPending} onClick={handleAddAddress}>Save</Button>
              <Button size="sm" variant="secondary" onClick={() => setShowAddAddress(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <Button size="sm" variant="secondary" onClick={() => setShowAddAddress(true)}><Plus size={14} /> Add Address</Button>
        )}
      </Section>

      {/* Emergency Contacts */}
      <Section title="Emergency Contacts" icon={Phone}>
        {contacts?.length > 0 ? (
          <ul className="space-y-2 mb-4">
            {contacts.map((c, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-slate-400 bg-slate-800/40 rounded-lg px-3 py-2">
                <Phone size={13} className="text-slate-600" />
                <span><strong className="text-slate-300">{c.name}</strong> ({c.relationship}) — {c.phone}</span>
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-slate-500 mb-4">No emergency contacts on file.</p>}
        {showAddContact ? (
          <div className="space-y-3 border border-white/10 rounded-xl p-4">
            <FormField label="Name" id="ec-name"><Input id="ec-name" value={newContact.name} onChange={(e) => setNewContact({ ...newContact, name: e.target.value })} /></FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Relationship" id="ec-rel"><Input id="ec-rel" value={newContact.relationship} onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })} /></FormField>
              <FormField label="Phone" id="ec-phone"><Input id="ec-phone" type="tel" value={newContact.phone} onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })} /></FormField>
            </div>
            <div className="flex gap-2">
              <Button size="sm" loading={addContact.isPending} onClick={handleAddContact}>Save</Button>
              <Button size="sm" variant="secondary" onClick={() => setShowAddContact(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <Button size="sm" variant="secondary" onClick={() => setShowAddContact(true)}><Plus size={14} /> Add Contact</Button>
        )}
      </Section>
    </div>
  );
};

export default ProfilePage;
