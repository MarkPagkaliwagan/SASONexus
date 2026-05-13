"use client";

import { useState } from "react";
import { PersonnelForm } from "./PersonnelForm";
import { PersonnelList } from "./PersonnelList";

interface Position {
  id: number;
  name: string;
}

interface SasoUnit {
  id: number;
  name: string;
  slug: string;
  positions?: Position[];
}

interface PersonnelMember {
  id: number;
  name: string;
  position: string | null;
  email: string | null;
  contact: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  isHead: boolean;
  unitId: number | null;
  unit: { name: string } | null;
}

interface Props {
  units: SasoUnit[];
  personnel: PersonnelMember[];
}

export function PersonnelManager({ units, personnel }: Props) {
  const [editingPersonnel, setEditingPersonnel] = useState<PersonnelMember | null>(null);

  function handleEdit(member: PersonnelMember) {
    setEditingPersonnel(member);
  }

  function handleCancelEdit() {
    setEditingPersonnel(null);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <PersonnelForm
          units={units}
          editingPersonnel={editingPersonnel}
          onCancelEdit={handleCancelEdit}
        />
      </div>
      <div className="lg:col-span-2">
        <PersonnelList personnel={personnel} onEdit={handleEdit} />
      </div>
    </div>
  );
}
