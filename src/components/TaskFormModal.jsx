import { useState } from 'react';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '../data/constants';

export default function TaskFormModal({
  task,
  projects,
  users,
  currentUser,
  onSave,
  onClose,
}) {
  const [form, setForm] = useState(
    task || {
      title: '',
      description: '',
      status: 'To Do',
      priority: 'Medium',
      projectId: projects[0]?.id || 1,
      assigneeId: currentUser.id,
      dueDate: new Date(Date.now() + 7 * 86400000)
        .toISOString()
        .split('T')[0],
    }
  );

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = () => {
    if (!form.title) return;
    onSave({
      ...form,
      projectId: Number(form.projectId),
      assigneeId: Number(form.assigneeId),
    });
  };

  const projectMembers = users.filter(u => {
    const proj = projects.find(p => p.id === Number(form.projectId));
    return proj?.members.includes(u.id);
  });

  return (
    <Modal title={task ? 'Edit Task' : 'New Task'} onClose={onClose}>
      <Input
        label="Task Title *"
        placeholder="e.g. Design homepage mockup"
        value={form.title}
        onChange={e => set('title', e.target.value)}
      />
      <Input
        label="Description"
        as="textarea"
        placeholder="What needs to be done?"
        value={form.description}
        onChange={e => set('description', e.target.value)}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Input
          label="Status"
          as="select"
          value={form.status}
          onChange={e => set('status', e.target.value)}
        >
          {Object.keys(STATUS_CONFIG).map(s => (
            <option key={s}>{s}</option>
          ))}
        </Input>
        <Input
          label="Priority"
          as="select"
          value={form.priority}
          onChange={e => set('priority', e.target.value)}
        >
          {Object.keys(PRIORITY_CONFIG).map(p => (
            <option key={p}>{p}</option>
          ))}
        </Input>
      </div>
      <Input
        label="Project"
        as="select"
        value={form.projectId}
        onChange={e => set('projectId', e.target.value)}
      >
        {projects.map(p => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </Input>
      <Input
        label="Assignee"
        as="select"
        value={form.assigneeId}
        onChange={e => set('assigneeId', e.target.value)}
      >
        {(projectMembers.length ? projectMembers : users).map(u => (
          <option key={u.id} value={u.id}>
            {u.name} ({u.role})
          </option>
        ))}
      </Input>
      <Input
        label="Due Date"
        type="date"
        value={form.dueDate?.split('T')[0] || ''}
        onChange={e => set('dueDate', e.target.value)}
      />
      <div
        style={{
          display: 'flex',
          gap: 10,
          justifyContent: 'flex-end',
          marginTop: 8,
        }}
      >
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={save}>{task ? 'Update Task' : 'Create Task'}</Button>
      </div>
    </Modal>
  );
}
