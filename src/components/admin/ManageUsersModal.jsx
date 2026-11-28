import React from 'react';
import Modal from '../common/Modal';
import UserAccountsManager from '../portal/profiles/UserAccountsManager';

export default function ManageUsersModal({ onClose }) {
  return (
    <Modal
      title="Manage Users, Roles & Permissions"
      subtitle="Add guild members with a Name, Username, and Password, then assign Guest, Smith, Harbinger, or Admin permissions."
      maxWidthClass="max-w-4xl"
      onClose={onClose}
    >
      <div className="p-5 overflow-y-auto">
        <UserAccountsManager showSearch={false} />
      </div>
    </Modal>
  );
}
